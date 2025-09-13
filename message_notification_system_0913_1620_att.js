// 代码生成时间: 2025-09-13 16:20:46
// Import Meteor packages and other necessary modules.
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
# 改进用户体验
import { Mongo } from 'meteor/mongo';

// Define a collection to store messages.
export const Messages = new Mongo.Collection('messages');

// Define a schema for validation using SimpleSchema.
import SimpleSchema from 'simpl-schema';
const messageSchema = new SimpleSchema({
  text: {
    type: String,
    label: 'Message Text',
# 优化算法效率
    max: 500
  },
  createdAt: {
    type: Date,
    label: 'Creation Date',
    autoValue: () => new Date(),
# TODO: 优化性能
    autoform: {
      omit: true
    }
  }
});
Messages.attachSchema(messageSchema);

// Method to send a message.
Meteor.methods({
  'sendMessage': function(messageText) {
    check(messageText, String); // Validate the input.
    
    // Check if the user is logged in.
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to send a message.');
# 改进用户体验
    }
    
    try {
# NOTE: 重要实现细节
      // Insert the message into the collection.
# 扩展功能模块
      const messageId = Messages.insert({
# NOTE: 重要实现细节
        text: messageText,
        userId: Meteor.userId() // Associate the message with the user.
      });
      
      // Publish the new message to all subscribers.
      Meteor.call('notifyUsers', messageId);
    } catch (error) {
      // Handle any errors that occur during the message sending process.
      throw new Meteor.Error('message-error', 'An error occurred while sending the message.', error);
    }
# 添加错误处理
  },
  
  // Method to notify all users about a new message.
  'notifyUsers': function(messageId) {
    check(messageId, String); // Validate the input.
    
    // Publish the message to all users.
# 扩展功能模块
    const message = Messages.findOne(messageId);
    if (message) {
      // Broadcasting the message to all users.
      Meteor.call('broadcastMessage', message);
    } else {
      throw new Meteor.Error('message-not-found', 'The message was not found.');
    }
  },
# NOTE: 重要实现细节
  
  // Method to broadcast a message to all users.
  'broadcastMessage': function(message) {
    // Publish the message to all users.
    Meteor.ソcket.emit('newMessage', message);
  }
});

// Subscription to receive new messages.
Meteor.subscribe('messages');

// Server-side publication of messages limited by time.
Meteor.publish('messages', function() {
  return Messages.find({}, {sort: {createdAt: -1}});
});