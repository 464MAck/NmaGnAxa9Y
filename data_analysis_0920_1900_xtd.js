// 代码生成时间: 2025-09-20 19:00:50
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// 定义数据集合
const DataPoints = new Mongo.Collection('dataPoints');

// 数据验证函数
function validateData(data) {
    check(data, {
        type: String,
        value: Number,
        date: Date
    });
}

// 数据插入方法，包含验证
export const insertData = function (data) {
    validateData(data);
    return DataPoints.insert(data);
}

// 数据查询方法
export const fetchData = function () {
    return DataPoints.find({}).fetch();
}

// 数据分析方法
export const analyzeData = function () {
    try {
        // 获取所有数据
        const allData = fetchData();
        // 计算平均值
        const average = allData.reduce((acc, curr) => acc + curr.value, 0) / allData.length;
        // 计算最大值和最小值
        const max = Math.max(...allData.map(item => item.value));
        const min = Math.min(...allData.map(item => item.value));
        // 返回分析结果
        return {
            average,
            max,
            min,
            count: allData.length
        };
    } catch (error) {
        console.error('Error analyzing data:', error);
        throw error;
    }
}

// Meteor method for data insertion
Meteor.methods({
    'data.insert': function (data) {
        // 必须登录才能插入数据
        if (!this.userId)
            throw new Meteor.Error('not-authorized', 'User must be logged in to insert data.');
        insertData(data);
    },
    'data.analyze': function () {
        // 必须登录才能分析数据
        if (!this.userId)
            throw new Meteor.Error('not-authorized', 'User must be logged in to analyze data.');
        return analyzeData();
    }
});

// 错误处理
DataPoints.allow({
    insert: function(userId, doc) {
        return true;
    },
    update: function(userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function(userId, doc) {
        return true;
    },
    fetch: ['type', 'value', 'date']
});