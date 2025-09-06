// 代码生成时间: 2025-09-06 11:56:14
// Import Meteor's built-in packages and other necessary modules.
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs'; // CollectionFS
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { NpmModules } from 'meteor/meteorhacks:npm';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// Ensure required npm modules are installed.
NpmModules.append({
  modules: {
    'node-schedule': 'latest',
    'archiver': 'latest'
  }
});

// Define constants for file paths and other configurations.
const backupDir = 'backups'; // Directory to store backup files.
const sourceDir = 'source'; // Directory containing files to backup.

// Initialize the CollectionFS store for file uploads.
FS.Store = FS.FileSystemStore;
FS.FileCollection = new FS.Collection('files');

// Define a function to backup files.
function backupFiles() {
  // Create a backup directory if it does not exist.
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  try {
    // Use the archiver module to create a zip file of the source directory.
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(path.join(backupDir, `backup_${new Date().toISOString()}.zip`));

    // Pipe archive data to the file.
    archive.pipe(stream);
    archive.directory(sourceDir, false);
    archive.finalize();

    // Handle errors.
    stream.on('close', () => {
      console.log('Backup completed successfully.');
    });
    archive.on('error', (err) => {
      console.error('Error during backup:', err);
    });
  } catch (err) {
    console.error('Backup failed:', err);
  }
}

// Define a function to sync files.
function syncFiles() {
  // Implement file synchronization logic here.
  // This could involve comparing file hashes or timestamps and copying files as needed.
  // For simplicity, this function is left as a placeholder.
  console.log('File synchronization logic needs to be implemented.');
}

// Schedule regular backups using SyncedCron.
SyncedCron.add({
  name: 'backup',
  schedule: (parser) => parser.text('every 24 hours'),
  job: () => {
    console.log('Starting backup...');
    backupFiles();
  }
});

// Start the backup job on server startup.
Meteor.startup(() => {
  SyncedCron.start();
  console.log('SyncedCron has started.');
});

// Expose backup and sync functions for server-side API calls if needed.
Meteor.methods({
  backupNow() {
    backupFiles();
  },
  syncFilesNow() {
    syncFiles();
  }
});
