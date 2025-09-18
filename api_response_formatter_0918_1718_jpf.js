// 代码生成时间: 2025-09-18 17:18:27
const { check, Match } = require('meteor/check');

// 定义API响应格式化工具类
class ApiResponseFormatter {
  // 构造函数
  constructor() {
    // 初始化工具类
  }

  // 格式化响应数据
  static formatResponse(data, statusCode, message) {
    // 参数校验
    check(data, Match.Maybe(Object));
    check(statusCode, Match.Integer);
    check(message, Match.Maybe(String));

    // 构造响应对象
    const response = {
      statusCode,
      message: message || 'Success',
      data: data || {}
    };

    // 返回格式化后的响应对象
    return response;
  }

  // 格式化错误响应
  static formatError(error) {
    // 参数校验
    check(error, Object);

    // 构造错误响应对象
    const response = {
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error',
      data: error.data || {}
    };

    // 返回格式化后的错误响应对象
    return response;
  }
}

// 导出模块
module.exports = ApiResponseFormatter;