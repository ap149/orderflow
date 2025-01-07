import { reactive } from '@vue/reactivity';
import { database } from "./firebase";
import { ref, onChildAdded } from "firebase/database";

let selectedMarket = reactive({selectedMarket: "DAX"})

const changeMarket = (mkt) => {
  console.log("change...", mkt)
  if (selectedMarket.selectedMarket == mkt) return;
  selectedMarket.selectedMarket = mkt
  loadData()
}

const marketParams = {
  "DAX": {
    maxVolume: 200,
    maxTotal: 100,
    maxCell: 20,
    stop: 7,
    limit: 15,
    size: 10,
    hours: 8,
    mins: 0,
    spread: 1,
    high: 20600,
    low: 19500,
    step: 0.1,
    max_chg: 20
  },
  "ES": {
    maxVolume: 300,
    maxTotal: 1000,
    maxCell: 100,
    stop: 2,
    limit: 5,
    size: 25,
    hours: 14,
    mins: 30,
    spread: 0.3,
    high: 6150,
    low: 5600,
    step: 0.25,
    max_chg: 0.5
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

let  utc = reactive({utc: 0})
// let recentPrices = reactive({value_:[false, false, false, false, false, false, false, false, false]});
const createLadder = (sec) => {
  const priceObject = {};
  const low = marketParams[sec]["low"]
  const high = marketParams[sec]["high"]
  const step = marketParams[sec]["step"]
  for (let price = high; price >= low; price -= step) {
    priceObject[price.toFixed(2)] = {
      "from": [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      "to": [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
      "filled": false
    };
  }
  console.log("ladder created")
  console.log(priceObject)
  return priceObject;  
}
let ladder = reactive(createLadder(selectedMarket.selectedMarket))
let prices = reactive([])
let tpv = reactive([])

const options = reactive({
  maxVolume: 30,
  maxTotal: 30,
  maxCell: 30,
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

let intervals = reactive([])
const initOptions = () => {
  console.log("reset")
  // ladder = createLadder(selectedMarket.selectedMarket)
  // reset()
  let today = new Date();
  // today.setDate(today.getDate() - 2);
  // console.log(today)
  today.setHours(marketParams[selectedMarket.selectedMarket].hours,marketParams[selectedMarket.selectedMarket].mins, 0, 0); // Set time to 14:30:00
  options.sessionStart = today.getTime()
  options.spread =marketParams[selectedMarket.selectedMarket].spread
  options.limit = marketParams[selectedMarket.selectedMarket].limit
  options.stop = marketParams[selectedMarket.selectedMarket].stop
  options.size = marketParams[selectedMarket.selectedMarket].size
  options.maxVolume = marketParams[selectedMarket.selectedMarket].maxVolume
  options.maxTotal = marketParams[selectedMarket.selectedMarket].maxTotal
  options.maxCell = marketParams[selectedMarket.selectedMarket].maxCell
  options.max_chg = marketParams[selectedMarket.selectedMarket].max_chg

  intervals.unshift(options.sessionStart)
  // ladder =createLadder(selectedMarket.selectedMarket)
  // console.log(options.sessionStart)
  // console.log(intervals)
  loadData()  
}

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


const updateIntervals = (utc) => {
  const l = intervals.length
  const next = intervals[0] +  5 * 60 * 1000
  // const latest = intervals[0]
  if (utc > next) {
    intervals.unshift(next)
  }
  // if utc
}

const reset = () => {
  ladder =createLadder(selectedMarket.selectedMarket)
  // recentPrices.value_ = [false, false, false, false, false, false, false, false, false]
  // prices = []
}

const roundPx = (px, step=0.25, asString = false) => {
  const res = (Math.round(px / step) * step).toFixed(2)
  return asString ? res : parseFloat(res)
}

const loadData = () => {
  // reset()
  // ladder =createLadder(selectedMarket.selectedMarket)
  // initOptions()
  console.log("loading data...")
  console.log(selectedMarket.selectedMarket)
  const dbRef = ref(database, selectedMarket.selectedMarket.toLowerCase());
  onChildAdded(dbRef, (snapshot) => {
    const item = snapshot.val();
    const from_px = roundPx(item["from"]["price"],selectedMarket.selectedMarket.step,true)
    const to_px = roundPx(item["to"]["price"],selectedMarket.selectedMarket.step,true)
    // console.log(item)  
    // console.log(item["to"])  
    if (from_px != 0 ){
      try{
        // console.log(from_px)
        // console.log(ladder[from_px])
        ladder[from_px]["from"].push(item["from"])
        ladder[from_px]["from"].shift(item["from"])
        ladder[from_px]["filled"] = 1
      } catch (error) {
        console.log(error)
        console.log(from_px)
        console.log(ladder[from_px])
      }
    }
    try{
      ladder[to_px]["filled"] = 2
      ladder[to_px]["to"].unshift(item["to"])
      ladder[to_px]["to"].pop(item["to"])
    } catch (error) {
    }
    
    if (!prices.includes(to_px)) {
      prices.push(to_px);
    }
    if (!prices.includes(from_px)) {
      prices.push(from_px);
    }
    prices.sort((a,b) => b-a)
    // recentPrices.value_.unshift(to_px);
    // recentPrices.value_.pop();
    utc.utc = item["to"]["utc"]
    updateIntervals(item["to"]["utc"])
    tpv.unshift(item)
    if (tpv.length > 500) tpv.pop();
      // // if ()  
    // console.log(ladder[from_px]["utc"])
    // console.log(prices)
  })
  console.log(" *************** LOADED **************")
  // console.log(prices)
}

export {
  loadData,
  initOptions,
  selectedMarket,
  changeMarket,
  prices,
  ladder, utc,
  options,
  intervals,
  tpv, selectedCell, changeSelectedCell
}