// 代码生成时间: 2025-10-05 20:05:48
// 引入Meteor框架所需的包
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// 定义一个名为RfidTags的集合，用于存储RFID标签数据
const RfidTags = new Mongo.Collection('rfidTags');

// 定义RFID标签的Schema
const RfidSchema = new SimpleSchema({
  identifier: {
    type: String,
    label: '唯一标识',
    max: 50
  },
  location: {
    type: String,
    label: '位置',
    optional: true
  },
  status: {
    type: String,
    label: '状态',
    allowedValues: ['active', 'inactive'],
    defaultValue: 'active'
  }
});

// 为RfidTags集合应用Schema验证
RfidTags.attachSchema(RfidSchema);

// 方法：添加RFID标签
Meteor.methods({
  'rfid.addTag': function(tagData) {
    check(tagData, RfidSchema);
    try {
      const tagId = RfidTags.insert(tagData);
      return tagId;
    } catch (error) {
      throw new Meteor.Error('rfid.addTag.error', '添加RFID标签时发生错误', error);
    }
  }
});

// 方法：更新RFID标签
Meteor.methods({
  'rfid.updateTag': function(tagId, updateData) {
    check(tagId, String);
    check(updateData, RfidSchema);
    try {
      const result = RfidTags.update({_id: tagId}, {$set: updateData});
      if (result === 0) throw new Meteor.Error('rfid.updateTag.notFound', '更新RFID标签时未找到');
    } catch (error) {
      throw new Meteor.Error('rfid.updateTag.error', '更新RFID标签时发生错误', error);
    }
  }
});

// 方法：删除RFID标签
Meteor.methods({
  'rfid.removeTag': function(tagId) {
    check(tagId, String);
    try {
      const result = RfidTags.remove({_id: tagId});
      if (result === 0) throw new Meteor.Error('rfid.removeTag.notFound', '删除RFID标签时未找到');
    } catch (error) {
      throw new Meteor.Error('rfid.removeTag.error', '删除RFID标签时发生错误', error);
    }
  }
});

// 方法：查询RFID标签
Meteor.publish('rfid.getAllTags', function() {
  return RfidTags.find();
});

// 客户端代码，用于调用服务器端方法和订阅数据
Meteor.startup(() => {
  // ... 客户端代码，例如界面渲染和用户交互处理 ...
});