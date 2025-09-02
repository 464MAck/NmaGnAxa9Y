// 代码生成时间: 2025-09-02 13:56:36
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import cheerio from 'cheerio';

// 定义一个函数来抓取并解析网页内容
function scrapeWebsite(url) {
  // 检查url是否有效
  if (!url) {
    throw new Error('URL is required');
  }
  
  try {
    // 使用HTTP客户端发送请求
    const response = HTTP.get(url);
    
    // 检查响应状态码
    if (response.statusCode !== 200) {
      throw new Error(`Failed to fetch the webpage, status code: ${response.statusCode}`);
    }
    
    // 使用cheerio解析响应的HTML内容
    const $ = cheerio.load(response.content);
    
    return parseContent($);
  } catch (error) {
    // 错误处理
    console.error('Error in scrapeWebsite:', error);
    throw error;
  }
}

// 定义一个函数来解析网页内容
function parseContent($) {
  // 这里可以根据需要解析网页中的特定内容
  // 例如，抓取所有段落
  const paragraphs = $('p').map(function() {
    return $(this).text().trim();
  }).get();
  
  return paragraphs;
}

// Meteor方法，允许从客户端调用抓取网站内容的函数
Meteor.methods({
  'scrapeWebsite': function(url) {
    // 检查用户是否已登录（如果需要的话）
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'User not logged in');
    }
    
    return scrapeWebsite(url);
  }
});

// 客户端调用示例
// 可以在客户端代码中添加以下代码来调用服务器端的方法
// Meteor.call('scrapeWebsite', 'https://example.com', function(error, result) {
//   if (error) {
//     console.error('Error:', error);
//   } else {
//     console.log('Scraped content:', result);
//   }
// });

// 文档说明：
// 本程序是一个简单的网页内容抓取工具，使用Meteor框架和cheerio库。
// scrapeWebsite函数负责发送HTTP请求并解析响应的HTML内容。
// parseContent函数用于提取网页中的特定内容，可以根据需要自定义。
// Meteor的方法允许从客户端安全地调用服务器端的抓取函数。
