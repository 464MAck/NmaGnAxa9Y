// 代码生成时间: 2025-09-21 06:28:17
// 导入必要的Meteor包
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// 用户模型
class User {
  // 用户登录
  static login(email, password) {
    try {
      // 使用Meteor的loginWithPassword方法进行登录
      const userId = Meteor.loginWithPassword(email, password);
      if (userId) {
        console.log('登录成功');
      } else {
        throw new Error('登录失败，请检查用户名和密码');
      }
    } catch (error) {
      console.error('登录错误:', error.message);
    }
  }

  // 用户注册
  static register(email, username, password) {
    try {
      // 使用Meteor的Accounts.createUser方法注册用户
      const userId = Accounts.createUser({
        email,
        username,
        password
      });
      if (userId) {
        console.log('注册成功');
      } else {
        throw new Error('注册失败，请检查输入的信息');
      }
    } catch (error) {
      console.error('注册错误:', error.message);
    }
  }
}

// 示例：注册和登录
Meteor.startup(() => {
  // 注册用户
  User.register('example@example.com', 'exampleUser', 'password123');
  
  // 登录用户
  User.login('example@example.com', 'password123');
});