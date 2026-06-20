"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface StockChartProps {
  data: number[];
  labels: string[];
  symbol: string;
}

export default function StockChart({ data, labels, symbol }: StockChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: `${symbol} Price`,
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10,
          },
        },
      },
      y: {
        grid: {
          color: '#1e293b',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line options={options} data={chartData} />
    </div>
  );
}
