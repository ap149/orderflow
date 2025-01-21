import { reactive, ref as vueRef } from "@vue/reactivity";
import { database } from "./firebase";
import { ref, onChildAdded, off } from "firebase/database";
import router from './router';
// Reactive states
let selectedMarket = reactive({ selectedMarket: "DAX" });

const marketParams = {
  "DAX": {
    maxVolume: 200,
    maxTotal: 100,
    maxCell: 20,
    maxCumDelta: 200,
    maxCumDeltaNet: 200,
    stop: 7,
    limit: 15,
    size: 10,
    hours: 8,
    mins: 0,
    spread: 1,
    high: 22000,
    low: 20500,
    step: 0.1,
    max_chg: 10
  },
  "ES": {
    maxVolume: 2000,
    maxTotal: 1000,
    maxCell: 200,
    stop: 2,
    limit: 5,
    size: 25,
    hours: 14,
    mins: 30,
    spread: 0.3,
    high: 6150,
    low: 5600,
    step: 0.25,
    max_chg: 2.0
  },
  "NQ": {
    maxVolume: 500,
    maxTotal: 200,
    maxCell: 50,
    stop: 7,
    limit: 15,
    size: 5,
    hours: 14,
    mins: 30,
    spread: 1.0,
    high: 22000,
    low: 20000,
    step: 0.25,
    max_chg: 10
  },
}

const createLadder = (market) => {
  const priceObject = {};
  const { low, high, step } = marketParams[market];
  for (let price = high; price >= low; price -= step) {
    priceObject[price.toFixed(2)] = {
      from: Array(9).fill({}),
      to: Array(9).fill({}),
      filled: false,
    };
  }
  console.log("Ladder created for", market);
  return priceObject;
};
// Reactive data
const clearDelta = () => {
  return {
    "from": {
      "max": -10000,
      "min": 10000,
      "current": 0
    },
    "to": {
      "max":-10000,
      "min": 10000,
      "current": 0
    }
  }
}
let deltaLadderFrom = reactive({data:[]})
let deltaLadderTo = reactive({data:[]})
let delta = reactive(clearDelta())
const resetDelta = () => {
  const cleared = clearDelta();
  // Update each property manually to retain reactivity
  delta.from.max = cleared.from.max;
  delta.from.min = cleared.from.min;
  delta.from.current = cleared.from.current;

  delta.to.max = cleared.to.max;
  delta.to.min = cleared.to.min;
  delta.to.current = cleared.to.current;
};
let ladder = reactive(createLadder(selectedMarket.selectedMarket));
let prices = reactive([]);
let tpv = reactive([]);
let utc = reactive({ utc: 0 });
let calcCumDelta = vueRef(false)
const options = reactive({
  maxVolume: 30,
  maxTotal: 30,
  maxCell: 30,
  maxCumDelta: 30,
  maxCumDeltaNet: 30,
  minOpacity: 0.0,
  maxOpacity: 1.0,
  sessionStart: 0,
  spread: 0,
  size: 0,
  stop: 0,
  limit: 0,
  adj: 0.00,
  max_chg: 0
})
let intervals = reactive([]);

// Track the active listener reference
let currentListenerRef = null;

const changeMarket = (newMarket) => {
  console.log("Changing market to:", newMarket);
  
  // Skip if the selected market is already the same
  if (selectedMarket.selectedMarket === newMarket) return;

  // Update selected market
  selectedMarket.selectedMarket = newMarket;

  // Initialize options and reload data for the new market
  initOptions();
};

const initOptions = () => {
  console.log("Initializing options for market:", selectedMarket.selectedMarket);

  const today = new Date();
  today.setHours(
    marketParams[selectedMarket.selectedMarket].hours,
    marketParams[selectedMarket.selectedMarket].mins,
    0,
    0
  );

  options.sessionStart = today.getTime();
  options.spread = marketParams[selectedMarket.selectedMarket].spread;
  options.limit = marketParams[selectedMarket.selectedMarket].limit;
  options.stop = marketParams[selectedMarket.selectedMarket].stop;
  options.size = marketParams[selectedMarket.selectedMarket].size;
  options.maxVolume = marketParams[selectedMarket.selectedMarket].maxVolume;
  options.maxTotal = marketParams[selectedMarket.selectedMarket].maxTotal;
  options.maxCell = marketParams[selectedMarket.selectedMarket].maxCell;
  options.maxCumDelta = marketParams[selectedMarket.selectedMarket].maxCumDelta;
  options.maxCumDeltaNet = marketParams[selectedMarket.selectedMarket].maxCumDeltaNet;
  options.max_chg = marketParams[selectedMarket.selectedMarket].max_chg;

  intervals.unshift(options.sessionStart);

  // Reload data for the new market
  loadData();
};

const calculateCumDelta = (fromPx, toPx, data) => {
  const prices = Object.keys(data).map(String); // Get prices as numbers
  const resultFrom = {};
  const resultTo = {};
  // Sort prices in descending order
  prices.sort((a, b) => b - a);

  let cumFromDelta = 0;
  let cumToDelta = 0;
  // For prices above or equal to the input price
  for (const price of prices) {
    if (price == toPx) {
      resultFrom[price] = 0
      resultTo[price] = 0
    }
    if (price > toPx) {
      // console.log(data[price])
      if (!data[price].filled) continue
      cumFromDelta += data[price].from.at(-1).delta;
      cumToDelta += data[price].to.at(0).delta;
      // console.log(cumDelta)
      resultFrom[price] = { cum_delta: cumFromDelta };
      resultTo[price] = { cum_delta: cumToDelta };
    } else {
      break; // Stop when we pass below the fromPx
    }
  }
  
  cumFromDelta = 0;
  cumToDelta = 0;
  
  // For prices below the input price
  for (let i = prices.length - 1; i >= 0; i--) {
    const price = prices[i];
    if (price < toPx) {
      if (!data[price].filled) continue
      cumFromDelta += data[price].from.at(-1).delta;
      cumToDelta += data[price].to.at(0).delta;
      resultFrom[price] = { cum_delta: cumFromDelta };
      resultTo[price] = { cum_delta: cumToDelta };
    } else {
      break; // Stop when we pass above the inputPrice
    }
  }
  // console.log(result)
  deltaLadderFrom.data = resultFrom
  deltaLadderTo.data = resultTo
  // return result;
}


const loadData = () => {
  // Detach the previous listener, if any
  if (router.currentRoute.value.path != '/orderflow') return
  if (currentListenerRef) {
    console.log("Detaching previous listener...");
    off(currentListenerRef);
  }
  resetDelta()
  // Reset the ladder object while preserving reactivity
  const newLadder = createLadder(selectedMarket.selectedMarket);
  for (const key in ladder) {
    if (!newLadder[key]) {
      // Remove keys that no longer exist in the new ladder
      delete ladder[key];
    }
  }
  for (const key in newLadder) {
    // Add or update keys from the new ladder
    ladder[key] = newLadder[key];
  }

  // Clear other reactive arrays
  prices.splice(0); // Clear prices array
  tpv.splice(0); // Clear tpv array

  // Attach a new listener
  console.log("Loading data for market:", selectedMarket.selectedMarket);
  const dbRef = ref(database, `priceFeed/${selectedMarket.selectedMarket.toLowerCase()}`);
  currentListenerRef = dbRef;
  let inputPx = 0
  let debounceTimeout = null;
  onChildAdded(dbRef, (snapshot) => {
    calcCumDelta.value = false
    const item = snapshot.val();
    const fromPx = roundPx(item.from.price, marketParams[selectedMarket.selectedMarket].step, true);
    const toPx = roundPx(item.to.price, marketParams[selectedMarket.selectedMarket].step, true);

    if (fromPx != 0) {
      try {
        ladder[fromPx].from.push(item.from);
        ladder[fromPx].from.shift();
        ladder[fromPx].filled = 1;
      } catch (error) {
        console.error("Error updating ladder 'from':", error);
      }
    }
    try {
      ladder[toPx].filled = 2;
      ladder[toPx].to.unshift(item.to);
      ladder[toPx].to.pop();
    } catch (error) {
      console.error("Error updating ladder 'to':", error);
    }

    if (!prices.includes(toPx)) prices.push(toPx);
    if (!prices.includes(fromPx)) prices.push(fromPx);
    prices.sort((a, b) => b - a);

    utc.utc = item.to.utc;
    updateIntervals(item.to.utc);
    tpv.unshift(item);
    if (tpv.length > 200) tpv.pop();
    const cumulativeFromDelta = delta.from.current + Math.round(item.from.delta)
    delta.from.max = Math.max(delta.from.max, cumulativeFromDelta)
    delta.from.min = Math.min(delta.from.min, cumulativeFromDelta)
    delta.from.current = cumulativeFromDelta
    const cumulativeToDelta = delta.to.current + Math.round(item.to.delta)
    delta.to.max = Math.max(delta.to.max, cumulativeToDelta)
    delta.to.min = Math.min(delta.to.min, cumulativeToDelta)
    delta.to.current = cumulativeToDelta
    // calculateCumDelta(fromPx, toPx,ladder)
    clearTimeout(debounceTimeout);    
    debounceTimeout = setTimeout(() => {
      // Run your callback after 250ms of inactivity
      calcCumDelta.value = true;
      console.log("Called after 250ms of no new children");
      calculateCumDelta(fromPx, toPx,ladder)
      // Optionally, invoke your calculation here
      // calculateCumDelta(fromPx, toPx, ladder);
    }, 100); // 250ms delay
    // console.log("next...")
  });
};


const roundPx = (px, step = 0.25, asString = false) => {
  const res = (Math.round(px / step) * step).toFixed(2);
  return asString ? res : parseFloat(res);
};

const updateIntervals = (utc) => {
  const next = intervals[0] + 5 * 60 * 1000;
  if (utc > next) intervals.unshift(next);
};

const selectedCell = reactive({
  from: false,
  selectedCell: false})
const changeSelectedCell = (item, from) => {
  console.log("change cell")
  if (!item) {
    console.log("no cell")
    selectedCell.selectedCell = false
  }
  selectedCell.selectedCell = item
  selectedCell.from = from
}


// Exported functions and reactive data
export {
  loadData,
  initOptions,
  selectedMarket,
  changeMarket,
  prices,
  ladder,
  deltaLadderFrom,
  deltaLadderTo,
  utc,
  options,
  intervals,
  tpv, selectedCell, changeSelectedCell,
  delta
};
