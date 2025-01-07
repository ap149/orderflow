<template>
  <div class="grow overflow-y-auto overflow-x-auto text-xxs pb-8 w-full">
    <div v-for="px in prices" :key="px">
      <div class="flex flex-row text-xxs">
        <div
          v-for="(item, index) in ladder[px]['from'].slice(-20)"
          :key="index"
          class="w-10 flex-shrink-0 px-1 pt- mb- mr- cursor-pointer flex items-center justify-between"
          :class="getDeltaColor(item)"
          @click="console.log(item)"
        >
          <div class="flex flex-row">
            <div
              class="font-bold"
              v-for="n in Array(timeDots(item['utc'])).fill()"
              :key="n"
            >
              &#8226;
            </div>
          </div>
          <div class=""></div>
          <div class="">
            {{
              Object.keys(item).length === 0
                ? ""
                : item["chg"] == 0
                ? `=${item["volume"]}`
                : item["chg"] > 0
                ? item["volume"]
                : -item["volume"]
            }}
          </div>
        </div>
        <div
          class="w-72 border-t border-t-slate-300 border-l border-l-slate-500 border-r border-r-slate-500 flex flex-row ml-2 mr-2"
        >
          <div
            class="text-center w-28 leading-relaxed cursor-pointer border-r border-r-slate-500 font-bold"
            :class="
              getTotalDeltaColor(ladder[px]['from'].slice(-1)[0]['delta'])
            "
          >
            {{ ladder[px]["from"].slice(-1)[0]["delta"] }}
          </div>
          <div
            class="px-1 text-slate-500 text-center leading-relaxed cursor-pointer hover:bg-rose-400 hover:text-white w-24"
            @mousedown="
              handleMouseDown(
                $event,
                (
                  parseFloat(px) +
                  parseFloat(options.adj) -
                  parseFloat(options.spread) / 2
                ).toFixed(2),
                true
              )
            "
          >
            {{
              (
                parseFloat(px) +
                parseFloat(options.adj) -
                parseFloat(options.spread) / 2
              ).toFixed(2)
            }}
          </div>
          <div
            class="text-center w-24 cursor-pointer border-r border-r-slate-500"
            :class="getTotalVolumeColor(ladder[px]['to'][0]['total_volume'])"
          >
            {{ ladder[px]["to"][0]["total_volume"] }}
          </div>
          <div
            class="px-1 font-bold text-center leading-relaxed cursor-pointer w-24"
            :class="priceColor(px)"
          >
            {{ (parseFloat(px) + parseFloat(options.adj)).toFixed(2) }}
          </div>
          <div
            class="text-center w-24 leading-relaxed cursor-pointer border-l border-l-slate-500"
            :class="
              getTotalDeltaColor(
                ladder[px]['from'].slice(-1)[0]['delta'] +
                  ladder[px]['to'][0]['delta']
              )
            "
          >
            {{
              ladder[px]["from"].slice(-1)[0]["delta"] +
              ladder[px]["to"][0]["delta"]
            }}
          </div>
          <div
            class="px-1 text-slate-500 text-center leading-relaxed cursor-pointer hover:bg-teal-400 hover:text-white w-24"
            @mousedown="
              handleMouseDown(
                $event,
                (
                  parseFloat(px) +
                  parseFloat(options.adj) +
                  parseFloat(options.spread) / 2
                ).toFixed(2),
                false
              )
            "
          >
            {{
              (
                parseFloat(px) +
                parseFloat(options.adj) +
                parseFloat(options.spread) / 2
              ).toFixed(2)
            }}
          </div>
          <div
            class="text-center w-28 leading-relaxed cursor-pointer font-bold"
            :class="getTotalDeltaColor(ladder[px]['to'][0]['delta'])"
          >
            {{ ladder[px]["to"][0]["delta"] }}
          </div>
        </div>
        <div
          v-for="(item, index) in ladder[px]['to'].slice(0, 20)"
          :key="index"
          class="w-10 flex-shrink-0 px-1 pt- mb- mr- cursor-pointer flex items-center justify-between"
          :class="getDeltaColor(item)"
          @click="console.log(item)"
        >
          <div class="">
            {{
              Object.keys(item).length === 0
                ? ""
                : item["chg"] == 0
                ? `=${item["volume"]}`
                : item["chg"] > 0
                ? item["volume"]
                : -item["volume"]
            }}
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
    </div>
    <!-- <div class="flex flex-row">
      <div class="bg-teal-200">lhs</div>
      <div class="bg-slate-200">px</div>
      <div class="bg-rose-200">rhs</div>
    </div> -->
  </div>
</template>

<script>
import {
  loadData,
  prices,
  ladder,
  // recentPrices,
  options,
  intervals,
} from "../state";
import { placeOrder } from "../execution";
import { reactive } from "vue";
export default {
  setup() {
    const showTooltip = reactive({ index: null });
    const grads = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 900];
    const maxOpacity = 1.0;
    const minOpacity = 0;
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
    const priceColor = (price) => {
      // return "bg-slate-200 text-black";
      // if (price == recentPrices.value_[0]) return "bg-slate-900 text-white   ";
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
    const handleMouseDown = (event, px, dir) => {
      console.log("Cell value_:", px);
      // console.log(intervals.value_[0].value_["time"]);
      // console.log(totals.value_);
      // console.log("handlee: ", px, dir);
      placeOrder(px, dir);
    };
    const getTotalVolumeColor = (vol) => {
      const opacity =
        vol >= options.maxVolume
          ? maxOpacity
          : minOpacity + (vol / options.maxVolume) * (maxOpacity - minOpacity);
      // Return the RGBA color
      const grad = Math.round(opacity * 10);
      let color = "cyan";
      const background = `bg-${color}-${grads[grad]}`;
      return `${background} ${grad > 3 ? " text-white" : ""}`;
    };
    const getTotalDeltaColor = (delta) => {
      const absDelta = Math.abs(delta);
      const opacity =
        absDelta >= options.maxTotal
          ? maxOpacity
          : minOpacity +
            (absDelta / options.maxTotal) * (maxOpacity - minOpacity);
      // Return the RGBA color
      const grad = Math.round(opacity * 10);
      let color;
      if (delta < 0) {
        color = "rose";
      }
      if (delta == 0) {
        color = "slate";
      }
      if (delta > 0) {
        color = "teal";
      }
      const background = `bg-${color}-${grads[grad]}`;
      return `${background} ${grad > 3 ? " text-white" : ""}`;
    };
    const getDeltaColor = (item) => {
      let delta =
        item["chg"] == 0
          ? 0
          : item["chg"] > 0
          ? item["volume"]
          : -item["volume"];
      const delta_abs = Math.abs(delta);
      const opacity =
        delta_abs >= options.maxCell
          ? maxOpacity
          : minOpacity +
            (delta_abs / options.maxCell) * (maxOpacity - minOpacity);
      // Return the RGBA color
      const grad = Math.round(opacity * 10);
      let color;
      if (delta < 0) {
        color = "rose";
      }
      if (delta == 0) {
        color = "slate";
      }
      if (delta > 0) {
        color = "teal";
      }
      const volume = Math.abs(item["volume"]);
      const opacityBorder =
        volume >= options.maxCell
          ? maxOpacity
          : minOpacity + (volume / options.maxCell) * (maxOpacity - minOpacity);
      // Return the RGBA color
      const gradBorder = Math.round(opacityBorder * 10);
      let colorBorder;
      let border;
      if (gradBorder < 10 || Object.keys(item).length == 0) {
        border = "border-l border-l-white border-r border-r-white";
      } else {
        if (item["chg"] > 0) {
          colorBorder = "teal";
        } else if (item["chg"] < 0) {
          colorBorder = "rose";
        } else {
          colorBorder = "slate";
        }
        border = `border-2 border-${colorBorder}-${grads[gradBorder]}`;
      }
      //   colorBorder = "rose";
      // }
      // if (item["chg"] == 0) {
      //   colorBorder = "slate";
      // }
      // if (item["chg"] > 0) {
      //   colorBorder = "teal";
      // }
      const background = `bg-${color}-${grads[grad]}`;
      // if (!item["volume"]) {
      //   border = "border border-white";
      // } else {
      //   border = `border-${colorBorder}-${grads[gradBorder]}`;
      // }

      return `${background} ${grad > 3 ? " text-white" : ""} border ${border}`;
      //   grad > 8
      //     ? "text-bold border-2 border-" +
      //       color +
      //       `-500 border-b border-${color}-500`
      //     : `border-2 border-white`
      // }`;
    };
    const timeDots = (utc) => {
      if (utc > intervals[0]) return 3;
      if (intervals.length > 0) {
        if (utc > intervals[1]) return 2;
      }
      if (intervals.length > 1) {
        if (utc > intervals[2]) return 1;
      }
      return 0;
    };
    return {
      formatTime,
      prices,
      ladder,
      getDeltaColor,
      priceColor,
      getTotalDeltaColor,
      getTotalVolumeColor,
      options,
      handleMouseDown,
      timeDots,
    };
  },
};
</script>

<style>
.text-xxs {
  font-size: xx-small;
}
</style>