<template>
    <div>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted, watch } from "vue";
  import { Chart, registerables } from "chart.js";
  import { trades, tradeInfo, tradePrices } from "../../stateJournal";
  
  Chart.register(...registerables);
  
  export default defineComponent({
    name: "ChartComponent",
    // props: {
    // // Props definition is here
    //     priceData: {
    //         type: Object,
    //         required: true,
    //     },
    //     entryPrice: {
    //         type: Number,
    //         require: true
    //     }
    // },    
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
        console.log(tradeInfo.data)
        // const labels = trades.data.map((trade, index) => {
        //   if (trade.EntryTime) {
        //     const date = new Date(trade.EntryTime); // Parse the timestamp
        //     const hours = date.getHours().toString().padStart(2, "0"); // Ensure 2 digits for hours
        //     const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure 2 digits for minutes
        //     return `${hours}:${minutes}  [${index+1}]`; // Format to HH:mm
        //   }
        //   return "N/A"; // Fallback if EntryTime is missing
        // });
        const OpenPrice = tradeInfo.data.OpenPrice
        
        const labels = Object.values(tradePrices.data).map((_, index) => index + 1);
        // console.log(labels.length)
        const prices = Object.values(tradePrices.data).reduce((acc, price, index) => {
          const previous = acc[index - 1] || 0;
          acc.push((price - OpenPrice) * (tradeInfo.data.Direction == 0 ? 1 : -1));
          return acc;
        }, []);
        // console.log(prices)
        return { labels, prices };
      };
      
      const updateChart = () => {
        const { labels, prices } = prepareChartData();
        // console.log(labels.length)
        if (chartInstance) {
          chartInstance.data.labels = labels;
          chartInstance.data.datasets[0].data = prices;
        //   chartInstance.data.datasets[1].data = tradeprices;
          chartInstance.update();
        } else if (chartCanvas.value) {
          const ctx = chartCanvas.value.getContext("2d");
          
          const gradient = ctx.createLinearGradient(0, 0, 0, chartCanvas.value.height);
          gradient.addColorStop(0, "rgba(20, 184, 166, 0.3)"); // Green for positivergb(20, 184, 166)
            gradient.addColorStop(0.5, "rgba(0, 255, 0, 0.0)"); // Transparent
            gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.0)"); // Transparent
            gradient.addColorStop(1, "rgba(255, 0, 0, 0.3)"); // Red for negative          rgb(244, 63, 94)

          chartInstance = new Chart(ctx, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                    type: "line",
                    label: "Points",
                    data: prices,
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
                    pointRadius: 0, // Size of the dots
                    pointHoverRadius: 6, // Slightly larger on hover            
                    yAxisID: "yL",
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

                },

            },
          });
        }
      };
  
      onMounted(() => {
        // console.log(tradeInfo.data)
        updateChart();
      });
  
      watch(
        () => tradePrices.data,
        () => {
          console.log("prices changed")
          updateChart();
        },
        { deep: true }
      );
  

  
      return { chartCanvas };
    },
  });
  </script>
  