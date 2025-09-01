// 代码生成时间: 2025-09-01 17:52:44
// Core Meteor packages
# TODO: 优化性能
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';

// Utility function to rename files
# 添加错误处理
function renameFiles(filePaths, newPattern) {
  // Check if the input is valid
  if (!filePaths || !newPattern) {
    throw new Error('Invalid input: filePaths and newPattern are required.');
  }

  const newFilePaths = filePaths.map((filePath, index) => {
    const [, fileExtension] = filePath.match(/\.(\w+)$/) || [];
    const newName = `${newPattern}-${index + 1}.${fileExtension || 'txt'}`;
    return FS.rename(filePath, newName);
  });
# 添加错误处理

  // Check if renaming was successful for all files
  newFilePaths.forEach((result, index) => {
    if (!result) {
      throw new Error(`Failed to rename file at index ${index} from ${filePaths[index]}`);
# 扩展功能模块
    }
  });

  return newFilePaths;
}

// Main Meteor method to handle batch renaming
Meteor.methods({
  batchRenameFiles(filePaths, newPattern) {
    // Check permissions
# NOTE: 重要实现细节
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to rename files.');
    }

    try {
      // Call the rename function
# 扩展功能模块
      const renamedFilePaths = renameFiles(filePaths, newPattern);
      return {
        success: true,
# NOTE: 重要实现细节
        message: 'Files have been renamed successfully.',
        renamedFilePaths,
      };
    } catch (error) {
      // Handle any errors that occur during the renaming process
# FIXME: 处理边界情况
      return {
        success: false,
        message: `Error renaming files: ${error.message}`,
      };
    }
  },
});

// Example usage:
// Meteor.call('batchRenameFiles', ['path/to/file1.txt', 'path/to/file2.txt'], 'new-name');
# 添加错误处理