// 代码生成时间: 2025-08-12 23:54:58
 * It ensures easy maintenance, scalability, and best practices are followed.
 */

// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Create a collection to store error logs
const ErrorLogs = new Mongo.Collection('errorLogs');

// Define a schema for error logs using SimpleSchema from aldeed:autoform
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

const ErrorLogSchema = new SimpleSchema({
  timestamp: {
    type: Date,
  type: String,
  },
  severity: {
    type: String,
    label: "Error Severity",
  max: 50,
  },
  message: {
    type: String,
    label: "Error Message",
    max: 500,
  },
  stack: {
    type: String,
    optional: true,
    label: "Error Stack Trace",
    max: 2000,
  },
  source: {
    type: String,
    label: "Error Source",
    max: 200,
  },
  userId: {
    type: String,
    optional: true,
    label: "User ID",
  },
});

// Create a ValidatedMethod for logging errors
export const logError = new ValidatedMethod({
  name: 'logError',
  validate: ErrorLogSchema,
  run({ timestamp, severity, message, stack, source, userId }) {
    // Check if the user is logged in and get their ID if necessary
    const loggedInUserId = Meteor.userId() && Meteor.user()._id;
    const currentUserId = userId || loggedInUserId;

    // Insert the error log into the collection
    ErrorLogs.insert({
      timestamp,
      severity,
      message,
      stack,
      source,
      userId: currentUserId,
    });
  },
});

// Catch global errors and log them
Meteor.startup(() => {
  process.on('uncaughtException', (error) => {
    console.error("Uncaught Exception:", error);
    logError({
      timestamp: new Date(),
      severity: 'critical',
      message: error.message,
      stack: error.stack,
      source: 'uncaughtException',
    });
  });

  // Add more error handling as needed
});

/**
 * Export the ErrorLogs collection for use in other parts of the application
 */
export { ErrorLogs };
