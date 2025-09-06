// 代码生成时间: 2025-09-07 04:10:06
import { Mongo } from 'meteor/mongo';

// 数据模型设计
// 定义一个简单的用户集合
const Users = new Mongo.Collection('users');

// 定义用户集合的结构
Users.schema = new SimpleSchema({
  username: {
    type: String,
    label: 'Username',
    max: 50,
  },
  email: {
    type: String,
    label: 'Email',
    regEx: SimpleSchema.RegEx.Email,
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $currentDate: {} };
      } else {
        this.unset();
      }
    },
  },
  profile: {
    type: Object,
    optional: true,
    label: 'Profile',
  },
  'profile.age': {
    type: Number,
    label: 'Age',
    min: 0,
  },
  'profile.gender': {
    type: String,
    label: 'Gender',
    allowedValues: ['male', 'female', 'other'],
  },
});

// 添加错误处理
Users.attachSchema(Users.schema);

// 确保数据模型的可维护性和可扩展性
// 使用 Meteor 方法进行添加和删除操作
Meteor.methods({
  'addUser': function (user) {
    // 检查用户是否已登录
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in');
    }
    // 验证输入数据
    check(user, Users.schema);
    // 添加新用户
    Users.insert(user);
  },
  'removeUser': function (userId) {
    // 检查用户是否已登录
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in');
    }
    // 检查用户是否有权限删除此用户
    if (Users.findOne({ _id: userId }).userId !== this.userId) {
      throw new Meteor.Error('not-authorized', 'User cannot remove other users');
    }
    // 删除用户
    Users.remove({ _id: userId });
  },
});

// 导出数据模型
export { Users };
