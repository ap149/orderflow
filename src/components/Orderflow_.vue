<template>
  <div class="grow overflow-y-scroll text-xxs">
    <table
      class="table-auto border-separate border-spacing-0 border border-slate-300 w-full select-none mb-12"
      @click="handleTableClick"
    >
      <!-- <thead>
        <tr class="sticky top-0 z-100">
          <th>Tick</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
          <th>UpT</th>
        </tr> -->
      <!-- </thead> -->
      <thead class="bg-gray-100">
        <tr class="border-b border-b-slate-500">
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">Total Ticks</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">Tick Delta</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">Total Volume</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">Volume Delta</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">
            From Delta Min
          </th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">From Delta</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">
            From Delta Max
          </th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">Time</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">Bid</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">Mid</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">Offer</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">5m[0]</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">5m[1]</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200">5m[2]</th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
          <th class="sticky top-0 px-2 py-1 z-20 bg-slate-200"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(priceData, index) in prices.value_"
          :key="index"
          @mouseover="highlightRow(index)"
          :class="index == highlightRow.value_ ? 'border-b border-b-black' : ''"
        >
          <td
            class="border-b border-b-slate-300 border-r border-r-slate-300 px-2 sticky left-0 max-w-11 min-w-11 user-select-none z-10"
            :class="
              totalTickColor(
                totals.value_[index][Object.keys(priceData)[0]]['ticks']
              )
            "
          >
            {{ totals.value_[index][Object.keys(priceData)[0]]["ticks"] }}
          </td>
          <!-- <td
            class="border-b border-b-slate-300 border-r border-r-slate-300 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            :class="
              downTickColor(
                totals.value_[index][Object.keys(priceData)[0]]['down_ticks']
              )
            "
            style="left: 44px"
          >
            {{ totals.value_[index][Object.keys(priceData)[0]]["down_ticks"] }}
          </td>
          <td
            class="border-b border-b-slate-300 border-r border-r-slate-500 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            :class="
              upTickColor(
                totals.value_[index][Object.keys(priceData)[0]]['up_ticks']
              )
            "
            style="left: 88px"
          >
            {{ totals.value_[index][Object.keys(priceData)[0]]["up_ticks"] }}
          </td> -->
          <td
            class="border-b border-b-slate-300 border-r border-r-slate-500 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            :class="
              deltaTickColor(
                totals.value_[index][Object.keys(priceData)[0]]['delta_ticks']
              )
            "
            style="left: 44px"
          >
            {{ totals.value_[index][Object.keys(priceData)[0]]["delta_ticks"] }}
          </td>

          <td
            class="border-b border-b-slate-300 border-r border-r-slate-300 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            :class="
              totalVolumeColor(
                totals.value_[index][Object.keys(priceData)[0]]['volume']
              )
            "
            style="left: 88px"
          >
            {{ totals.value_[index][Object.keys(priceData)[0]]["volume"] }}
          </td>
          <!-- <td
            class="border-b border-r border-slate-300 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            :class="
              totalDownColor(
                totals.value_[index][Object.keys(priceData)[0]]['down_vol']
              )
            "
            style="left: 220px"
          >
            {{ totals.value_[index][Object.keys(priceData)[0]]["down_vol"] }}
          </td>
          <td
            class="border-b border-slate-300 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            :class="
              totalUpColor(
                totals.value_[index][Object.keys(priceData)[0]]['up_vol']
              )
            "
            style="left: 264px"
          >
            {{ totals.value_[index][Object.keys(priceData)[0]]["up_vol"] }}
          </td> -->
          <td
            class="border-b border-b-slate-300 px-2 sticky max-w-11 min-w-11 user-select-none z-10 border-r border-r-slate-500"
            :class="
              deltaColor(
                totals.value_[index][Object.keys(priceData)[0]]['volume_delta']
              )
            "
            style="left: 132px"
          >
            {{
              totals.value_[index][Object.keys(priceData)[0]]["volume_delta"]
            }}
          </td>
          <td
            class="border-b border-b-slate-300 border-r border-r-slate-300 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            :class="
              getCandleDeltaColor(
                totals.value_[index][Object.keys(priceData)[0]][
                  'from_delta_min'
                ],
                Math.min(intervals.value_.length, 5)
              )
            "
            style="left: 176px"
          >
            <!-- {{ intervals.value_ }} -->
            {{
              totals.value_[index][Object.keys(priceData)[0]]["from_delta_min"]
            }}
          </td>
          <td
            class="border-b border-b-slate-300 border-r border-r-slate-300 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            :class="
              getCandleDeltaColor(
                totals.value_[index][Object.keys(priceData)[0]]['from_delta'],
                Math.min(intervals.value_.length, 5)
              )
            "
            style="left: 176px"
          >
            {{ totals.value_[index][Object.keys(priceData)[0]]["from_delta"] }}
          </td>
          <td
            class="border-b border-b-slate-300 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            :class="
              getCandleDeltaColor(
                totals.value_[index][Object.keys(priceData)[0]][
                  'from_delta_max'
                ],
                Math.min(intervals.value_.length, 5)
              )
            "
            style="left: 176px"
          >
            {{
              totals.value_[index][Object.keys(priceData)[0]]["from_delta_max"]
            }}
          </td>
          <td
            class="border-b border-slate-300 border-l border-l-slate-500 px-2 sticky max-w-12 min-w-12 text-slate-500 user-select-none z-10 bg-slate-100"
            style="left: 220px"
          >
            {{
              formatTime(
                totals.value_[index][Object.keys(priceData)[0]]["utc"],
                false
              )
            }}
          </td>

          <td
            class="text-slate-500 bg-white text-xxs px-2 sticky opacity-100 z-10 border-b border-b-slate-300 border-l border-l-slate-300 hover:bg-rose-500 hover:text-white cursor-pointer"
            style="left: 264px"
            @mousedown="
              handleMouseDown(
                $event,
                parseFloat(Object.keys(priceData)[0]).toFixed(2) * 1 -
                  parseFloat(options.spread) / 2 +
                  parseFloat(options.adj),
                true
              )
            "
          >
            {{
              formatPrice(
                parseFloat(Object.keys(priceData)[0]).toFixed(2) -
                  parseFloat(options.spread) / 2 +
                  parseFloat(options.adj)
              )
            }}
          </td>

          <td
            class="font-bold px-2 sticky opacity-100 z-10 border-b border-b-slate-300 border-l border-l-slate-300"
            style="left: 310px"
            :class="priceColor(Object.keys(priceData)[0])"
          >
            {{
              formatPrice(
                parseFloat(Object.keys(priceData)[0]) * 1 +
                  parseFloat(options.adj) * 1
              )
            }}
          </td>

          <td
            class="text-slate-500 bg-white text-xxs px-2 sticky opacity-100 z-10 border-b border-b-slate-300 border-l border-l-slate-300 hover:bg-rose-500 hover:text-white cursor-pointer"
            style="left: 264px"
            @mousedown="
              handleMouseDown(
                $event,
                parseFloat(Object.keys(priceData)[0]).toFixed(2) * 1 -
                  -parseFloat(options.spread) / 2 +
                  parseFloat(options.adj),
                false
              )
            "
          >
            {{
              formatPrice(
                parseFloat(Object.keys(priceData)[0]).toFixed(2) -
                  -parseFloat(options.spread) / 2 +
                  parseFloat(options.adj)
              )
            }}
          </td>
          <td
            class="border-b border-b-slate-300 border-l border-l-slate-500 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            style="left: 398px"
            :class="
              getCandleDeltaColor(
                getCandleDelta(priceData[Object.keys(priceData)[0]]),
                1
              )
            "
          >
            {{ getCandleDelta(priceData[Object.keys(priceData)[0]]) }}
          </td>
          <td
            class="border-b border-b-slate-300 border-l border-l-slate-300 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            style="left: 442px"
            :class="
              getCandleDeltaColor(
                getCandleDelta(priceData[Object.keys(priceData)[0]], 1),
                2
              )
            "
          >
            {{ getCandleDelta(priceData[Object.keys(priceData)[0]], 1) }}
          </td>
          <td
            class="border-b border-b-slate-300 border-r border-r-slate-500 border-l border-l-slate-300 px-2 sticky max-w-11 min-w-11 user-select-none z-10"
            style="left: 486px"
            :class="
              getCandleDeltaColor(
                getCandleDelta(priceData[Object.keys(priceData)[0]], 2)
              )
            "
          >
            {{ getCandleDelta(priceData[Object.keys(priceData)[0]], 2) }}
          </td>

          <td
            v-for="(item, vIndex) in priceData[Object.keys(priceData)[0]]"
            :key="vIndex"
            class="px-1 max-w-11 min-w-11 align-middle relative group cursor-pointer"
            :class="volumeColor(item)"
            @click="handleCellClick(item['utc'], $event)"
          >
            <div class="flex flex-row justify-between">
              <div class="flex flex-row justify-between w-full">
                <div class="">
                  {{ item["volume"] }}
                </div>
                <div class="flex flex-row">
                  <div
                    class="font-bold"
                    v-for="n in Array(timeDots(item['utc'])).fill()"
                    :key="n"
                  >
                    &#8226;
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="showTooltip.index === item['utc']"
              class="absolute bg-slate-800 text-white text-xxs rounded p-1 mt-2 w-28 opacity-90 z-40"
              :style="{ top: '-1.5rem', left: '0' }"
            >
              <div class="">Prev: &nbsp; {{ item["prev"] }}</div>
              <div class="">Change: &nbsp; {{ formatChg(item["chg"]) }}</div>
              <div class="">
                Time: &nbsp; &nbsp; &nbsp; {{ formatTime(item["utc"]) }}
              </div>
              <div class="">
                Vol:&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {{ item["volume"] }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import { reactive, onMounted } from "vue";
import {
  selectedMarket,
  options,
  totals,
  prices,
  ranges,
  // recentPrices,
  cumulativeDelta,
  intervals,
} from "../state_";
import { placeOrder } from "../execution";

export default {
  setup() {
    const showTooltip = reactive({ index: null });
    const highlightedRow = reactive({ value_: -1 });
    const handleTableClick = (event) => {
      // Close the tooltip if clicked outside
      if (showTooltip.index !== null) {
        showTooltip.index = null;
      }
    };
    const handleCellClick = (index, event) => {
      if (showTooltip.index === index) {
        showTooltip.index = null;
      } else {
        showTooltip.index = index;
      }
      // console.log(recentPrices.value_);
      event.stopPropagation();
    };

    const formatTime = (timestamp, ms = false) => {
      const date = new Date(parseFloat(timestamp));
      const hours = String(date.getUTCHours()); // 24-hour format, padded to 2 digits
      const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // Padded minutes
      const seconds = String(date.getUTCSeconds()).padStart(2, "0"); // Padded seconds
      const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0"); // Padded milliseconds
      return `${hours}:${minutes}:${seconds}${
        ms ? "   [" + milliseconds + "]" : ""
      }`;
    };
    const formatPrice = (price) => {
      let formattedNumber = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
      return formattedNumber;
    };
    const formatChg = (chg) => {
      return parseFloat(chg).toFixed(2);
    };

    const grads = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const totalTickColor = (ticks) => {
      const opacity =
        (ticks - ranges.minTicks) / (ranges.maxTicks - ranges.minTicks);
      const grad = Math.round(opacity * 10);
      return `bg-slate-${grads[grad]} ${grad > 4 ? "text-white" : ""}`;
    };
    const downTickColor = (downTicks) => {
      const opacity =
        (downTicks - ranges.minDownTicks) /
        (ranges.maxDownTicks - ranges.minDownTicks);
      const grad = Math.round(opacity * 10);
      // return `bg-red-400`;
      return `bg-rose-${grads[grad]} ${grad > 4 ? "text-white" : ""}`;
    };
    const upTickColor = (upTicks) => {
      const opacity =
        (upTicks - ranges.minUpTicks) / (ranges.maxUpTicks - ranges.minUpTicks);
      const grad = Math.round(opacity * 10);
      // return `bg-red-400`;
      return `bg-teal-${grads[grad]} ${grad > 4 ? "text-white" : ""}`;
    };
    const deltaTickColor = (deltaTick) => {
      if (deltaTick == 0) {
        return "bg-slate-50";
      }
      const color = deltaTick > 0 ? "teal" : "rose";
      const opacity = Math.abs(deltaTick) / ranges.maxTickDelta;
      const grad = Math.round(opacity * 10);
      return `bg-${color}-${grads[grad]} ${grad > 4 ? "text-white" : ""}`;
    };
    const totalVolumeColor = (volume) => {
      const opacity =
        (volume - ranges.minVolume) / (ranges.maxVolume - ranges.minVolume);
      const grad = Math.round(opacity * 10);
      return `bg-slate-${grads[grad]} ${grad > 4 ? "text-white" : ""}`;
    };
    const totalDownColor = (downVol) => {
      const opacity =
        (downVol - ranges.minDownVol) / (ranges.maxDownVol - ranges.minDownVol);
      const grad = Math.round(opacity * 10);
      // return `bg-red-400`;
      return `bg-rose-${grads[grad]} ${grad > 4 ? "text-white" : ""}`;
    };
    const totalUpColor = (upVol) => {
      const opacity =
        (upVol - ranges.minUpVol) / (ranges.maxUpVol - ranges.minUpVol);
      const grad = Math.round(opacity * 10);
      return `bg-teal-${grads[grad]} ${grad > 4 ? "text-white" : ""}`;
    };
    const deltaColor = (delta) => {
      if (delta == 0) {
        return "bg-slate-50";
      }
      const color = delta > 0 ? "teal" : "rose";
      const opacity = Math.abs(delta) / ranges.maxDelta;
      const grad = Math.round(opacity * 10);
      return `bg-${color}-${grads[grad]} ${grad > 4 ? "text-white" : ""}`;
    };
    const getDelta = (index, priceData) => {
      const obj = totals.value_[index][Object.keys(priceData)[0]];
      // const px = prices.value_.map((obj) => Object.keys(obj)[0]);
      // if (Object.keys(priceData)[0] == recentPrices.value_[0]) {
      //   console.log(px);
      // }
      return obj["volume_delta"];
    };
    const priceColor = (price) => {
      // return "bg-slate-200 text-black";
      // if (price == recentPrices.value_[0])
      //   return "bg-slate-900 text-white border  ";
      // if (price == recentPrices.value_[1]) return "bg-slate-600 text-white ";
      // if (price == recentPrices.value_[2]) return "bg-slate-400 text-white ";
      // if (price == recentPrices.value_[3]) return "bg-slate-300 text-black ";
      // if (price == recentPrices.value_[4]) return "bg-slate-200 text-black ";
      // if (price == recentPrices.value_[5])
      //   return "bg-slate-300 text-black ";
      // if (price == recentPrices.value_[6])
      //   return "bg-slate-200 text-black ";
      // if (price == recentPrices.value_[7])
      //   return "bg-slate-100 text-black ";
      return "bg-slate-50 text-black ";
    };
    const gradsReverse = [900, 700, 400];
    const volumeColor = (item) => {
      const opacity =
        item["volume"] >= options.maxVolume
          ? options.maxOpacity
          : options.minOpacity +
            (item["volume"] / options.maxVolume) *
              (options.maxOpacity - options.minOpacity);
      // Return the RGBA color
      const grad = Math.round(opacity * 10);
      let color;
      if (item["chg"] < 0) {
        color = "rose";
      }
      if (item["chg"] == 0) {
        color = "slate";
      }
      if (item["chg"] > 0) {
        color = "teal";
      }
      // console.log(item["utc"], intervals[0].value_["time"]);

      // let borderBase = "slate";
      // borderColor = bgGrad
      //   ? `border-${borderBase}-${bgGrad} border-${borderBase}-${bgGrad} border-${borderBase}-${bgGrad}`
      //   : "border-white";
      return `bg-${color}-${grads[grad]} ${grad > 3 ? " text-white" : ""}  ${
        grad > 8
          ? "text-bold border-2 border-" +
            color +
            `-500 border-b border-${color}-500`
          : `border-2 border-white`
      }`;
    };
    const handleMouseDown = (event, value_, dir) => {
      console.log("Cell value_:", value_);
      console.log(intervals.value_[0].value_["time"]);
      // console.log(totals.value_);
      placeOrder(value_, dir);
    };
    const objectToArray = (obj) => {
      return Object.keys(obj).map((key) => ({ key, value_: obj[key] }));
    };
    const timeDots = (utc) => {
      // let bgGrad, borderColor, cellTime;
      if (!intervals.value_.length) return 0;
      if (intervals.value_.length == 0) return 0;
      if (utc >= intervals.value_[0].value_["time"]) {
        return 3;
      }

      if (intervals.value_.length > 1) {
        {
          return utc >= intervals.value_[1].value_["time"] ? 2 : 0;
        }
      }
      if (intervals.value_.length > 2) {
        {
          return utc >= intervals.value_[2].value_["time"] ? 1 : 0;
        }
      }
      return 0;
    };
    const getCandleDelta = (data, slot = 0) => {
      // console.log(priceData[Object.keys(priceData)[0]]);
      if (!intervals.value_.length) return "";
      if (intervals.value_.length < slot + 1) return "";
      // console.log(intervals[slot]);
      let currentDelta = false;
      let currentSlot = intervals.value_[slot].value_["time"];
      let previousSlot = intervals.value_[Math.max(slot - 1, 0)].value_["time"];
      data.forEach((el) => {
        // console.log(el)
        if (
          el["utc"] >= currentSlot &&
          (slot > 0 ? el["utc"] < previousSlot : true)
        ) {
          // console.log(el["volume"]);
          currentDelta +=
            el["chg"] > 0 ? el["volume"] : el["chg"] < 0 ? -el["volume"] : 0;
          // } else if (el["utc"] >= previousSlot) {
          //   previousDelta += el["chg"] > 0 ? el["volume"] : -el["volume"];
        } else {
          return;
        }
      });
      return currentDelta ? currentDelta : "";
    };
    const getCandleDeltaColor = (val, candles = 1) => {
      if (!val) return "bg-white";
      let absVal = Math.abs(val);
      let maxV = options.candleVolume * candles;
      // maxV = 5000;
      const opacity =
        absVal >= maxV
          ? options.maxOpacity
          : options.minOpacity +
            (absVal / maxV) * (options.maxOpacity - options.minOpacity);
      // Return the RGBA color
      const grad = Math.round(opacity * 10);
      let color;
      if (val < 0) {
        color = "rose";
      }
      if (val >= 0) {
        color = "teal";
      }
      // return "bg-teal-500";
      return `bg-${color}-${grads[grad]} ${grad > 3 ? " text-white" : ""} `;
    };
    const highlightRow = (index) => {
      highlightRow.value_ = index;
    };
    return {
      totals,
      prices,
      handleTableClick,
      handleCellClick,
      showTooltip,
      formatTime,
      formatPrice,
      formatChg,
      totalTickColor,
      downTickColor,
      upTickColor,
      deltaTickColor,
      totalVolumeColor,
      totalDownColor,
      totalUpColor,
      getDelta,
      deltaColor,
      priceColor,
      volumeColor,
      options,
      timeDots,
      handleMouseDown,
      getCandleDelta,
      getCandleDeltaColor,
      highlightRow,
      intervals,
    };
  },
};
</script>

<style>
/* Optional: Add some styles for better visuals */
.sticky.left-0 {
  left: 0;
}
.sticky.top-0 {
  top: 0;
}

.text-xxs {
  font-size: xx-small;
}

/* Position the second column (adjust according to the width of the first column) */
</style>