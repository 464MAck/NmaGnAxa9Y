// 代码生成时间: 2025-09-08 07:00:58
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { escapeHTML } from 'meteor/htmlescape';

// XSS防护模块
// 该模块提供XSS攻击的防护功能，通过转义HTML特殊字符来防止XSS攻击

// 定义一个函数，用于转义HTML，防止XSS攻击
const protectAgainstXSS = (input) => {
  // 检查输入参数是否为字符串
  check(input, String);

  // 使用Meteor的escapeHTML函数转义HTML特殊字符
  return escapeHTML(input);
};

// 导出防护函数，供其他模块使用
export const xssProtection = {
  protectAgainstXSS,
};

// 使用示例
Meteor.startup(() => {
  try {
    // 假设用户输入的内容
    const userInput = "<script>alert('XSS');</script>";

    // 防护XSS攻击
    const safeInput = protectAgainstXSS(userInput);

    // 打印防护后的结果
    console.log(safeInput);
  } catch (error) {
    // 错误处理
    console.error("Error occurred while protecting against XSS: ", error);
  }
});
