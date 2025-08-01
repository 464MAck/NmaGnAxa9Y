// 代码生成时间: 2025-08-02 02:31:18
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

// Define the payment process function
export const processPayment = async (userId, paymentDetails) => {
  // Check if the parameters are valid
  check(userId, String);
  check(paymentDetails, {
    amount: Number,
    currency: String,
    paymentMethod: String
  });

  // Check if the user has sufficient funds
  const user = Meteor.users.findOne({ _id: userId });
  if (!user || user.profile.balance < paymentDetails.amount) {
    throw new Meteor.Error('insufficient-funds', 'User does not have sufficient funds for the payment.');
  }

  // Process the payment
  try {
    // Simulate payment processing (replace with actual payment processing logic)
    console.log(`Processing payment of ${paymentDetails.amount} ${paymentDetails.currency} using ${paymentDetails.paymentMethod}...`);

    // Update user balance
    Meteor.users.update({ _id: userId }, { $inc: { 'profile.balance': -paymentDetails.amount } });

    // Log the payment success
    console.log('Payment processed successfully.');

    // Return a success response
    return { success: true, message: 'Payment processed successfully.' };
  } catch (error) {
    // Log the error and throw a Meteor error
    console.error('Error processing payment:', error);
    throw new Meteor.Error('payment-error', 'An error occurred while processing the payment.', error);
  }
};

// Define publication for payment history
Meteor.publish('paymentHistory', function (userId) {
  // Check if the parameters are valid
  check(userId, String);

  // Return the payment history for the user
  return Meteor.users.find({ _id: userId }, {
    fields: { 'profile.balance': 1, 'profile.paymentHistory': 1 }
  });
});

// Define method for updating payment history
Meteor.methods({
  'updatePaymentHistory': function (userId, paymentDetails) {
    // Check if the parameters are valid
    check(userId, String);
    check(paymentDetails, {
      amount: Number,
      currency: String,
      paymentMethod: String
    });

    // Update payment history
    Meteor.users.update({ _id: userId }, {
      $push: { 'profile.paymentHistory': paymentDetails }
    });
  }
});