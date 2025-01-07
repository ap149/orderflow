import { reactive } from '@vue/reactivity';
import { ref, onChildAdded } from "firebase/database";
import { database } from "./firebase";

let selectedMarket = reactive({value_: "ES"})

const changeMarket = (mkt) => {
  console.log("change...", mkt)
  if (selectedMarket.value_ == mkt) return;
  selectedMarket.value_ = mkt
  loadData()
}

const marketParams = {
  "DAX": {
    maxVolume: 30,
    stop: 7,
    limit: 15,
    size: 5,
    hours: 8,
    mins: 0,
    spread: 1
  },
  "ES": {
    maxVolume: 300,
    stop: 2,
    limit: 5,
    size: 25,
    hours: 14,
    mins: 30,
    spread: 0.3
  },
  "NQ": {
    maxVolume: 300,
    stop: 7,
    limit: 15,
    size: 3,
    hours: 14,
    mins: 30,
    spread: 1.0
  },
}

// let today = new Date()
const initOptions = () => {
  console.log("reset")
  reset()
  let today = new Date();
  // today.setDate(today.getDate() - 2);
  // console.log(today)
  today.setHours(marketParams[selectedMarket.value_].hours,marketParams[selectedMarket.value_].mins, 0, 0); // Set time to 14:30:00
  options.sessionStart = today.getTime()
  options.spread =marketParams[selectedMarket.value_].spread
  options.limit = marketParams[selectedMarket.value_].limit
  options.stop = marketParams[selectedMarket.value_].stop
  options.size = marketParams[selectedMarket.value_].size
  options.maxVolume = marketParams[selectedMarket.value_].maxVolume
  options.candleVolume = marketParams[selectedMarket.value_].maxVolume
  // loadData()  
}


let prices = reactive({value_:[]});
// let recentPrices = reactive({value_:[false, false, false, false, false, false, false, false, false]});
let options = reactive({
  maxVolume: 30,
  candleVolume: 30,
  minOpacity: 0.0,
  maxOpacity: 1.0,
  sessionStart: 0,
  spread: 0,
  size: 0,
  stop: 0,
  limit: 0,
  adj: 0.00,
});
let totals = reactive({value_:[]});

let cumulativeDelta = reactive({value_:{
  session: {
    max:0,
    min:0,
    total: 0,
    vol: 0
  },
  intervals: {},
}})
let intervals = reactive({value_: []})

let updateCumulativeDelta = (vol, chg, utc) => {
  if (utc< options.sessionStart) return
  let session_total = cumulativeDelta.value_.session.total//.session.total
  // console.log(session_total)
  const delta = chg > 0 ? vol : (chg < 0 ? -vol : 0)
  cumulativeDelta.value_.session.total = session_total + delta
  // console.log("delta: ", cumulativeDelta.value_.session.total)
  cumulativeDelta.value_.session.min = Math.min(cumulativeDelta.value_.session.min, cumulativeDelta.value_.session.total) 
  cumulativeDelta.value_.session.max = Math.max(cumulativeDelta.value_.session.max, cumulativeDelta.value_.session.total) 
  cumulativeDelta.value_.session.vol =  cumulativeDelta.value_.session.vol + vol
  const interval_index = Math.floor( (utc - options.sessionStart) / 1000 / (5 * 60))
  if (!cumulativeDelta.value_.intervals.hasOwnProperty(interval_index)) {
    cumulativeDelta.value_.intervals[interval_index] = {
      min: 0,
      max: 0,
      total: 0,
      time: options.sessionStart + interval_index * 5 * 60 * 1000,
      vol: 0
    }
  }
  const current_total=  cumulativeDelta.value_.intervals[interval_index].total + delta
  const current_max = Math.max(cumulativeDelta.value_.intervals[interval_index].max,current_total)
  const current_min = Math.min(cumulativeDelta.value_.intervals[interval_index].min,current_total)
  cumulativeDelta.value_.intervals[interval_index].total = current_total
  cumulativeDelta.value_.intervals[interval_index].min = Math.min(current_min, current_total ) 
  cumulativeDelta.value_.intervals[interval_index].max = Math.max(current_max, current_total ) 
  cumulativeDelta.value_.intervals[interval_index].vol = cumulativeDelta.value_.intervals[interval_index].vol + vol
  intervals["value_"] = objectToArray(cumulativeDelta.value_.intervals).reverse()
}

const objectToArray = (obj) => {
  return Object.keys(obj).map((key, index) => ({ index, value_: obj[key] }));
};

let ranges = reactive({
  lastPrice: false,
  maxTicks: -1000000000000,
  minTicks: 10000000000000,

  maxDownTicks: -1000000000000,
  minDownTicks: 10000000000000,
  maxUpTicks: -1000000000000,
  minUpTicks: 10000000000000,
  maxTickDelta: -1000,

  maxVolume: -1000000000000,
  minVolume: 10000000000000,

  maxDownVol: -1000000000000,
  minDownVol: 10000000000000,

  maxUpVol: -1000000000000,
  minUpVol: 10000000000000,
  
  maxDelta: -1000000000000,
  minDelta: 10000000000000,      
});




const reset = () => {
  prices.value_ = [] 
  // recentPrices.value_ = [false, false, false, false, false, false, false, false, false]
  totals.value_ = []
  ranges = {
    lastPrice: false,
    maxTicks: -1000000000000,
    minTicks: 10000000000000,

    maxDownTicks: -1000000000000,
    minDownTicks: 10000000000000,
    maxUpTicks: -1000000000000,
    minUpTicks: 10000000000000,
    maxTickDelta: -1000,
  
    maxVolume: -1000000000000,
    minVolume: 10000000000000,
    maxDownVol: -1000000000000,
    minDownVol: 10000000000000,
  
    maxUpVol: -1000000000000,
    minUpVol: 10000000000000,    
  
    maxDelta: -1000000000000,
    minDelta: 10000000000000,    
  }
  cumulativeDelta.value_ = {
    session: {
      max:0,
      min:0,
      total: 0,
      vol: 0
    },
    intervals: {},
  }
}


const updateRow = (index, price, item) => {
  const prev = totals.value_[index][price];
  const down_vol = prev["down_vol"] + (item["chg"] < 0 ? item["volume"] : 0);
  const up_vol = prev["up_vol"] + (item["chg"] > 0 ? item["volume"] : 0);
  totals.value_[index][price]["utc"] = item["utc"];
  totals.value_[index][price]["ticks"] = prev["ticks"] + 1;
  totals.value_[index][price]["down_ticks"] = prev["down_ticks"] + (item["chg"] < 0 ? 1 : 0);
  totals.value_[index][price]["up_ticks"] = prev["up_ticks"] + (item["chg"] > 0 ? 1 : 0);
  totals.value_[index][price]["delta_ticks"] = prev["delta_ticks"] + (item["chg"] > 0 ? 1 : (item["chg"] < 0 ? -1 : 0));
  totals.value_[index][price]["volume"] = prev["volume"] + item["volume"];
  totals.value_[index][price]["down_vol"] =
    prev["down_vol"] + (item["chg"] < 0 ? item["volume"] : 0);
  totals.value_[index][price]["up_vol"] =
    prev["up_vol"] + (item["chg"] > 0 ? item["volume"] : 0);
  totals.value_[index][price]["volume_delta"] =  up_vol - down_vol;
  if (item['volume'] > 0){
    prices.value_[index][price].unshift(item);
    if (prices.value_[index][price].length > 100) {
      prices.value_[index][price].pop()
    }
  }
  const prev_price = price - item['chg']
  const prev_index = (totals.value_).findIndex(obj => Object.keys(obj)[0] == prev_price)
  const prev_from_max = totals.value_[prev_index][prev_price]["from_delta_max"]
  const prev_from_min = totals.value_[prev_index][prev_price]["from_delta_min"]
  const new_delta = totals.value_[prev_index][prev_price]["from_delta"] + item['volume'] * (item['chg'] > 0 ? 1 : (item['chg'] < 0 ? -1 : 0))
  totals.value_[prev_index][prev_price]["from_delta"] =  new_delta
  totals.value_[prev_index][prev_price]["from_delta_min"] = Math.min(totals.value_[prev_index][prev_price]["from_delta_min"], new_delta)
  totals.value_[prev_index][prev_price]["from_delta_max"] = Math.max(totals.value_[prev_index][prev_price]["from_delta_max"], new_delta)
  updateCumulativeDelta( item["volume"], item["chg"], item['utc'] );
  // }
  updateRanges();
};

const updateRanges = () => {
  // console.log("*********** UPDATING ");
  totals.value_.forEach((item) => {
    // Each item has a single key representing the price
    const priceKey = Object.keys(item)[0];
    const ticks = item[priceKey].ticks;
    const downTicks = item[priceKey].down_ticks;
    const upTicks = item[priceKey].up_ticks;
    const volume = item[priceKey].volume;
    const downVol = item[priceKey].down_vol;
    const upVol = item[priceKey].up_vol;
    
    if (ticks < ranges.minTicks) ranges.minTicks = ticks;
    if (ticks > ranges.maxTicks) ranges.maxTicks = ticks;
    
    if (upTicks < ranges.minUpTicks) ranges.minUpTicks = upTicks;
    if (upTicks > ranges.maxUpTicks) ranges.maxUpTicks = upTicks;
    
    if (downTicks < ranges.minDownTicks) ranges.minDownTicks = downTicks;
    if (downTicks > ranges.maxDownTicks) ranges.maxDownTicks = downTicks;

    const ticksDelta = Math.abs(item[priceKey].delta_ticks);
    if (ticksDelta > ranges.maxTickDelta) ranges.maxTickDelta = ticksDelta;
    
    if (volume < ranges.minVolume) ranges.minVolume = volume;
    if (volume > ranges.maxVolume) ranges.maxVolume = volume;
    
    if (downVol < ranges.minDownVol) ranges.minDownVol = downVol;
    if (downVol > ranges.maxDownVol) ranges.maxDownVol = downVol;
    
    if (upVol < ranges.minUpVol) ranges.minUpVol = upVol;
    if (upVol > ranges.maxUpVol) ranges.maxUpVol = upVol;
    
    const volumeDelta = Math.abs(item[priceKey].volume_delta);
    if (volumeDelta > ranges.maxDelta) ranges.maxDelta = volumeDelta;
    // if (volumeDelta < ranges.minDelta) ranges.minDelta = volumeDelta;
  });
  // console.log(state.maxTicks);
};
// const updateRecentPrices = (price) => {
//   recentPrices.value_.unshift(price);
//   recentPrices.value_.pop();
// };


const loadData = () => {
  console.log("Loading....", selectedMarket.value_)
  initOptions()
  const dbRef = ref(database, selectedMarket.value_.toLowerCase());
  onChildAdded(dbRef, (snapshot) => {
    const newItem = snapshot.val();
    // console.log(newItem)
    const { price, volume, chg, utm, prev } = newItem;
    // console.log(price, volume, chg);
    const index = prices.value_.findIndex(
      (obj) => Object.prototype.hasOwnProperty.call(obj, price) // Safely check for property
    );
    const vol = parseFloat(volume);

    const item = {
      volume: vol,
      chg: chg,
      utc: utm,
      prev: prev
    };
    // if (chg == 0){
    //   console.log(item)
    // }
    // console.log(item);
    // updateRecentPrices(price);
    if (index !== -1) {
      // console.log(index, price, item)
      updateRow(index, price, item);
    } else {
      // console.log({[price]:[item]})
      prices.value_.push({
        [price]: [item],
      });
      
      const down_vol = parseFloat(chg) < 0 ? vol : 0
      const up_vol = parseFloat(chg) > 0 ? vol : 0
      const delta = (down_vol || up_vol ) ? (up_vol ? up_vol : 0) - (down_vol ? down_vol : 0) : 0
      const up_ticks = parseFloat(chg) < 0 ? 1 : 0
      const down_ticks = parseFloat(chg) > 0 ? 1 : 0
      const delta_ticks = up_ticks - down_ticks
      totals.value_.push({
        [price]: {
          ticks: 1,
          volume: vol,
          down_vol: down_vol,
          up_vol: up_vol,
          volume_delta: delta,
          up_ticks: up_ticks,
          down_ticks: down_ticks,
          delta_ticks: delta_ticks,
          utc: utm,
          total_delta: delta,
          prev: prev,
          from_delta: 0,
          from_delta_max: 0,
          from_delta_min: 0,
        },
      });
      // Sort the prices array in descending order by price
      prices.value_.sort((a, b) => {
        // Extract the price key as a number and compare them
        const priceA = parseFloat(Object.keys(a));
        const priceB = parseFloat(Object.keys(b));

        return priceB - priceA; // Descending order
      });
      totals.value_.sort((a, b) => {
        // Extract the price key as a number and compare them
        const priceA = parseFloat(Object.keys(a));
        const priceB = parseFloat(Object.keys(b));

        return priceB - priceA; // Descending order
      });
      updateRanges();

      // console.log(lastPrice);
      // console.log(prices);
    }
  })
  console.log("*********** DONE ");
}

export {
  selectedMarket,
  options,
  changeMarket,
  loadData,
  totals,
  ranges,
  prices,

  cumulativeDelta,
  intervals
}