// 代码生成时间: 2025-08-01 08:33:18
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// 用户权限管理服务
class UserPermissionService {
  // 构造函数
  constructor() {
    // 初始化角色集合
    this.rolesCollection = new Mongo.Collection('roles');
  }

  // 创建新角色
  createRole(roleId, roleName) {
    try {
      // 检查角色是否已存在
      if (this.rolesCollection.findOne({ roleId })) {
        throw new Meteor.Error('role-exists', 'Role already exists');
      }
      // 插入新角色
      this.rolesCollection.insert({ roleId, roleName });
    } catch (error) {
      // 处理错误
      console.error('Error creating role:', error);
      throw error;
    }
  }

  // 删除角色
  deleteRole(roleId) {
    try {
      // 检查角色是否存在
      if (!this.rolesCollection.findOne({ roleId })) {
        throw new Meteor.Error('role-not-found', 'Role not found');
      }
      // 删除角色
      this.rolesCollection.remove({ roleId });
    } catch (error) {
      // 处理错误
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  // 分配角色给用户
  assignRoleToUser(userId, roleId) {
    try {
      // 检查角色是否存在
      if (!this.rolesCollection.findOne({ roleId })) {
        throw new Meteor.Error('role-not-found', 'Role not found');
      }
      // 检查用户是否存在
      if (!Meteor.users.findOne({ _id: userId })) {
        throw new Meteor.Error('user-not-found', 'User not found');
      }
      // 分配角色
      Meteor.users.update({ _id: userId }, { $addToSet: { roles: roleId } });
    } catch (error) {
      // 处理错误
      console.error('Error assigning role to user:', error);
      throw error;
    }
  }

  // 移除用户的角色
  removeRoleFromUser(userId, roleId) {
    try {
      // 检查用户是否存在
      if (!Meteor.users.findOne({ _id: userId })) {
        throw new Meteor.Error('user-not-found', 'User not found');
      }
      // 移除角色
      Meteor.users.update({ _id: userId }, { $pull: { roles: roleId } });
    } catch (error) {
      // 处理错误
      console.error('Error removing role from user:', error);
      throw error;
    }
  }
}

// 实例化用户权限管理服务
const userPermissionService = new UserPermissionService();

// 导出服务
export { userPermissionService };
