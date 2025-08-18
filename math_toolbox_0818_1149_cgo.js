// 代码生成时间: 2025-08-18 11:49:43
import { Meteor } from 'meteor/meteor';

// 定义一个MathToolbox类，包含了数学计算工具集
export class MathToolbox {
  // 计算两个数的和
  static add(a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      throw new Error('Both numbers must be finite numbers');
    }
    return a + b;
  }

  // 计算两个数的差
  static subtract(a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      throw new Error('Both numbers must be finite numbers');
    }
    return a - b;
  }

  // 计算两个数的乘积
  static multiply(a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      throw new Error('Both numbers must be finite numbers');
    }
    return a * b;
  }

  // 计算两个数的商
  static divide(a, b) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      throw new Error('Both numbers must be finite numbers');
    }
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }

  // 计算一个数的平方根
  static sqrt(number) {
    if (!Number.isFinite(number)) {
      throw new Error('Number must be finite');
    }
    if (number < 0) {
      throw new Error('Cannot calculate square root of negative number');
    }
    return Math.sqrt(number);
  }

  // 计算一个数的幂
  static power(base, exponent) {
    if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
      throw new Error('Base and exponent must be finite numbers');
    }
    return Math.pow(base, exponent);
  }
}

// 暴露MathToolbox类以便在Meteor中使用
Meteor.startup(() => {
  // 这里可以注册全局helpers或者methods
});