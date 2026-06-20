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

export default function AUMChart({ currentAUM }: { currentAUM: number }) {
  // Simulate historical data leading up to current AUM
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Create a mock curve that ends at currentAUM
  const base = currentAUM * 0.7; // Start at 70% of current AUM
  const data = [
    base,
    base * 1.05,
    base * 1.12,
    base * 1.08,
    base * 1.25,
    currentAUM
  ];

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Total AUM (₹)',
        data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4, // Smooth curve
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
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '₹' + (context.parsed.y / 10000000).toFixed(2) + ' Cr';
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          display: true,
          color: 'rgba(200, 200, 200, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return '₹' + (value / 10000000).toFixed(1) + 'Cr';
          }
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <h2 className="text-lg font-bold mb-6">AUM Growth (Simulated YTD)</h2>
      <div className="h-72">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}
