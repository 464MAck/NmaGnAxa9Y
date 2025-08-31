// 代码生成时间: 2025-08-31 15:05:20
// 引入Meteor框架的必要包
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/**
 * 用户登录验证系统
 * @module login_system
 */

/**
 * 检查用户名和密码是否正确
 * @function checkUserCredentials
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {boolean} 是否验证成功
 */
function checkUserCredentials(username, password) {
    // 查询数据库，检查用户名和密码是否匹配
    const user = Meteor.users.findOne({ username });
    if (user && user.services && user.services.password) {
        const hashedPassword = user.services.password.hashedPassword;
        return Accounts._checkPassword(user, { password }, { sha256: true });
    }
    return false;
}

/**
 * 登录验证函数
 * @function login
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {boolean} 登录是否成功
 */
function login(username, password) {
    try {
        if (checkUserCredentials(username, password)) {
            Meteor.loginWithPassword(username, password, (error) => {
                if (error) {
                    throw new Meteor.Error('login-error', '登录失败:', error.reason);
                }
                console.log('登录成功');
                return true;
            });
        } else {
            throw new Meteor.Error('login-failed', '用户名或密码错误');
        }
    } catch (error) {
        // 错误处理
        console.error('登录失败:', error);
        return false;
    }
}

// 暴露login函数供外部调用
export const LoginSystem = { login };

// 示例用法
if (Meteor.isServer) {
    Meteor.startup(() => {
        // 在服务器启动时，可以执行一些初始化操作
    });
}

// 客户端代码
if (Meteor.isClient) {
    Meteor.startup(() => {
        // 在客户端启动时，可以执行一些初始化操作
    });
}
