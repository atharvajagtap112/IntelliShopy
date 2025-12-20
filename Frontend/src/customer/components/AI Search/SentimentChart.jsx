// SentimentChart.jsx
import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentChart = ({ chartData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart if exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new ChartJS(ctx, {
      type: "pie",
      data: {
        labels: ["Positive", "Negative", "Neutral"],
        datasets: [
          {
            data: [
              chartData.Positive || 0,
              chartData.Negative || 0,
              chartData.Neutral || 0,
            ],
            backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="chart-container">
      <div style={{ textAlign: "center", fontSize: "16px", marginBottom: "10px" }}>
        <b>\ud83d\udcca Sentiment Analysis Report</b>
      </div>
      <canvas ref={chartRef} width="300" height="300" />
    </div>
  );
};

export default SentimentChart;
