// 代码生成时间: 2025-08-28 16:45:00
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { check, Match } from 'meteor/check';

// 测试数据生成器
class TestDataGenerator {
    // 构造函数
    constructor() {
        // 初始化数据集合
        this.dataCollection = new Mongo.Collection('testData');
    }

    // 生成测试数据
    generateData(count) {
        check(count, Match.Integer);

        // 确保传入的count是一个整数
        if (count < 0) {
            throw new Error('Count must be a positive integer');
        }

        // 生成测试数据
        const testData = [];
        for (let i = 0; i < count; i++) {
            testData.push({
                id: Random.id(),
                name: `TestName${i}`,
                email: `test${i}@example.com`,
                createdAt: new Date()
            });
        }

        // 将测试数据插入到集合中
        testData.forEach((data) => {
            this.dataCollection.insert(data);
        });
    }
}

// 使用示例
try {
    const testDataGenerator = new TestDataGenerator();
    testDataGenerator.generateData(10);
} catch (error) {
    console.error('Error generating test data:', error);
}
