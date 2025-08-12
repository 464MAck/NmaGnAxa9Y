// 代码生成时间: 2025-08-12 13:10:06
// 导入Meteor核心包
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// 定义订单集合
const Orders = new Mongo.Collection('orders');

// 定义订单状态枚举
const OrderStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// 定义一个简单的订单文档验证器
const orderValidator = new SimpleSchema({
  orderId: {
    type: String,
    label: '订单ID'
  },
  orderDetails: {
    type: Object,
    label: '订单详情'
  },
  'orderDetails.items': {
    type: [String],
    label: '订单项目'
  },
  status: {
    type: String,
    allowedValues: [OrderStatus.PENDING, OrderStatus.COMPLETED, OrderStatus.CANCELLED],
    label: '订单状态'
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset();
      }
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function () {
      return new Date();
    }
  }
});

// 将验证器应用到集合上
Orders.attachSchema(orderValidator);

// 订单处理方法
Meteor.methods({
  /*
  创建订单
  * @param {Object} orderData - 订单数据
  */
  'order.create': function (orderData) {
    check(orderData, {
      orderId: String,
      orderDetails: {
        items: [String]
      },
      status: OrderStatus
    });
    
    // 检查订单数据是否有效
    if (!orderValidator.validate(orderData).isValid()) {
      throw new Meteor.Error('invalid-input', '无效的订单数据');
    }
    
    // 插入订单到数据库
    return Orders.insert(orderData);
  },
  /*
  更新订单状态
  * @param {String} orderId - 订单ID
  * @param {String} status - 新的订单状态
  */
  'order.updateStatus': function (orderId, status) {
    check(orderId, String);
    check(status, OrderStatus);
    
    // 校验订单ID和状态是否有效
    const order = Orders.findOne(orderId);
    if (!order) {
      throw new Meteor.Error('not-found', '订单不存在');
    }
    
    // 更新订单状态
    return Orders.update(orderId, {
      $set: {
        status: status,
        updatedAt: new Date()
      }
    });
  },
  /*
  取消订单
  * @param {String} orderId - 订单ID
  */
  'order.cancel': function (orderId) {
    check(orderId, String);
    
    // 校验订单是否存在
    const order = Orders.findOne(orderId);
    if (!order) {
      throw new Meteor.Error('not-found', '订单不存在');
    }
    
    // 设置订单状态为取消
    return Orders.update(orderId, {
      $set: {
        status: OrderStatus.CANCELLED,
        updatedAt: new Date()
      }
    });
  }
});

// 导出OrderStatus枚举
export { OrderStatus };