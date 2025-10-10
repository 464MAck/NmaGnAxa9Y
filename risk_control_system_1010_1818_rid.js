// 代码生成时间: 2025-10-10 18:18:11
// risk_control_system.js
// This Meteor application implements a basic risk control system.

import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Define a schema for data validation
const RiskControlSchema = new SimpleSchema({
  operation: {
    type: String,
    label: 'Operation',
    allowedValues: ['buy', 'sell', 'transfer'],
  },
  amount: {
    type: Number,
    label: 'Amount',
    min: 0,
  },
  riskLevel: {
    type: String,
    label: 'Risk Level',
    allowedValues: ['low', 'medium', 'high'],
  },
});

// RiskControl collection
const RiskControls = new Mongo.Collection('riskControls');
RiskControls.attachSchema(RiskControlSchema);

// Validated method to insert a risk control entry
export const createRiskControl = new ValidatedMethod({
  name: 'riskControls.insert',
  check: [RiskControlSchema],
  run({ operation, amount, riskLevel }) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to create a risk control entry.');
    }
    // Check risk level and prevent high risk operations
    if (riskLevel === 'high') {
      throw new Meteor.Error('high-risk-operation', 'High risk operations are not allowed.');
    }
    // Insert the risk control entry
    return RiskControls.insert({
      userId: this.userId,
      operation,
      amount,
      riskLevel,
      createdAt: new Date(),
    });
  },
});

// Error handling for the createRiskControl method
createRiskControl._error => (error) => {
  if (error.error === 'high-risk-operation') {
    console.error('High risk operation attempted: ', error);
    return 'High risk operations are not allowed.';
  }
  return `Error: ${error.error} - ${error.reason}`;
};

// Publish the risk controls collection for subscribed users
Meteor.publish('riskControls', function () {
  if (this.userId) {
    return RiskControls.find({
      userId: this.userId,
    });
  } else {
    this.ready();
  }
});

// Client-side code to call the createRiskControl method
Meteor.startup(() => {
  Template.riskControl.onCreated(function () {
    this.createRiskControl = () => {
      Meteor.call('riskControls.insert', {
        operation: 'buy',
        amount: 100,
        riskLevel: 'medium',
      }, (error, result) => {
        if (error) {
          alert(error.reason);
        } else {
          console.log('Risk control entry created with ID: ', result);
        }
      });
    };
  });
});