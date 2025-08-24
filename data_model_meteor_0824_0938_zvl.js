// 代码生成时间: 2025-08-24 09:38:21
// Import Meteor from the meteor package
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Define the collection for storing data
const MyCollection = new Mongo.Collection('myCollection');

// Deny all client-side updates for security reasons
MyCollection.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

// Deny all client-side insertions, updates, and deletions for unauthenticated users
MyCollection.deny({
  insert() { return !this.userId; },
  update() { return !this.userId; },
  remove() { return !this.userId; }
});

// Allow all client-side updates if the user is logged in and the document belongs to them
MyCollection.allow({
  insert(userId) {
    return !!userId;
  },
  update(userId, doc) {
    return doc.owner === userId;
  },
  remove(userId, doc) {
    return doc.owner === userId;
  }
});

// Simple schema for MyCollection to enforce data validation
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const mySchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
    max: 50
  },
  age: {
    type: Number,
    label: 'Age',
    min: 0
  },
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Owner',
    optional: true
  }
});

// Attach the schema to the collection
MyCollection.attachSchema(mySchema);

// Optional: Define methods for manipulating documents in MyCollection
Meteor.methods({
  'addMyItem'(name, age) {
    check(name, String);
    check(age, Number);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to add an item.');
    }
    return MyCollection.insert({
      name: name,
      age: age,
      owner: this.userId,
      createdAt: new Date()
    });
  },
  'updateMyItem'(itemId, name, age) {
    check(itemId, String);
    check(name, String);
    check(age, Number);
    const doc = MyCollection.findOne(itemId);
    if (doc.owner !== this.userId) {
      throw new Meteor.Error('not-authorized', 'User is not authorized to update this item.');
    }
    return MyCollection.update(itemId, {
      $set: {
        name: name,
        age: age
      }
    });
  }
});
