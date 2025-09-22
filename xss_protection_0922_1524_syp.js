// 代码生成时间: 2025-09-22 15:24:29
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { HTML } from 'meteor/htmljs';
import { check } from 'meteor/check';

// 导入DOMPurify库用于防止XSS攻击
import DOMPurify from 'dompurify';

// 定义一个全局的DOMPurify配置，可以根据需要自定义配置
const domPurifyConfig = {
    ALLOWED_TAGS: [
        'b', 'i', 'u', 'p', 'br', 'strong', 'em', 'span',
        'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li',
        'blockquote', 'code', 'pre', 'img', 'a'
    ],
    ALLOWED_ATTR: [
        'href', 'src', 'alt', 'title', 'class', 'id'
    ]
};

// 定义一个自定义的sanitize函数用于清理HTML字符串
function sanitizeHTML(inputHTML) {
    // 使用DOMPurify清理HTML字符串
    const cleanHTML = DOMPurify.sanitize(inputHTML, domPurifyConfig);
    return cleanHTML;
}

// 定义一个自定义的helper函数，用于在模板中插入清理后的HTML内容
function cleanHTMLContent(content) {
    // 检查传入的内容
    check(content, String);
    
    // 清理HTML字符串
    return HTML.Raw(sanitizeHTML(content));
}

// 定义一个模板，用于展示如何使用cleanHTMLContent函数
Template.registerHelper('cleanHTMLContent', cleanHTMLContent);

// 定义一个示例路由，展示如何使用cleanHTMLContent函数
Router.route('/example', function () {
    this.render('exampleTemplate');
});

// 定义一个示例模板，展示如何使用cleanHTMLContent函数
Template.exampleTemplate.helpers({
    'exampleContent': function () {
        // 假设这是从用户输入或其他不可靠来源获取的HTML内容
        const unsafeHTML = '<script>alert("XSS Attack")</script><p>Hello, World!</p>';
        
        // 使用cleanHTMLContent函数清理HTML内容
        return cleanHTMLContent(unsafeHTML);
    }
});

// 添加错误处理，如果DOMPurify库未正确安装或配置，抛出错误
if (typeof DOMPurify === 'undefined') {
    throw new Error('DOMPurify library is required to prevent XSS attacks');
}

// 注释和文档
/**
 * @file xss_protection.js
 * @description This file implements XSS attack prevention using the Meteor framework and DOMPurify library.
 * It defines a helper function to sanitize HTML content and provides an example usage in a template.
 * @author Your Name
 * @version 1.0
 */