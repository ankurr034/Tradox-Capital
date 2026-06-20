"use client";

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AllocationChart({ holdings, availableFunds }: { holdings: any[], availableFunds: number }) {
  
  const labels = ['CASH'];
  const dataValues = [availableFunds];
  const bgColors = ['#00E676']; // Terminal green for cash

  const palette = [
    '#3b82f6', // blue
    '#eab308', // yellow
    '#ec4899', // pink
    '#8b5cf6', // purple
    '#14b8a6', // teal
    '#f97316', // orange
  ];

  holdings.forEach((h, idx) => {
    labels.push(h.symbol);
    dataValues.push(h.currentValue);
    bgColors.push(palette[idx % palette.length]);
  });

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: bgColors,
        borderColor: '#09090b', // Match terminal background to create gaps
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#a1a1aa',
          font: { size: 10, family: 'monospace' },
          usePointStyle: true,
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: '#131316',
        borderColor: '#27272a',
        borderWidth: 1,
        titleFont: { size: 10, family: 'monospace' },
        bodyFont: { size: 11, family: 'monospace' },
        padding: 8,
        cornerRadius: 2,
        callbacks: {
          label: function(context: any) {
            let label = context.label || '';
            if (label) label += ': ';
            if (context.parsed !== null) {
              label += '₹' + context.parsed.toLocaleString('en-IN', { maximumFractionDigits: 0 });
            }
            return label;
          }
        }
      }
    },
    cutout: '80%', // Very thin futuristic ring
  };

  return (
    <div className="w-full h-[220px] relative">
      <Doughnut data={data} options={options} />
    </div>
  );
}
