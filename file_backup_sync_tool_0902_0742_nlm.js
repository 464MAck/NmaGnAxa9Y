// 代码生成时间: 2025-09-02 07:42:01
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { Future } from 'meteor/percolate:synced-cron';
import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// 定义备份和同步工具类
class FileBackupSyncTool {
  constructor(options) {
    this.sourcePath = options.sourcePath;
    this.backupPath = options.backupPath;
    this.syncInterval = options.syncInterval || '*/10 * * * *';
    this.logger = options.logger || console;
  }

  // 初始化备份和同步工具
  init() {
    // 设置定时任务
    SyncedCron.add({
      name: 'backup_and_sync_files',
      schedule: this.syncInterval,
      job: () => this.backupAndSyncFiles()
    });
  }

  // 备份文件
  backupFiles() {
    try {
      const files = fs.readdirSync(this.sourcePath);
      for (const file of files) {
        const sourceFilePath = path.join(this.sourcePath, file);
        const backupFilePath = path.join(this.backupPath, file);
        if (fs.lstatSync(sourceFilePath).isDirectory()) {
          // 如果是目录，则递归备份
          this.backupFiles(sourceFilePath, backupFilePath);
        } else {
          // 如果是文件，则复制文件
          fs.copyFileSync(sourceFilePath, backupFilePath);
        }
      }
      this.logger.log('Backup completed successfully.');
    } catch (error) {
      this.logger.error('Backup failed:', error);
    }
  }

  // 同步文件
  syncFiles() {
    try {
      const sourceFiles = fs.readdirSync(this.sourcePath);
      const backupFiles = fs.readdirSync(this.backupPath);
      for (const file of backupFiles) {
        if (!sourceFiles.includes(file)) {
          // 如果备份目录中有文件在源目录中不存在，则删除备份文件
          fs.unlinkSync(path.join(this.backupPath, file));
        }
      }
      this.logger.log('Sync completed successfully.');
    } catch (error) {
      this.logger.error('Sync failed:', error);
    }
  }

  // 备份和同步文件
  backupAndSyncFiles() {
    this.backupFiles();
    this.syncFiles();
  }
}

// 示例用法
const backupTool = new FileBackupSyncTool({
  sourcePath: '/path/to/source',
  backupPath: '/path/to/backup',
  logger: console
});
backupTool.init();