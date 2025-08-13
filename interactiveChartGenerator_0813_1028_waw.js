// 代码生成时间: 2025-08-13 10:28:23
import React, { useState, useEffect } from 'react';
import { createChart } from 'meteor/nova:core';
import { Chart } from 'react-chartjs-2';
import { useTracker } from 'meteor/react-meteor-data';

// 交互式图表组件
const InteractiveChart = () => {
  // 使用useState来存储图表数据和错误信息
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  // 使用useTracker来追踪图表数据
  useTracker(() => {
    Meteor.subscribe('chartData');
  }, []);

  // 获取图表数据
  const handleChartData = () => {
    try {
      // 假设meteor collection名为'ChartData'
      const data = Charts.find({}).fetch();
      setChartData(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    handleChartData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Chart
        type="bar"
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        }}
      />
    </div>
  );
};

// 导出组件
export default InteractiveChart;