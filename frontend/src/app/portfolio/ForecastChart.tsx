"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

export default function ForecastChart({ currentValue, sentiment }: { currentValue: number, sentiment: string }) {
  
  const dataPoints = [currentValue];
  const upperBound = [currentValue];
  const lowerBound = [currentValue];
  const labels = ['T+0', 'T+1', 'T+2', 'T+3', 'TARGET'];
  
  let multiplier = 1.0;
  let lineColor = '#71717a';

  if (sentiment.includes('BULL')) {
    multiplier = 1.03;
    lineColor = '#00E676';
  } else if (sentiment.includes('BEAR')) {
    multiplier = 0.985;
    lineColor = '#FF3D00';
  }

  let val = currentValue;
  for (let i = 0; i < 4; i++) {
    const randomJitter = (Math.random() * 0.008) - 0.004; 
    val = val * (multiplier + randomJitter);
    dataPoints.push(val);
    const spread = 1 + (0.015 * (i + 1));
    upperBound.push(val * spread);
    lowerBound.push(val * (2 - spread));
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'UPPER_BND',
        data: upperBound,
        borderColor: 'transparent',
        borderWidth: 0,
        tension: 0, // Sharp lines for terminal
        fill: 1,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 140);
          if (sentiment.includes('BEAR')) {
             gradient.addColorStop(0, 'rgba(255, 61, 0, 0.2)');
             gradient.addColorStop(1, 'rgba(255, 61, 0, 0.05)');
          } else if (sentiment.includes('BULL')) {
             gradient.addColorStop(0, 'rgba(0, 230, 118, 0.2)');
             gradient.addColorStop(1, 'rgba(0, 230, 118, 0.05)');
          } else {
             gradient.addColorStop(0, 'rgba(113, 113, 122, 0.15)');
             gradient.addColorStop(1, 'rgba(113, 113, 122, 0.05)');
          }
          return gradient;
        },
        pointRadius: 0,
      },
      {
        label: 'LOWER_BND',
        data: lowerBound,
        borderColor: 'transparent',
        borderWidth: 0,
        tension: 0,
        fill: false,
        backgroundColor: 'transparent',
        pointRadius: 0,
      },
      {
        label: 'EXPECTED',
        data: dataPoints,
        borderColor: lineColor,
        borderWidth: 1.5,
        borderDash: [4, 4],
        tension: 0, 
        fill: false,
        pointRadius: [0, 0, 0, 0, 4],
        pointBackgroundColor: '#09090b',
        pointBorderColor: lineColor,
        pointBorderWidth: 2,
        pointHitRadius: 15,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'linear' as const, // Linear, robotic draw
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#131316',
        borderColor: '#27272a',
        borderWidth: 1,
        titleFont: { size: 10, family: 'monospace' },
        bodyFont: { size: 11, family: 'monospace' },
        padding: 8,
        cornerRadius: 2, // Sharp corners
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#27272a', drawBorder: true, drawTicks: true, tickLength: 5 },
        ticks: { color: '#71717a', font: { size: 9, family: 'monospace' } }
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: { color: '#27272a', drawBorder: false },
        ticks: { 
          color: '#71717a', 
          font: { size: 9, family: 'monospace' },
          callback: function(value: any) {
            if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
            return value;
          }
        },
        min: Math.min(...lowerBound) * 0.95,
        max: Math.max(...upperBound) * 1.05,
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="w-full h-[150px] relative">
      <Line data={data} options={options} />
    </div>
  );
}
