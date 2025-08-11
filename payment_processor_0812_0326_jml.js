// 代码生成时间: 2025-08-12 03:26:29
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Define a schema for payment information
const paymentSchema = new SimpleSchema({
  amount: {
    type: Number,
    min: 0.01
  },
  currency: {
    type: String,
    allowedValues: ['USD', 'EUR', 'GBP']
  },
  paymentMethod: {
    type: String,
    allowedValues: ['credit_card', 'paypal', 'bank_transfer']
  },
  status: {
    type: String,
    allowedValues: ['pending', 'paid', 'failed']
  }
});

// Collection to store payment information
const Payments = new Mongo.Collection('payments');

// Attach the schema to the collection
Payments.attachSchema(paymentSchema);

// Method to process payment
Meteor.methods({
  processPayment(orderId, paymentDetails) {
    // Check if the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to process payment.');
    }

    // Validate payment details
    check(paymentDetails, {
      amount: Number,
      currency: String,
      paymentMethod: String
    });

    // Create a new payment document
    const paymentId = Payments.insert({
      orderId,
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      paymentMethod: paymentDetails.paymentMethod,
      status: 'pending',
      createdAt: new Date(),
      userId: Meteor.userId()
    });

    // Simulate payment processing
    // In a real-world scenario, this would involve communicating with a payment gateway
    try {
      // Simulate a payment gateway response
      const paymentProcessed = Math.random() > 0.1; // 90% chance of success

      if (paymentProcessed) {
        Payments.update(paymentId, { $set: { status: 'paid' } });
      } else {
        Payments.update(paymentId, { $set: { status: 'failed' } });
        throw new Meteor.Error('payment-failed', 'Payment processing failed.');
      }
    } catch (error) {
      // Log error and update payment status
      console.error('Payment processing error:', error);
      Payments.update(paymentId, { $set: { status: 'failed' } });
      throw error;
    }
  }
});

// Publish payments for a user
Meteor.publish('payments', function() {
  if (!this.userId) {
    return [];
  }

  return Payments.find({ userId: this.userId });
});

// Error handling for not authorized error
Accounts.onLogin((error) => {
  if (error && error.error === 'not-authorized') {
    // Redirect to login page or show error message
    // This can be customized based on your application's needs
    Bert.alert(error.reason, 'danger');
  }
});
