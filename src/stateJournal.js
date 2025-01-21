import { reactive } from "@vue/reactivity";
import { database } from "./firebase";
import { ref, onChildAdded, off, remove, get, update } from "firebase/database";
import { data } from "autoprefixer";
import { getUTC } from "./utils";
import { clearCanvas } from "chart.js/helpers";

let trades = reactive({data:[]});
let tradePrices = reactive({data:[]});
let tradeCandles = reactive({data:[]});
let tradesTV = reactive({data:[]});
let tradeInfo = reactive({data:{}})
let loadedTrade = reactive({data:{}})
let selectedDay = reactive({date:false})
let selectedMkt = reactive({mkt:false})
let sessionPrices = reactive({data:[]})
let sessionTrades = reactive({data:[]})

const updateTrades = (mkt, obj) => {
    console.log("called....", mkt)
    // trades.data = obj
    // trades.data = []
    let new_trades = []
    let cumPts = 0
    let cumPnl = 0
    let maxCumPts = 0
    let maxCumPnl = 0
    let minCumPts = 0
    let minCumPnl = 0
    Object.entries(obj).forEach(([key, trade]) => {
        // console.log(key, value.split(','));
        if (trade.Symbol.includes(mkt) || !mkt){
            // // trade = [...trade ]
            cumPnl += trade["Pnl"]
            trade["CumPnl"] = cumPnl
            cumPts += trade["Points"]
            trade["CumPts"] = cumPts
            minCumPts = Math.min(minCumPts, cumPts)
            maxCumPts = Math.max(maxCumPts, cumPts)
            minCumPnl = Math.min(minCumPnl, cumPnl)
            maxCumPnl = Math.max(maxCumPnl, cumPnl)
            new_trades.push(trade)
        }
    })
    new_trades.forEach((trade) => {
        trade["minCumPts"] = minCumPts;
        trade["maxCumPts"] = maxCumPts;
        trade["minCumPnl"] = minCumPnl;
        trade["maxCumPnl"] = maxCumPnl;
    })
    trades.data = new_trades
    loadSession(mkt.toLowerCase())
}

const deleteComment = async (id) => {
    const commentRef = ref(database, `comments/${id}`)
    try {
      await remove(commentRef); // Remove the item from the specified path
      console.log(`Item with key ${id} has been removed.`);
    } catch (error) {
      console.error("Error removing item:", error);
    }    
}

// dataService.js
const getChartData = () => {
    return {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Sales',
                data: [30, 50, 70, 20, 90],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ], 
    };
};

const changeCommentType = async (str, timestamp) => {
    const commentRef = ref(database, `comments/${timestamp}`)
    try {
        await update(commentRef, {type: str}); // Remove the item from the specified path
        console.log(`Item with key ${timestamp} has been removed.`);
      } catch (error) {
        console.error("Error removing item:", error);
      }        
}

const generateCandles = (data) => {
    // Step 1: Prepare the data
    console.log("gen candles")
    // console.log(data)
    tradeCandles.value = []
    const sortedKeys = Object.keys(data).sort((a, b) => a - b); // Sort timestamps
    const candles = [];
  
    // Step 2: Group by 1-minute intervals
    const grouped = {};
    sortedKeys.forEach((timestamp) => {
      const date = new Date(parseInt(timestamp, 10));
      const minuteKey = date.toISOString().substring(0, 16); // Get YYYY-MM-DDTHH:MM
      if (!grouped[minuteKey]) {
        grouped[minuteKey] = [];
      }
      grouped[minuteKey].push(data[timestamp]); // Adjust to match the nested price path
    });
    // console.log(grouped)
    // Step 3: Calculate OHLC for each group
    for (const [minute, prices] of Object.entries(grouped)) {
      let time = new Date(minute).getTime()
      const ohlc = {
        time: Math.floor(time / 1000), // Convert back to a timestamp
        open: prices[0],
        high: Math.max(...prices),
        low: Math.min(...prices),
        close: prices[prices.length - 1],
      };
      candles.push(ohlc);
    }
    tradeCandles.value = candles
    // console.log(candles)
    // return candles;
  }
  
  // Example Usage
const loadSession = async (mkt) => {
    if (!mkt) return
    const pricesRef = ref(database, mkt); // Use correct database instance
    try {
        const snapshot = await get(pricesRef); // Fetch data at the specified path
        if (snapshot.exists()) {
            sessionPrices.data = snapshot.val(); // Extract data
            console.log("session prices:")
            console.log(sessionPrices.data)
            generateCandles(snapshot.val())
        } else {
            console.log("No data available for the given UTC:", utc);
        }
    } catch (error) {
    
    }

}

const loadTrade = async (trade) => {
    tradesTV.data = [trade]
    // tradesTV.data.push(trade).push(trade)
    tradeInfo.data = {...trade}
    // console.log(tradesTV.data)
    const utc = getUTC(trade.ExitTime)
    const pricesRef = ref(database, `tradePriceHistory/${utc}`); // Use correct database instance

    try {
        const snapshot = await get(pricesRef); // Fetch data at the specified path
        if (snapshot.exists()) {
            tradePrices.data = snapshot.val(); // Extract data
            console.log("trade prices:")
            // console.log(tradePrices.data)
            generateCandles(snapshot.val())
        } else {
            console.log("No data available for the given UTC:", utc);
        }
    } catch (error) {

    }
    // return prices; // Return the fetched prices if needed elsewhere
};


export {
    trades,
    updateTrades,
    selectedDay,
    selectedMkt,
    getChartData,
    deleteComment,
    loadTrade,
    loadedTrade,
    tradePrices,
    tradeInfo,
    tradeCandles,
    tradesTV,
    loadSession,
    changeCommentType
}