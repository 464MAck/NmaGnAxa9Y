// 代码生成时间: 2025-08-25 16:30:42
import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp';
import { check } from 'meteor/check';

// 消息通知系统的收藏
const Messages = new Mongo.Collection('messages');

// 检查消息参数的函数
function checkMessageFields(message) {
    check(message, {
        id: String,
        from: String,
        to: String,
        content: String,
        timestamp: Date
    });
}

// 发送消息的方法
Meteor.methods({
    'sendMessage': function(message) {
        // 检查消息的有效性
        checkMessageFields(message);
        
        // 检查是否有权限发送消息
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to send a message.');
        }
        
        // 添加发送者信息
        message.from = this.userId;
        
        // 添加时间戳
        message.timestamp = new Date();
        
        // 将消息插入数据库
        Messages.insert(message);
    }
});

// 消息订阅发布函数
Meteor.publish('messages', function() {
    // 检查订阅者是否有权限
    if (!this.userId) {
        return this.ready();
    }
    
    // 返回消息集合
    return Messages.find({
        $or: [{ to: this.userId }, { from: this.userId }]
    }, { sort: { timestamp: -1 } });
});

// 客户端方法，用于接收消息
Meteor.startup(() => {
    // 创建消息订阅
    Meteor.subscribe('messages');
    
    // 监听数据库变化并更新客户端消息列表
    Tracker.autorun(() => {
        const messagesHandle = Meteor.subscribe('messages');
        if (messagesHandle.ready()) {
            const messages = Messages.find().fetch();
            // 处理显示消息逻辑
            console.log('Messages:', messages);
        }
    });
});

// 注：此代码示例仅为消息通知系统的核心部分，实际项目中可能需要更复杂的逻辑和错误处理。
// 例如，处理网络错误、用户界面更新、消息状态跟踪等。