// 代码生成时间: 2025-10-13 00:00:31
import { Template, ReactiveVar } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

// 虚拟滚动列表组件模板
Template.virtualScrollList.helpers({
  // 获取列表数据
  getListData() {
    return Template.instance().listData.get();
  },
  // 判断是否是最后一个元素
  isLastItem(index, count) {
    return index === count - 1;
  },
});

Template.virtualScrollList.onCreated(function () {
  // 创建响应式变量，用于存储列表数据
  this.listData = new ReactiveVar([]);
  // 模拟从数据库获取数据的过程
  Meteor.call('getLargeListData', (error, result) => {
    if (error) {
      // 错误处理
      console.error('Error fetching list data:', error);
    } else {
      // 将数据赋值给响应式变量
      this.listData.set(result);
    }
  });
});

// 虚拟滚动列表组件
Template.virtualScrollList.rendered = function () {
  // 创建虚拟滚动容器
  const container = this.$('.scroll-container');
  // 设置容器高度
  container.css('height', '400px');
  // 初始化虚拟滚动
  const scroller = new VirtualScroll(container[0], {
    scrollElement: container[0],
    itemHeight: 50, // 假设每个列表项的高度为50px
    items: Template.instance().listData.get()
  });
  // 监听数据变化并重新初始化虚拟滚动
  this.autorun(() => {
    const data = Template.instance().listData.get();
    if (data) {
      scroller.setItems(data);
    }
  });
};

// 虚拟滚动列表项模板
Template.virtualScrollListItem.helpers({
  // 获取列表项数据
  getItemData() {
    return Template.parentData(1);
  },
});

// 虚拟滚动列表项模板
Template.virtualScrollListItem.events({
  'click .item'(event, instance) {
    // 点击事件处理，例如打开详情页
    const itemId = Template.currentData().itemId;
    // 跳转到详情页
    FlowRouter.go('itemDetail', { itemId });
  },
});

// 虚拟滚动组件
class VirtualScroll {
  constructor(container, options) {
    this.container = container;
    this.options = options;
    this.items = [];
    this.visibleItems = [];
    this.container.scrollTop = 0;
    this.init();
  }
  init() {
    // 绑定滚动事件
    this.container.addEventListener('scroll', this.onScroll.bind(this));
  }
  onScroll() {
    // 计算可见项的索引范围
    const start = Math.floor(this.container.scrollTop / this.options.itemHeight);
    const end = start + Math.ceil(this.container.clientHeight / this.options.itemHeight);
    // 更新可见项
    this.updateVisibleItems(start, end);
  }
  updateVisibleItems(start, end) {
    // 清空容器
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    // 创建可见项的DOM
    for (let i = start; i < end; i++) {
      const item = this.items[i];
      if (item) {
        const itemElement = Blaze.render(Template.virtualScrollListItem, this.container, {
          data: item
        });
        this.visibleItems.push(itemElement);
      }
    }
  }
  setItems(items) {
    this.items = items;
    this.updateVisibleItems(0, Math.ceil(this.container.clientHeight / this.options.itemHeight));
  }
}

// 导出虚拟滚动组件
export { VirtualScroll };
