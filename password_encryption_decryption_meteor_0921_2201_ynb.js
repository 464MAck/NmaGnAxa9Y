// 代码生成时间: 2025-09-21 22:01:09
import { Meteor } from 'meteor/meteor';
import { Crypto } from 'meteor/random';

// 密码加密解密工具
// 使用 Meteor 的 Crypto 模块进行密码的加密和解密

// 加密密码
// @param {string} password - 要加密的密码
// @returns {string} 加密后的密码
function encryptPassword(password) {
  if (!password) {
    throw new Error('密码不能为空');
  }
  return Crypto.secretKey(password);
}

// 解密密码
// @param {string} encryptedPassword - 要解密的密码
// @returns {string} 解密后的密码
function decryptPassword(encryptedPassword) {
  if (!encryptedPassword) {
    throw new Error('加密密码不能为空');
  }
  // 注意：实际上 Crypto.secretKey() 生成的密钥是一次性的，不能被解密
  // 这里仅作为演示，真正的密码解密需要使用对称加密算法
  return encryptedPassword;
}

// Meteor 方法，用户可以通过它远程加密密码
Meteor.methods({
  'passwordEncrypt': function(password) {
    check(password, String);
    return encryptPassword(password);
  },
  'passwordDecrypt': function(encryptedPassword) {
    check(encryptedPassword, String);
    return decryptPassword(encryptedPassword);
  }
});

// 错误处理
// 如果 Meteor 方法抛出异常，客户端会收到错误信息
// 客户端需要根据错误信息进行相应的处理