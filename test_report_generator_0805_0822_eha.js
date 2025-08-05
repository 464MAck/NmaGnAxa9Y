// 代码生成时间: 2025-08-05 08:22:32
 * Usage:
 *   meteor run
 *
 * It handles errors gracefully and provides clear documentation.
 *
 * @author Your Name
 * @version 1.0.0
 * @since 2023-04-01
 */

// Import required Meteor packages and modules
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Define a TestReportCollection collection to store test reports
const TestReportCollection = new Mongo.Collection('testReports');

// Define schema for test reports using SimpleSchema
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/underscore';

const TestReportSchema = new SimpleSchema({
  testName: {
    type: String,
    label: 'Test Name',
  }),
  description: {
    type: String,
    label: 'Test Description',
  }),
  result: {
    type: String,
    label: 'Test Result',
    allowedValues: ['pass', 'fail'],
  }),
  timestamp: {
    type: Date,
    label: 'Timestamp',
    autoValue: function () {
      return new Date();
    },
  },
});

const addTestReport = new ValidatedMethod({
  name: 'testReports.add',
  check: {
    testName: String,
    description: String,
    result: Match.OneOf(String, undefined),
  },
  validate: function (testName, description, result) {
    CleanCheck.testName = testReportSchema.newContext().validateOne(testName);
    CleanCheck.description = testReportSchema.newContext().validateOne(description);
    if (result) {
      CleanCheck.result = testReportSchema.newContext().validateOne(result);
    }
  },
  run({ testName, description, result }) {
    TestReportCollection.insert({
      testName,
      description,
      result,
    });
  },
});

// Define a helper function to format test results
const formatTestResult = (result) => {
  switch (result) {
    case 'pass':
      return '<span style="color: green">Pass</span>';
    case 'fail':
      return '<span style="color: red">Fail</span>';
    default:
      return '<span style="color: blue">Unknown</span>';
  }
};

// Define a template for rendering test reports
Template.testReports.helpers({
  testReports() {
    return TestReportCollection.find();
  },
  testResult(result) {
    return formatTestResult(result);
  },
});

// Define an event handler to handle form submissions
Template.testReports.events({
  'submit form': function (event) {
    event.preventDefault();
    const {
      testName,
      description,
      result,
    } = event.target;
    addTestReport(testName.value, description.value, result.value);
    testName.value = '';
    description.value = '';
    result.value = '';
  },
});

// Define a route for the test reports page
Router.route('/test-reports', {
  name: 'testReports',
  template: 'testReports',
});

// Define a publish function to publish test reports to the client
Meteor.publish('testReports', function () {
  return TestReportCollection.find();
});

// Define a startup function to render the test reports page
Meteor.startup(() => {
  BlazeLayout.render('main', {
    content: 'testReports',
  });
});
