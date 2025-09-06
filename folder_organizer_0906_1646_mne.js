// 代码生成时间: 2025-09-06 16:46:40
 * This program organizes a specified folder by moving files into subfolders
 * based on file type or other criteria.
 *
 * @author Your Name
 * @version 1.0.0
 */

// Import necessary Meteor packages
import fs from 'fs';
import path from 'path';
import { Meteor } from 'meteor/meteor';

// Define a function to organize a folder
function organizeFolder(folderPath) {
  try {
    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      throw new Error(`The folder path ${folderPath} does not exist.`);
    }

    // Read the directory contents
    const files = fs.readdirSync(folderPath);

    // Iterate over each file in the directory
    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      const fileStats = fs.statSync(filePath);
      // Check if it's a file
      if (fileStats.isFile()) {
        // Organize files by file type
        const extension = path.extname(file);
        const destinationFolder = path.join(folderPath, extension.substring(1));
        
        // Create the destination folder if it doesn't exist
        if (!fs.existsSync(destinationFolder)) {
          fs.mkdirSync(destinationFolder);
        }

        // Move the file to the destination folder
        const destinationPath = path.join(destinationFolder, file);
        fs.renameSync(filePath, destinationPath);
        console.log(`Moved: ${file} to ${destinationFolder}`);
      }
    });
  } catch (error) {
    // Handle errors
    console.error('Error organizing folder:', error.message);
    throw error;
  }
}

// Meteor method to organize folder
Meteor.methods({
  organizeFolder: function(folderPath) {
    check(folderPath, String);
    try {
      organizeFolder(folderPath);
      return {
        success: true,
        message: 'Folder organized successfully.'
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to organize folder: ${error.message}`
      };
    }
  }
});