// 代码生成时间: 2025-10-03 01:39:33
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Tracker } from 'meteor/tracker';

// Define the Issues collection
const Issues = new Mongo.Collection('issues');

// Define the schema for issues
const issueSchema = new SimpleSchema({
  issueId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  title: {
    type: String,
    label: 'Title'
  },
  description: {
    type: String,
    label: 'Description',
    optional: true
  },
  status: {
    type: String,
    label: 'Status',
    allowedValues: ['open', 'in progress', 'closed']
  },
  createdAt: {
    type: Date,
    defaultValue: () => new Date()
  },
  updatedAt: {
    type: Date,
    autoValue: () => {
      if (this.isUpdate) {
        return new Date();
      } else {
        this.unset();
      }
    }
  },
  assignedTo: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
});

// Attach the schema to the Issues collection
Issues.attachSchema(issueSchema);

// Method to add a new issue
Meteor.methods({
  'issues.add'(issue) {
    // Check for proper data structure
    check(issue, {
      title: String,
      description: Match.Optional(String),
      status: String
    });
    
    // Simple user authentication check (replace with actual authentication)
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to add issues.');
    }

    // Insert the new issue into the database
    return Issues.insert({
      ...issue,
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedTo: Meteor.userId()
    });
  }
});

// Method to update an existing issue
Meteor.methods({
  'issues.update'(issueId, update) {
    // Check for proper data structure
    check(issueId, String);
    check(update, {
      title: Match.Optional(String),
      description: Match.Optional(String),
      status: Match.Optional(String)
    });
    
    // Find the issue to update
    const issue = Issues.findOne(issueId);
    if (!issue) {
      throw new Meteor.Error('not-found', 'Issue not found.');
    }
    
    // Simple user authentication check (replace with actual authentication)
    if (issue.assignedTo !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'User must be assigned to the issue to update it.');    }
    
    // Update the issue in the database
    return Issues.update(issueId, { $set: update });
  }
});

// Publish all issues to the client
Meteor.publish('issues.list', function () {
  return Issues.find();
});

// Publish a single issue to the client
Meteor.publish('issues.single', function (issueId) {
  check(issueId, String);
  return Issues.find(issueId);
});


// Client-side code for handling the UI
Template.issueList.helpers({
  issues() {
    return Issues.find({}, {sort: {createdAt: -1}});
  }
});

Template.issueList.events({
  // Event to add a new issue
  'submit form'(event, instance) {
    event.preventDefault();
    const issue = {
      title: event.target.title.value,
      description: event.target.description.value,
      status: 'open'
    };
    Meteor.call('issues.add', issue, (error, result) => {
      if (error) {
        // Handle error
        console.log(error.message);
      } else {
        // Clear form and display a success message
        event.target.reset();
        alert('Issue added successfully!');
      }
    });
  },
  
  // Event to delete an issue
  'click .delete-issue'(event, instance) {
    const issueId = event.currentTarget.getAttribute('data-id');
    const confirm = window.confirm('Are you sure you want to delete this issue?');
    if (confirm) {
      Meteor.call('issues.remove', issueId, (error, result) => {
        if (error) {
          // Handle error
          console.log(error.message);
        }
        if (result) {
          // Display a success message
          alert('Issue deleted successfully!');
        }
      });
    }
  }
});

Template.issueDetail.helpers({
  issue() {
    return Issues.findOne(Template.instance().data.issueId);
  }
});

Template.issueDetail.events({
  // Event to update an issue
  'submit form'(event, instance) {
    event.preventDefault();
    const issueId = instance.data.issue._id;
    const update = {
      title: event.target.title.value,
      description: event.target.description.value,
      status: event.target.status.value
    };
    Meteor.call('issues.update', issueId, update, (error, result) => {
      if (error) {
        // Handle error
        console.log(error.message);
      } else {
        // Display a success message
        alert('Issue updated successfully!');
      }
    });
  }
});