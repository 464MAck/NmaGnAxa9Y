// 代码生成时间: 2025-09-22 23:54:36
// 导入Meteor核心包
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// 创建权限集合
const Permissions = new Mongo.Collection('permissions');

// 定义用户结构
const UserSchema = new SimpleSchema({
  username: {
    type: String,
    regEx: /^[a-zA-Z0-9]{3,15}$/
  },
  roles: {
    type: [String],
    optional: true,
    defaultValue: []
  }
});

// 创建用户集合
const Users = new Mongo.Collection('users');
Users.attachSchema(UserSchema);

// 权限验证中间件
const checkUserPermission = (requiredRole) => {
  return function (hook) {
    const user = hook.params.user;
    if (!user) {
      return hook.done(new Meteor.Error('403', '用户未登录'));
    }
    if (!user.roles.includes(requiredRole)) {
      return hook.done(new Meteor.Error('403', '没有权限'));
    }
    return hook.continue;
  };
};

// 添加用户方法
Meteor.methods({
  'addUser': function (username, roles) {
    check(username, String);
    check(roles, [String]);
    if (!Roles.userIsInRole(this.userId, ['admin'])) {
      throw new Meteor.Error('403', '没有权限');
    }
    const user = Users.findOne({ username: username });
    if (user) {
      throw new Meteor.Error('409', '用户名已存在');
    }
    Users.insert({
      username: username,
      roles: roles
    });
  },
  'updateUserRoles': function (userId, roles) {
    check(userId, String);
    check(roles, [String]);
    if (!Roles.userIsInRole(this.userId, ['admin'])) {
      throw new Meteor.Error('403', '没有权限');
    }
    Users.update(userId, { $set: { roles: roles } });
  }
});

// 权限集合CRUD方法
Permissions.allow({
  'insert': () => {
    if (!Meteor.user()) {
      throw new Meteor.Error('403', '用户未登录');
    }
    if (!Meteor.user().roles.includes('admin')) {
      throw new Meteor.Error('403', '没有权限');
    }
  },
  'update': () => {
    if (!Meteor.user()) {
      throw new Meteor.Error('403', '用户未登录');
    }
    if (!Meteor.user().roles.includes('admin')) {
      throw new Meteor.Error('403', '没有权限');
    }
  },
  'remove': () => {
    if (!Meteor.user()) {
      throw new Meteor.Error('403', '用户未登录');
    }
    if (!Meteor.user().roles.includes('admin')) {
      throw new Meteor.Error('403', '没有权限');
    }
  }
});