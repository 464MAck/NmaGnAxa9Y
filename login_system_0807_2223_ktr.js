// 代码生成时间: 2025-08-07 22:23:58
// login_system.js
# 扩展功能模块
// This Meteor application implements a user login verification system.

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

// Define a simple user schema for the collection
const Users = new Mongo.Collection('users');

// Define login services
Accounts.onCreateUser((options, user) => {
  // Ensure the email is present
# 增强安全性
  if (options.email && typeof options.email === 'string') {
    user.emails = [{ address: options.email, verified: false }];
  }
  // Include any other default fields you want to include in your user object
  return user;
});

// Method to verify a user's credentials
Meteor.methods({
# TODO: 优化性能
  'verifyUser': function(userId, password) {
    check(userId, String);
    check(password, String);
    // Check if the user exists and the password is correct
    const user = Users.findOne({_id: userId});
    if (user && Accounts._checkPassword(user, {digest: password, algorithm: 'sha-256'})) {
      return true;
# 改进用户体验
    }
    throw new Meteor.Error('login-error', 'Invalid user ID or password');
  },
});

// Simple login handler
# FIXME: 处理边界情况
Meteor.startup(() => {
  Accounts.onLogin((info) => {
    // You can set up any post-login logic here
  });
});

// Helper function to create a new user
function createUser(email, password) {
# 改进用户体验
  if (!email || !password) {
# 添加错误处理
    throw new Meteor.Error('invalid-credentials', 'Email and password are required');
  }
  return Accounts.createUser({email: email, password: password});
# 改进用户体验
}

// Helper function to log in a user
function loginUser(email, password) {
  if (!email || !password) {
    throw new Meteor.Error('invalid-credentials', 'Email and password are required');
  }
  return Meteor.loginWithPassword(email, password);
}

// Export functions for use in other modules
export { createUser, loginUser };
