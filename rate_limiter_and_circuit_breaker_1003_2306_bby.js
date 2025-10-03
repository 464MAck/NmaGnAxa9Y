// 代码生成时间: 2025-10-03 23:06:02
// rate_limiter_and_circuit_breaker.js
// 使用Meteor框架实现API限流和熔断器

import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { HTTP } from 'meteor/http';

// API限流配置
Meteor.startup(() => {
  // 设置默认的限流配置
  DDPRateLimiter.defaultOptions = {
    numRequests: 5, // 每个用户每分钟最多请求5次
    ttl: 60 // 请求限制的时间窗口是60秒
  };
});

// 实现一个简单的熔断器
class CircuitBreaker {
  constructor() {
    this.isOpen = false;
    this.resetTime = Date.now();
    this.threshold = 5; // 错误阈值
    this.errorWindow = [];
  }

  // 检查熔断器状态
  checkState(serviceName) {
    if (this.isOpen && (Date.now() - this.resetTime) < 30000) {
      // 如果熔断器打开，并且时间未到，返回错误
      throw new Meteor.Error(503, 'Service is currently unavailable');
    }
  }

  // 报告错误
  reportError() {
    if (this.errorWindow.length < this.threshold) {
      this.errorWindow.push(Date.now());
    } else {
      // 如果错误超过阈值，打开熔断器
      this.isOpen = true;
      this.resetTime = Date.now();
    }
  }

  // 报告成功
  reportSuccess() {
    if (this.errorWindow.length === 0) {
      // 如果没有错误，关闭熔断器
      this.isOpen = false;
    } else {
      this.errorWindow.shift();
    }
  }
}

// 创建熔断器实例
const circuitBreaker = new CircuitBreaker();

// 配置服务
ServiceConfiguration.configurations.remove({ service: 'http' });
ServiceConfiguration.configurations.insert({
  service: 'http',
  token: 'your_token_here' // 替换为你的API令牌
});

// 创建一个受限制的API端点
Meteor.methods({
  'apiCall': function () {
    // 检查熔断器状态
    try {
      circuitBreaker.checkState('apiCall');
    } catch (error) {
      return error;
    }

    try {
      // 调用外部HTTP服务
      const response = HTTP.call('GET', 'https://api.example.com/data');
      if (response.statusCode === 200) {
        // 报告成功
        circuitBreaker.reportSuccess();
        return response.data;
      } else {
        // 报告错误
        circuitBreaker.reportError();
        throw new Meteor.Error(response.statusCode, 'Failed to fetch data from external service');
      }
    } catch (error) {
      // 报告错误
      circuitBreaker.reportError();
      throw error;
    }
  }
});

// 添加限流规则
DDPRateLimiter.addRule({
  name: 'apiCall',
  connections: (userId) => {
    return DDPRateLimiter.getRule('default')..connections(userId);
  }
});
