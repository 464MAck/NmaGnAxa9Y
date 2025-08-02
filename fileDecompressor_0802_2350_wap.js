// 代码生成时间: 2025-08-02 23:50:40
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfsfilesystem'; // 导入文件系统
import { HTTP } from 'meteor/http'; // 用于下载
import archiver from 'archiver'; // 导入压缩库
import { check } from 'meteor/check'; // 用于检查数据类型
import { spawn } from 'child_process'; // 用于执行命令行指令

// 设置文件系统集合
FS.Collection("compressedFiles", {
  stores: [
    new FS.Store("compressedFiles", {
      path: "uploads",
      type: "GridFS"
    }),
  ],
  filter: {
    allow: {
      contentTypes: ['application/zip', 'application/x-rar-compressed']
    },
  },
  permissions: {
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return true;
    },
    download: function () {
      return true;
    },
  },
});

// 解压文件函数
const decompressFile = async (fileObj) => {
  // 检查文件是否是压缩文件
  if (!['application/zip', 'application/x-rar-compressed'].includes(fileObj.type)) {
    throw new Meteor.Error('Invalid file type', 'Only ZIP and RAR files are allowed');
  }

  // 创建输出目录
  const outputDir = `/tmp/${fileObj._id}`;
  Meteor.npmRequire('mkdirp').sync(outputDir);

  // 解压文件
  return new Promise((resolve, reject) => {
    const extract = Meteor.npmRequire('extract-zip');
    extract(fileObj.path, { dir: outputDir }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(outputDir);
      }
    });
  });
};

// API端点，用于上传和解压文件
Meteor.methods({
  "uploadAndDecompress": function (file) {
    check(file, FS.File);

    // 检查文件是否已存在于数据库
    const existingFile = FS._collections.compressedFiles.findOne({
      filename: file.name
    });
    if (existingFile) {
      throw new Meteor.Error('File already exists', 'File with the same name already exists in the database');
    }

    // 保存文件到文件系统
    FS._collections.compressedFiles.insert(file, (err, fileRef) => {
      if (err) {
        throw new Meteor.Error('Failed to save file', 'Failed to save file to the file system');
      }

      // 解压文件
      try {
        const outputDir = await decompressFile(fileRef);
        console.log(`File decompressed successfully. Output directory: ${outputDir}`);
      } catch (error) {
        throw new Meteor.Error('Decompression failed', error.message);
      }
    });
  },
});

// 客户端页面
Meteor.startup(() => {
  Template.body.helpers({
    files: function () {
      return FS._collections.compressedFiles.find();
    },
  });

  Template.body.events({
    'change #fileInput': function (event) {
      const file = event.target.files[0];
      if (file) {
        const fileObj = new FS.File(file);
        Meteor.call('uploadAndDecompress', fileObj);
      }
    },
  });
});