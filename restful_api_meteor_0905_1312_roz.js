// 代码生成时间: 2025-09-05 13:12:12
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

// 定义一个简单的数据模型，用于存储API响应
const ApiResponses = new Mongo.Collection('apiResponses');

// 验证请求的数据是否合法
const validateRequest = (request) => {
  check(request, {
    url: String,
    query: Match.Optional(Object),
    method: Match.Optional(String),
  });
};

// 定义一个函数，用于处理发出HTTP请求并存储响应
const fetchAndStoreResponse = async (request) => {
  validateRequest(request);

  try {
    const response = await HTTP.call(request.method || 'GET', request.url, {
      query: request.query,
    });

    // 存储响应到数据库
    ApiResponses.insert({
      response: response.content,
      timestamp: new Date(),
    });

    return response.content;
  } catch (error) {
    throw new Meteor.Error('api-error', 'Failed to fetch data:', error.message);
  }
};

// 创建RESTful API接口
Meteor.methods({
  'api.call': async function (request) {
    // 确保方法被调用时，请求数据是合法的
    validateRequest(request);

    // 调用函数并返回结果
    return fetchAndStoreResponse(request);
  },
});

// 错误处理中间件
const errorHandlingMiddleware = (req, res, next) => {
  // 捕获后续中间件中的错误并返回
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    res.status(500).send('Internal Server Error');
  });

  next();
};

// 配置Web服务器
WebApp.connectHandlers.use(errorHandlingMiddleware);

// 注册路由处理器
WebApp.connectHandlers.use('/api/call', async (req, res) => {
  try {
    // 从请求中提取数据
    const { url, query, method } = req.query;
    const requestData = { url, query, method };

    // 调用Meteor方法
    const responseContent = await Meteor.call('api.call', requestData);

    // 发送响应
    res.status(200).json({
      status: 'success',
      data: responseContent,
    });
  } catch (error) {
    // 错误处理
    console.error('API Call Error:', error);
    res.status(error.error === 'api-error' ? 500 : 400).json({
      status: 'error',
      message: error.reason,
    });
  }
});