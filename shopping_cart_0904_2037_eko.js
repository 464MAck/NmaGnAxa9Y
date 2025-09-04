// 代码生成时间: 2025-09-04 20:37:33
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// 创建一个集合用于存储购物车数据
const ShoppingCart = new Mongo.Collection('shoppingCart');

// 定义一个简单的购物车项接口
interface ICartItem {
  _id: string;
  productId: string;
  quantity: number;
}

// 检查购物车项是否有效
const validateCartItem = (cartItem: ICartItem) => {
  check(cartItem, {
    _id: String,
    productId: String,
    quantity: Number,
  });
  if (cartItem.quantity <= 0) {
    throw new Meteor.Error('invalid-cart-item', 'Quantity must be greater than 0');
  }
};

// 添加商品到购物车
Meteor.methods({
  'cart.addItem'(cartItem: ICartItem) {
    validateCartItem(cartItem);
    ShoppingCart.insert(cartItem);
  },
  'cart.removeItem'(cartItemId: string) {
    ShoppingCart.remove(cartItemId);
  },
  'cart.updateQuantity'(cartItemId: string, newQuantity: number) {
    check(cartItemId, String);
    check(newQuantity, Number);
    if (newQuantity <= 0) {
      throw new Meteor.Error('invalid-quantity', 'Quantity must be greater than 0');
    }
    ShoppingCart.update(cartItemId, { $set: { quantity: newQuantity } });
  },
  'cart.clear'() {
    ShoppingCart.remove({});
  },
});

// 订阅购物车集合
Meteor.publish('cart', function () {
  return ShoppingCart.find({});
});

// 前端代码示例（假设使用Blaze模板）
// Template.cart.onCreated(function () {
//   this.subscribe('cart');
// });

// Template.cart.helpers({
//   cartItems() {
//     return ShoppingCart.find({});
//   },
// });

// Template.cart.events({
//   'click .addToCart'(event, instance) {
//     const productId = $(event.currentTarget).data('productId');
//     const quantity = 1; // Default quantity
//     Meteor.call('cart.addItem', { productId, quantity }, (error) => {
//       if (error) {
//         alert('Adding item to cart failed: ' + error.reason);
//       } else {
//         alert('Item added to cart');
//       }
//     });
//   },
//   'click .removeFromCart'(event, instance) {
//     const cartItemId = $(event.currentTarget).data('cartItemId');
//     Meteor.call('cart.removeItem', cartItemId, (error) => {
//       if (error) {
//         alert('Removing item from cart failed: ' + error.reason);
//       } else {
//         alert('Item removed from cart');
//       }
//     });
//   },
//   'click .updateCartQuantity'(event, instance) {
//     const cartItemId = $(event.currentTarget).data('cartItemId');
//     const newQuantity = $(event.currentTarget).val();
//     Meteor.call('cart.updateQuantity', cartItemId, newQuantity, (error) => {
//       if (error) {
//         alert('Updating cart quantity failed: ' + error.reason);
//       } else {
//         alert('Cart quantity updated');
//       }
//     });
//   },
// });
