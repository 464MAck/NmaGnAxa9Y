// 代码生成时间: 2025-09-11 19:36:54
// Imports
import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import { Fiber } from 'fibers';
import { Future } from 'fibers/future';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import rimraf from 'rimraf';

// Define the collection for storing file metadata
const Files = new FilesCollection({
  debug: true,
  collectionName: 'filesMetadata',
  allowClientCode: false, // Security measure to disable client-side code
  filter: {
    onBeforeUpload(file) {
      // Basic file size restriction
      if (file.size > 10485760) {
        return 'File size exceeds limit of 10MB';
      }
      return true;
    }
  },
  onAfterUpload(fileRef) {
    console.log(chalk.green(`Uploaded: ${fileRef._id}`));
    // Call sync function after file upload
    syncFiles();
  },
  onBeforeRemove(fileRef) {
    // Remove file from backup folder before deleting from server
    const backupPath = getBackupPath(fileRef._id);
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
  }
});

// Configuration
const backupDir = './backup'; // Backup directory path
const sourceDir = './source'; // Source directory path

/**
 * Get backup path for a given file ID
 * @param {string} fileId
 * @returns {string} Backup path
 */
function getBackupPath(fileId) {
  return path.join(backupDir, `${fileId}.bak`);
}

/**
 * Sync files between source and backup directories
 */
function syncFiles() {
  Fiber(function () {
    try {
      const files = Files.find().fetch();
      const future = new Future();
      const errors = [];

      // Copy files from source to backup directory
      files.forEach((file) => {
        const sourcePath = path.join(sourceDir, file._id);
        const backupPath = getBackupPath(file._id);

        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, backupPath);
          console.log(chalk.blue(`Synced: ${file._id}`));
        } else {
          errors.push(`File not found: ${file._id}`);
        }
      });

      // Handle errors
      if (errors.length) {
        console.error(chalk.red(errors.join(', ')));
      }
    } catch (error) {
      console.error(chalk.red(`Sync error: ${error.message}`));
    }
  }).run();
}

/**
 * Initialize Meteor application
 */
Meteor.startup(() => {
  // Create backup directory if not exists
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(chalk.blue('Backup directory created or exists'));

  // Sync files on startup
  syncFiles();
});

// Add error handling for removing files
Meteor.methods({
  'removeFile'(fileId) {
    if (Meteor.isServer) {
      try {
        const fileRef = Files.findOne({ _id: fileId });
        Files.remove({ _id: fileId });
        console.log(chalk.green(`File removed: ${fileId}`));
        return true;
      } catch (error) {
        console.error(chalk.red(`Error removing file: ${error.message}`));
        return false;
      }
    }
  }
});
