// 代码生成时间: 2025-08-05 14:11:07
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import readline from 'readline';

// 定义一个CSV文件处理器类
class CSVBatchProcessor {
  constructor() {
    // 设置文件存储集合配置
    FS.Collection.prototype.configureUploads({
      storagePath: '/uploads/csv/',
      collectionName: 'csvFiles',
      onBeforeUpload: this.validateFile.bind(this),
      allowClientCode: false,
    });
  }

  // 验证上传的文件是否为CSV格式
  validateFile(file) {
    if (!file.extension || file.extension.toLowerCase() !== 'csv') {
      throw new Meteor.Error('invalid-file', 'Invalid file type. Please upload a CSV file.');
    }
    return true;
  }

  // 处理单个CSV文件的方法
  processCSVFile(fileId) {
    return new Promise((resolve, reject) => {
      const file = FS.File.findOne(fileId);
      if (!file) {
        return reject(new Error('File not found'));
      }

      const readStream = createReadStream(file.path);
      const csvStream = readStream.pipe(csv());
      const results = [];

      csvStream.on('data', (data) => {
        results.push(data);
      }).on('end', () => {
        resolve(results);
      }).on('error', (error) => {
        reject(error);
      });
    });
  }

  // 处理所有CSV文件的方法
  processAllCSVFiles() {
    return new Promise((resolve, reject) => {
      const files = FS.File.find({
        type: 'text/csv'
      }).forEach((file) => {
        this.processCSVFile(file._id).then((result) => {
          console.log('Processed file:', file.name);
          console.log('Results:', result);
        }).catch((error) => {
          console.error('Error processing file:', file.name);
          console.error('Error:', error);
        });
      });
      resolve('All CSV files processed.');
    });
  }
}

// 创建CSVBatchProcessor实例
const csvProcessor = new CSVBatchProcessor();

// 通过Meteor方法暴露处理所有CSV文件的方法
Meteor.methods({
  'processAllCSVFiles': function () {
    try {
      return csvProcessor.processAllCSVFiles();
    } catch (error) {
      throw new Meteor.Error('process-all-csv-error', error.message);
    }
  },
});
