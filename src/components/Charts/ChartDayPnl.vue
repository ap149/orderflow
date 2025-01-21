<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted, watch } from "vue";
  import { Chart, registerables } from "chart.js";
  import { trades } from "../../stateJournal";
  
  Chart.register(...registerables);
  
  export default defineComponent({
    name: "ChartComponent",
    setup() {
      const chartCanvas = ref(null);
      let chartInstance = null;
      Chart.defaults.font = {
        family: "Nunito", // Global font family for all text in the chart
        size: 10,
        weight: "bold",
        style: "",
      };
      const prepareChartData = () => {
        const labels = trades.data.map((trade, index) => {
          if (trade.EntryTime) {
            const date = new Date(trade.EntryTime); // Parse the timestamp
            const hours = date.getHours().toString().padStart(2, "0"); // Ensure 2 digits for hours
            const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure 2 digits for minutes
            return `${hours}:${minutes}  [${index+1}]`; // Format to HH:mm
          }
          return "N/A"; // Fallback if EntryTime is missing
        });
        const tradeCounts = trades.data.map((_, index) => index + 1);
        const cumulativePnl = trades.data.reduce((acc, trade, index) => {
          const previous = acc[index - 1] || 0;
          acc.push(previous + trade.Pnl);
          return acc;
        }, []);
        const tradePoints = trades.data.map((trade) => trade.Pnl || 0);
        return { labels, tradeCounts, cumulativePnl, tradePoints };
      };
      
      const updateChart = () => {
        const { labels, tradeCounts, cumulativePnl, tradePoints } = prepareChartData();
  
        if (chartInstance) {
          chartInstance.data.labels = labels;
          chartInstance.data.datasets[0].data = cumulativePnl;
          chartInstance.data.datasets[1].data = tradePoints;
          chartInstance.update();
        } else if (chartCanvas.value) {
          const ctx = chartCanvas.value.getContext("2d");
          
          const gradient = ctx.createLinearGradient(0, 0, 0, chartCanvas.value.height);
          gradient.addColorStop(0, "rgba(20, 184, 166, 0.3)"); // Green for positivergb(20, 184, 166)
            gradient.addColorStop(0.5, "rgba(0, 255, 0, 0.0)"); // Transparent
            gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.0)"); // Transparent
            gradient.addColorStop(1, "rgba(255, 0, 0, 0.3)"); // Red for negative          rgb(244, 63, 94)

          chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [
                {
                    type: "line",
                    label: "Cumulative PnL",
                    data: cumulativePnl,
                    borderColor: "rgb(20, 184, 166)", // Default green
                    segment: {
                        borderColor: (ctx) => {
                        const { p1, p0 } = ctx; // Points defining the segment
                        // console.log(p1)
                        return p1.parsed.y >= 0 ? "rgb(20, 184, 166)" : "rgb(244, 63, 94)"; // Green for positive, Red for negative
                        },
                        backgroundColor: (ctx) => {
                        const { p1 } = ctx; // Check the ending point of the segment
                        return p1.parsed.y >= 0
                            ? "rgba(20, 184, 166, 0.3)" // Light green for positive area
                            : "rgba(244, 63, 94, 0.3)"; // Light red for negative area
                        },
                    },
                    backgroundColor: "rgba(244, 63, 94, 0.3)", // Default fill color
                    fill: true, // Fill the area
                    tension: 0.4,
                    pointBackgroundColor: (ctx) =>
                    ctx.raw >= 0 ? "rgba(0, 128, 0, 1)" : "rgba(255, 0, 0, 1)", // Green/red dots
                    pointBorderColor: "rgba(0,0,0,0)", // Black border around dots
                    pointRadius: 3, // Size of the dots
                    // pointHoverRadius: 6, // Slightly larger on hover            
                    yAxisID: "yL",
                },
                {
                    type: "bar",
                    label: "Trade PnL",
                    data: tradePoints,
                    backgroundColor: "rgba(148, 163, 184, 0.5)", // Blue for barsrgb(148, 163, 184)rgb(148, 163, 184)
                    borderColor: "rgba(100, 116, 139, 1)",
                    yAxisID: "yR",
                },
              ],
            },
            options: {
                responsive: true,
                interaction: {
                    mode: "index",
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: false, // This removes the legend
                    },
                    tooltip: {
                        intersect: false,
                        mode: 'index',                        
                        callbacks: {
                            label: function (context) {
                            // Access the trade using the dataIndex from the tooltip context
                            const trade = trades.data[context.dataIndex];

                            // Ensure the trade exists to avoid runtime errors
                            if (!trade) {
                                return "No trade data";
                            }
                            if (context.datasetIndex === 0) { // Or 1, depending on which dataset you want to show
                                // let label = context.dataset.label || '';
                                // if (label) {
                                //     label += ': ';
                                // }
                                // if (typeof context.parsed.y !== 'undefined') {
                                //     label += context.parsed.y;
                                // }
                                const cumulativePnl = context.chart.data.datasets[0].data[context.dataIndex];
                                const points = context.chart.data.datasets[1].data[context.dataIndex];
                                return [
                                  // `Points: ${points}`,
                                  `Symbol: ${trade.Symbol}`,
                                  `Dir: ${trade.Direction == 0 ? 'Buy' : 'Sell'}`,
                                  `Size: ${trade.Size}`,
                                  `Points: ${trade.Points.toFixed(0)}`,
                                  `PnL: ${trade.Pnl}`,
                                  `Cum. PnL: ${cumulativePnl.toFixed(0)}`,
                                    // `Entry: ${trade.EntryTime}`,
                                    // `Exit: ${trade.ExitTime}`,
                                    // `Open: ${trade.OpenPrice}`,
                                    // `Close: ${trade.ClosePrice}`,
                                ];
                                } else {
                                return null; // Don't show the label for the other dataset
                            }
                            // Aggregate data from both datasets into one tooltip
  


                            },
                        },
                        },

                },
                scales: {
                    x: {
                    title: {
                        display: false,
                        text: "Trade Count",
                    },
                    grid: {
                        display: false, // Hide the vertical gridlines
                        drawBorder: false, // Hide the border line at the bottom
                    },
                    ticks: {
                        beginAtZero: true, // Ensures the x-axis starts from zero
                        autoSkip: true, // Automatically skip labels if too crowded
                        maxRotation: 90, // Angle the labels if necessary
                        minRotation: 90,                        

                    },
                    },
                    yL: {
                    type: "linear",
                    position: "left",
                    title: {
                        display: true,
                        text: "Cumulative PnL",
                    },
                    grid: {
                        drawBorder: true,
                        drawOnChartArea: false, // Remove gridlines except zero
                        zeroLineColor: "black", // Keep zero line visible
                        zeroLineWidth: 1,
                    },
                    },  
                    yR: {
                        type: "linear",
                        position: "right",
                        title: {
                            display: true,
                            text: "Trade PnL",
                        },
                        grid: {
                            drawBorder: true,
                            drawOnChartArea: false, // Remove gridlines except zero
                            zeroLineColor: "black",
                            zeroLineWidth: 1,
                        },
                        },
              },
            },
          });
        }
      };
  
      onMounted(() => {
        updateChart();
      });
  
      watch(
        () => trades.data,
        () => {
          updateChart();
        },
        { deep: true }
      );
  
      return { chartCanvas };
    },
  });
  </script>
  