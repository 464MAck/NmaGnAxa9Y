// 代码生成时间: 2025-09-24 05:45:09
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Chart from 'chart.js';

// 创建一个交互式图表组件
Template.InteractiveChart.onCreated(function() {
  const instance = this;
  // 定义图表数据和选项的响应式变量
  instance.chartData = new ReactiveVar({
    labels: ['January', 'February', 'March'],
    datasets: [{
      label: 'Demo Data',
      data: [10, 20, 30],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(75, 192, 192, 0.2)',
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
      ],
    }],
  });

  // 定义图表选项的响应式变量
  instance.chartOptions = new ReactiveVar({
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
    },
  });

  // 定义图表对象的变量
  instance.chart = null;

  // 创建图表的函数
  instance.createChart = () => {
    if (instance.chart) {
      instance.chart.destroy();
    }
    const ctx = instance.$('canvas').get(0).getContext('2d');
    instance.chart = new Chart(ctx, {
      type: 'bar',
      data: instance.chartData.get(),
      options: instance.chartOptions.get(),
    });
  };

  // 初始创建图表
  instance.createChart();
});

// 更新图表数据
Template.InteractiveChart.helpers({
  chartData: function() {
    return Template.instance().chartData.get();
  },
  chartOptions: function() {
    return Template.instance().chartOptions.get();
  },
});

// 更新图表数据的方法
Template.InteractiveChart.events({
  // 更新数据标签
  'change .js-update-labels': function(event, instance) {
    const newLabels = event.target.value.split(',');
    instance.chartData.set({
      labels: newLabels,
      datasets: instance.chartData.get().datasets,
    });
    instance.createChart();
  },
  // 更新数据集
  'change .js-update-data': function(event, instance) {
    const newData = event.target.value.split(',').map(Number);
    instance.chartData.set({
      labels: instance.chartData.get().labels,
      datasets: [{
        label: instance.chartData.get().datasets[0].label,
        data: newData,
        backgroundColor: instance.chartData.get().datasets[0].backgroundColor,
        borderColor: instance.chartData.get().datasets[0].borderColor,
      }],
    });
    instance.createChart();
  },
  // 更新图表选项
  'change .js-update-options': function(event, instance) {
    const scaleOption = event.target.value;
    instance.chartOptions.set({
      ...instance.chartOptions.get(),
      scales: {
        ...instance.chartOptions.get().scales,
        yAxes: [{
          ticks: {
            beginAtZero: scaleOption === 'zeroBased',
          },
        }],
      },
    });
    instance.chart.update();
  },
});

// 确保图表组件在渲染完成后更新图表
Template.InteractiveChart.onRendered(function() {
  this.$('canvas').parent().addClass('chart-container');
  this.$('canvas').addClass('chart');
  this.createChart();
});