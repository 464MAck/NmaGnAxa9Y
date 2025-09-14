// 代码生成时间: 2025-09-14 19:42:25
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FilesCollection } from 'meteor/ostrio:files';
import { BrowserPolicy } from 'meteor/browser-policy-common';

// 文件集配置
const Images = new FilesCollection({
  collectionName: 'images',
  allowClientCode: false, // 禁止客户端代码执行
  maxSize: 10 * 1024 * 1024, // 10MB
  onBeforeUpload: function (file) {
    // 上传前检查文件类型和大小
    if (file.size <= this.maxSize) {
      return true;
    } else {
      return 'File is too large';
    }
  },
});

// 上传文件的方法
const uploadDocument = (file) => {
  try {
    const result = Images.insert(file);
    console.log('File uploaded successfully:', result);
    return result._id;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Meteor.Error('upload-error', 'Error uploading file', error);
  }
};

// 转换文档格式的方法
const convertDocumentFormat = (fileId) => {
  try {
    // 假设有一个第三方服务来转换文档，这里简化处理
    const file = Images.findOne(fileId);
    if (!file) {
      throw new Meteor.Error('file-not-found', 'File not found');
    }
    // 调用文档转换服务（这里省略具体实现）
    // 存储转换后的文件或返回转换结果
    // 这里返回一个简单的示例结果
    return {
      fileId,
      converted: true,
      message: 'Document converted successfully'
    };
  } catch (error) {
    console.error('Error converting document:', error);
    throw new Meteor.Error('convert-error', 'Error converting document', error);
  }
};

// 路由和模板
Meteor.startup(() => {
  // 设置路由
  FlowRouter.route('/document-convert', {
    name: 'DocumentConvert',
    action: function () {
      // 渲染模板
      Blaze.render(Template.documentConvert, {
        data: this.params
      });
    },
  });
});

// 文档转换模板
Template.documentConvert.helpers({
  // 帮助函数：文件上传状态
  uploadStatus() {
    return Template.instance().uploadStatus.get();
  },
  // 帮助函数：上传错误信息
  uploadError() {
    return Template.instance().uploadError.get();
  },
});

Template.documentConvert.events({
  // 事件：选择文件
  'change #document-file': function (event) {
    const fileInput = event.target;
    if (fileInput.files.length) {
      const file = fileInput.files[0];
      Template.instance().uploadStatus.set('Uploading...');
      Template.instance().uploadError.set('');
      uploadDocument(file).then((fileId) => {
        Template.instance().uploadStatus.set('');
        convertDocumentFormat(fileId).then((result) => {
          console.log(result);
        }).catch((error) => {
          Template.instance().uploadError.set(error.reason);
        });
      }).catch((error) => {
        Template.instance().uploadError.set(error.reason);
      });
    }
  },
});

Template.documentConvert.onCreated(function () {
  this.uploadStatus = new ReactiveVar('');
  this.uploadError = new ReactiveVar('');
});

// 确保浏览器策略允许文件上传
BrowserPolicy.content.allowFileUpload();