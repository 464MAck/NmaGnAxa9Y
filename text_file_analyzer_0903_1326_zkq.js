// 代码生成时间: 2025-09-03 13:26:30
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { check, Match } from 'meteor/check';

// Define the collection for storing files
FS.Collectionfilesystem('texts', {
  stores: [
    {
      name: 'texts',
      storage: FS.Storage.GridFS,
      collections: ['texts']
    }
  ],
  onBeforeUpload: function(file) {
    // Check file type and size
    check(file, Object);
    check(file.type, String);
    check(file.size, Match.Where(function(value) { return value <= 1048576; })); // Limit to 1MB

    // Allow upload if file is a text file and size is within limit
    return file.type.startsWith('text/') && file.size <= 1048576;
  },
  onAfterUpload: function(fileRef) {
    // Analyze file content after upload
    analyzeTextFile(fileRef);
  }
});

// Define the analyzeTextFile function
function analyzeTextFile(fileRef) {
  try {
    // Read the file content
    const fileData = FS.File.findOne(fileRef._id).data.buffer.toString('utf8');

    // Perform analysis on the file content (example: count words)
    const wordCount = (fileData.match(/\b\w+\b/g) || []).length;

    // Log word count
    console.log(`Word count for file ${fileRef.name}: ${wordCount}`);

    // You can add more analysis functions here

  } catch (error) {
    // Handle any errors that occur during file analysis
    console.error(`Error analyzing file ${fileRef.name}: ${error.message}`);
  }
}

// Example Meteor method to upload a text file
Meteor.methods({
  'uploadTextFile': function(file) {
    check(file, Object);
    check(file.file, Object);

    // Insert the file into the 'texts' collection
    FS.File.insert(file.file, file.metadata, function(error, fileRef) {
      if (error) {
        // Handle error on file insertion
        console.error(`Error uploading file: ${error.message}`);
        throw new Meteor.Error('file-upload-error', 'Error uploading file:', error.message);
      } else {
        // Return the file reference
        return fileRef;
      }
    });
  }
});
