import { reactive } from "@vue/reactivity";
import { database } from "./firebase";
import { ref, onChildAdded, off, remove } from "firebase/database";

let trades = reactive({data:[]});
let selectedDay = reactive({date:false})
let selectedMkt = reactive({mkt:false})

const updateTrades = (mkt, obj) => {
    console.log("called....")
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


export {
    trades,
    updateTrades,
    selectedDay,
    selectedMkt,
    getChartData,
    deleteComment,
}