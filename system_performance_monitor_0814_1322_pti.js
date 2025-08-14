// 代码生成时间: 2025-08-14 13:22:48
// Import necessary Meteor packages
const { Meteor } = require('meteor/meteor');
const { check } = require('meteor/check');
const { HTTP } = require('meteor/http');

// Define a collection to store system metrics
const SystemMetrics = new Mongo.Collection('systemMetrics');

// Define a function to fetch system metrics
function fetchSystemMetrics() {
  try {
    // Use HTTP call to fetch system metrics
    const response = HTTP.get('http://api.system-metrics.com/metrics');
    
    if (response.statusCode === 200) {
      // Parse the response data
      const data = JSON.parse(response.content);
      
      // Insert the data into the collection
      SystemMetrics.insert({
        timestamp: new Date(),
        ...data
      });
    } else {
      throw new Error('Failed to fetch system metrics');
    }
  } catch (error) {
    // Log the error
    console.error('Error fetching system metrics:', error);
  }
}

// Define a Meteor method to call fetchSystemMetrics
Meteor.methods({
  'systemMetrics.fetch': function () {
    check(this.userId, String);
    fetchSystemMetrics();
  }
});

// Define a publication to provide system metrics to clients
Meteor.publish('systemMetrics', function () {
  if (!this.userId) {
    this.error(new Meteor.Error('not-authorized'));
  } else {
    return SystemMetrics.find({}, {
      fields: {
        timestamp: 1,
        cpu: 1,
        memory: 1,
        disk: 1
      }
    });
  }
});

// Define a client-side subscription to receive system metrics
Meteor.subscribe('systemMetrics');

// Define a client-side function to display system metrics
Template.body.helpers({
  systemMetrics() {
    return SystemMetrics.find();
  }
});

// Define a client-side template for system metrics
Template.body.events({
  'click .fetch-metrics': function () {
    Meteor.call('systemMetrics.fetch');
  }
});