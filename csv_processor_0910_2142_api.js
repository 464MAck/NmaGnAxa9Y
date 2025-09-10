// 代码生成时间: 2025-09-10 21:42:53
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs';
import { check } from 'meteor/check';
import Papa from 'papaparse';

// 设置CSV文件集合
FS.Collection('csvFiles', {
  stores: [
    FS.Store.GridFS('csvFiles')
  ]
});

// CSV文件处理器类
class CSVProcessor {
  constructor() {
    this.csvData = [];
  }

  // 解析CSV文件
  parseCSV(file) {
    try {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const csvData = Papa.parse(e.target.result);
        this.csvData = csvData.data;
        console.log('CSV Data:', this.csvData);
        this.processData();
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    } catch (error) {
      console.error('Error parsing CSV:', error);
    }
  }

  // 处理CSV数据
  processData() {
    // 执行数据处理逻辑
    console.log('Processing CSV data...');
    // 示例：输出数据到控制台
    this.csvData.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });
  }
}

// 定义上传CSV文件的方法
Meteor.methods({
  'uploadCSV': function(file) {
    check(file, File);
    const csvFile = FS.File.fileStore('csvFiles', file._id, file);
    CSVProcessorInstance = new CSVProcessor();
    CSVProcessorInstance.parseCSV(csvFile);
  }
});

// 客户端上传文件的示例
Template.uploadCSV.events({
  'change #csvFileInput': function(event) {
    event.preventDefault();
    const files = event.target.files;
    for (let file of files) {
      Meteor.call('uploadCSV', file);
    }
  }
});