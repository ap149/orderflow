<template>
  <div class="w-full h-96" ref="chartContainer"></div>
</template>

<script>
import { onMounted, ref, watch, onUnmounted } from "vue";
import { createChart } from "lightweight-charts";

export default {
  props: {
    candles: {
      type: Array,
      required: true, // OHLC data as a prop
    },
    trades: {
      type: Array,
      default: () => [], // Optional trade data
    },
  },
  setup(props) {
    const chartContainer = ref(null);
    let chart = null;
    let candleSeries = null;
    let tradeLines = []; // Track all trade lines
    

    // Initialize the chart
    const initializeChart = () => {
      if (!chartContainer.value) return;

      chart = createChart(chartContainer.value, {
        width: chartContainer.value.offsetWidth,
        height: chartContainer.value.offsetHeight,
        layout: {
          backgroundColor: "#ffffff", // Chart background color
          textColor: "#333", // Text color for scales and labels
          fontFamily: "'Nunito', sans-serif", // Use Nunito font
          fontSize: 10
        },
        grid: {
          vertLines: { color: "#f0f3fa" },
          horzLines: { color: "#f0f3fa" },
        },
        crosshair: {
          mode: 0, // Crosshair floats freely (default is 1, which snaps to data)
        },        
        timeScale: {
          timeVisible: true, // Ensure time is shown
          secondsVisible: false, // Hide seconds (optional)
          tickMarkFormatter: (time) => {
            const date = new Date(time * 1000); // Convert seconds to milliseconds
            const hours = String(date.getUTCHours()).padStart(2, "0"); // UTC hours
            const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // UTC minutes
            return `${hours}:${minutes}`; // Format as hh:mm
          },
        },
      });

      // Add candlestick series
      // Add candlestick series with custom colors
      candleSeries = chart.addCandlestickSeries({
        upColor: "#2DD4BF", // Custom green for bullish candles
        downColor: "#FB7185", // Custom red for bearish candles
        borderUpColor: "#000000", // Black border for bullish candles
        borderDownColor: "#000000", // Black border for bearish candles
        wickUpColor: "#000000", // Black wick for bullish candles
        wickDownColor: "#000000", // Black wick for bearish candles
      });

      candleSeries.setData(props.candles);
      adjustTimeScale(props.candles);
      // Handle window resize
      const handleResize = () => {
        chart.resize(
          chartContainer.value.offsetWidth,
          chartContainer.value.offsetHeight
        );
      };

      window.addEventListener("resize", handleResize);

      // Cleanup on unmount
      onUnmounted(() => {
        window.removeEventListener("resize", handleResize);
        chart.remove();
      });
    };

    const adjustTimeScale = (candles) => {
      if (!candles || candles.length === 0) return;

      const firstTime = candles[0].time;
      const lastTime = candles[candles.length - 1].time;

      // Update the visible range of the chart's time scale
      chart.timeScale().setVisibleRange({ from: firstTime, to: lastTime });
    };
    // Watch for candle data updates
    watch(
      () => props.candles,
      (newCandles) => {
        if (candleSeries) {
          candleSeries.setData(newCandles);
          adjustTimeScale(newCandles);
        }
      },
      { immediate: true, deep: true }
    );

    // Watch for trade updates
    watch(
      () => props.trades,
      (newTrades) => {
        console.log(newTrades)
        if (!chart) return;
        // Clear previous trade lines
        tradeLines.forEach((line) => chart.removeSeries(line));
        tradeLines = [];

        // // Add new trade lines
        newTrades.forEach((trade) => {
          let color = null
          if (trade.Direction == 0) {
            color = trade.ClosePrice >= trade.OpenPrice ? "#0D9488" : "#E11D48"
          } else {
            color = trade.ClosePrice < trade.OpenPrice ? "#0D9488" : "#E11D48"
          }
          const tradeLine = chart.addLineSeries({
            color: color, // Profit/Loss coloring
            lineWidth: 3,
          });
          const roundToMinute = (time) => {
            const date = new Date(time);
            date.setSeconds(0); // Set seconds to 0
            date.setMilliseconds(0); // Set milliseconds to 0
            return Math.floor(date.getTime() / 1000); // Convert to Unix timestamp
          };

          const entryTime = roundToMinute(new Date(trade.EntryTime));
          const exitTime = roundToMinute(new Date(trade.ExitTime));    
          tradeLine.setData([
            { time: entryTime, value: trade.OpenPrice },
            { time: exitTime, value: trade.ClosePrice },
          ]);
          tradeLines.push(tradeLine); // Track the trade line
        });
      },
      { immediate: true, deep: true }
    );

    // Mount the chart when the component is ready
    onMounted(() => {
      initializeChart();
    });


    return {
      chartContainer,
    };
  },
};
</script>


<style scoped>
/* Optional styling */
</style>
