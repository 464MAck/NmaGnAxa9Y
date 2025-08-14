// 代码生成时间: 2025-08-15 02:21:20
// test_data_generator.js
// 这是一个用JS和METEOR框架创建的测试数据生成器

// 导入Meteor核心包
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

// 定义测试数据生成器模块
export class TestDataGenerator {
  // 生成随机字符串
  static generateRandomString(length = 10) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // 生成随机数字
  static generateRandomNumber(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 生成随机日期
  static generateRandomDate(min = new Date(2000, 0, 1), max = new Date()) {
    const time = Math.random() * (max - min);
    return new Date(min.getTime() + time);
  }

  // 生成随机用户数据
  static generateRandomUserData() {
    try {
      const username = this.generateRandomString(8);
      const email = `${username}@example.com`;
      const password = this.generateRandomString(10);
      const age = this.generateRandomNumber(18, 65);
      const birthDate = this.generateRandomDate(new Date(1950, 0, 1), new Date(2005, 0, 1));
      return { username, email, password, age, birthDate };
    } catch (error) {
      throw new Error('Failed to generate random user data: ' + error.message);
    }
  }

  // 生成多个随机用户数据
  static generateMultipleRandomUserData(count = 10) {
    const users = [];
    for (let i = 0; i < count; i++) {
      const userData = this.generateRandomUserData();
      if (userData) {
        users.push(userData);
      }
    }
    return users;
  }
}

// 示例用法
Meteor.startup(() => {
  try {
    const userData = TestDataGenerator.generateRandomUserData();
    console.log('Generated user data:', userData);
  } catch (error) {
    console.error('Error generating user data:', error);
  }

  try {
    const multipleUsers = TestDataGenerator.generateMultipleRandomUserData(5);
    console.log('Generated multiple user data:', multipleUsers);
  } catch (error) {
    console.error('Error generating multiple user data:', error);
  }
});