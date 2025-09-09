// 代码生成时间: 2025-09-09 13:13:31
// image_resizer_meteor_app.js
// 这个Meteor应用提供了图片尺寸批量调整的功能

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
# 添加错误处理
import { FS } from 'meteor/cfs:filesystem';
# 增强安全性
import { Storage } from 'meteor/cfs:storage';
import { check } from 'meteor/check';
import { Template } from 'meteor/templating';
import { FilesCollection } from 'meteor/cfs:files';
# NOTE: 重要实现细节

// 定义图片文件集合
const images = new FilesCollection({
  storagePath: 'private',
# TODO: 优化性能
  verbose: true,
  collectionName: 'images',
  onBeforeUpload(file) {
    // 检查文件类型是否为图片
    if (!/image\//.test(file.type)) {
      throw new Meteor.Error('Invalid file type');
    }
  },
  allowClientCode: false,
  interceptDownload: false,
  downloadRoute: '/images/:filename' // 定义图片下载路由
});

// 添加图片到集合的接口
Meteor.methods({
  'addImage': function (file) {
    check(file, Object);
    const result = images.insert(file);
    return result;
  },

  'resizeImages': function (targetWidth, targetHeight) {
    check(targetWidth, Number);
# 改进用户体验
    check(targetHeight, Number);
    // 获取所有图片文件
    const files = images.find().fetch();
    files.forEach(file => {
      const fileRecord = images.collection.findOne({_id: file._id});
      // 读取图片文件
      images.collection.readFile(fileRecord, function(err, fileData) {
        if (err) {
          throw new Meteor.Error('Error reading the file');
        }
# 优化算法效率
        // 这里可以添加图片处理逻辑，例如使用第三方库进行图片尺寸调整
        // 假设我们有一个resizeImage函数可以调整图片尺寸
        resizeImage(fileData, targetWidth, targetHeight, (err, resizedImageData) => {
          if (err) {
            throw new Meteor.Error('Error resizing the image');
          }
          // 将调整尺寸后的图片写回原文件
          images.collection.writeFile(fileRecord, resizedImageData, function(err) {
            if (err) {
              throw new Meteor.Error('Error writing the resized image');
            }
          });
        });
      });
    });
  },
});

// 假设有一个处理图片尺寸调整的函数
function resizeImage(imageData, width, height, callback) {
  // 这里可以使用第三方库如Jimp, Sharp等来实现图片尺寸调整
  // 以下代码仅为示例
# TODO: 优化性能
  // Jimp.read(imageData, (err, image) => {
  //   if (err) {
  //     return callback(err);
  //   }
  //   image.resize(width, height).getBuffer(Jimp.AUTO, (err, buffer) => {
  //     if (err) {
  //       return callback(err);
# FIXME: 处理边界情况
  //     }
# 扩展功能模块
  //     callback(null, buffer);
# 添加错误处理
  //   });
  // });
}

// 定义模板
# 改进用户体验
Template.imageUploader.helpers({
  images() {
    return images.find();
  },
});

Template.imageUploader.events({
  'change #imageUploads'(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onloadend = function() {
# NOTE: 重要实现细节
        Meteor.call('addImage', reader.result, file);
# TODO: 优化性能
      };
    }
  },
  'click .resize-button'(event) {
    event.preventDefault();
    const targetWidth = event.currentTarget.dataset.width;
    const targetHeight = event.currentTarget.dataset.height;
# 优化算法效率
    Meteor.call('resizeImages', targetWidth, targetHeight, function(error, result) {
# NOTE: 重要实现细节
      if (error) {
# TODO: 优化性能
        alert('Error resizing images: ' + error.message);
      } else {
        alert('Images resized successfully!');
      }
    });
  },
});