// 代码生成时间: 2025-09-09 09:35:56
// Import necessary Meteor packages and modules.
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';

// Define a collection for storing backup data.
const Backups = new FS.Collection('backups', {
  stores: [
    // Use the GridFS store for storing file data.
    new FS.Store.GridFS('backups', {
      collectionName: 'backupFiles',
      chunkSize: 1024 * 1024, // 1MB chunks
      recordAccessControl: true,
    })
  ]
});

// Define a method to backup data.
Meteor.methods({
  'backup.data': function () {
    check(this.userId, String);

    // Only allow logged-in users to perform backup.
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Backup data from a collection, for example, 'Items'.
    const backupData = [];
    const items = Items.find().fetch();
    items.forEach((item) => {
      backupData.push({
        ...item,
        _id: EJSON.stringify(item._id) // Convert _id to string for storage.
      });
    });

    // Create a backup file with the backup data.
    const backupFile = Backups.insert({
      backupData,
      date: new Date(),
    }, {
      meta: {
        userId: this.userId,
      },
    });

    // Return the backup file ID for reference.
    return backupFile._id;
  }
});

// Define a method to restore data.
Meteor.methods({
  'restore.data': function (backupId) {
    check(backupId, String);
    check(this.userId, String);

    // Only allow logged-in users to perform restore.
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Retrieve the backup data by ID.
    const backupFile = Backups.findOne({ _id: backupId });
    if (!backupFile) {
      throw new Meteor.Error('backup-not-found', 'The backup file was not found.');
    }

    // Restore data to the 'Items' collection.
    const backupData = EJSON.parse(backupFile.backupData);
    backupData.forEach((item) => {
      // Skip if item already exists.
      if (Items.findOne({ _id: EJSON.parse(item._id) })) {
        return;
      }
      // Insert item into the collection.
      Items.insert({
        ...item,
        _id: EJSON.parse(item._id) // Convert back to ObjectId.
      });
    });
  }
});

// Define publication for the backup files.
// Only logged-in users can subscribe to this publication.
Meteor.publish('backup.files', function () {
  check(this.userId, String);

  if (!this.userId) {
    return this.ready();
  }

  return Backups.find({
    meta: {
      userId: this.userId
    }
  });
});

// Define publication for the backup file data.
// Only logged-in users can subscribe to this publication.
Meteor.publish('backup.data', function (backupId) {
  check(backupId, String);
  check(this.userId, String);

  if (!this.userId) {
    return this.ready();
  }

  const backupFile = Backups.findOne({ _id: backupId, meta: { userId: this.userId } });
  if (!backupFile) {
    return this.ready();
  }

  return {
    // Return the backup data as a string.
    backupData: function () {
      return backupFile.backupData;
    }
  };
});
