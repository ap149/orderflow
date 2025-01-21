<template>
  <div class="flex flex-row text-xxs">
    <div
      v-for="(item, index) in rowItem['from'].slice(-18)"
      :key="index"
      class="w-10 flex-shrink-0 px-1 pt- mb- mr- cursor-pointer flex items-center justify-between"
      :class="getDeltaColor(item)"
      @click="clickCell(item)"
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
      class="w-96 border-t border-t-slate-300 border-l border-l-slate-500 border-r border-r-slate-500 flex flex-row ml- mr-"
    >
      <div
        class="text-center w-24 cursor-pointer ml- border-r border-r-white"
        :class="
          getTotalVolumeColor(
            rowItem['from'][rowItem['from'].length - 1]['total_volume']
          )
        "
      >
        {{ rowItem["from"][rowItem["from"].length - 1]["total_volume"] }}
      </div>
      <div
        class="text-center w-24 leading-relaxed cursor-pointer font-bold"
        :class="getTotalDeltaColor(rowItem['from'].slice(-1)[0]['delta'])"
      >
        {{ rowItem["from"].slice(-1)[0]["delta"] }}
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
        class="px-2 font-bold text-center leading-relaxed cursor-pointer w-24"
        :class="rowItem['filled'] == 2 ? 'bg-slate-700 text-white' : ''"
      >
        {{ (parseFloat(px) + parseFloat(options.adj)).toFixed(2) }}
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
        class="text-center w-24 leading-relaxed cursor-pointer font-bold"
        :class="getTotalDeltaColor(rowItem['to'][0]['delta'])"
      >
        {{ rowItem["to"][0]["delta"] }}
      </div>
      <div
        class="text-center w-24 cursor-pointer  border-l border-lwhite ml-"
        :class="getTotalVolumeColor(rowItem['to'][0]['total_volume'])"
      >
        {{ rowItem["to"][0]["total_volume"] }}
      </div>
    </div>

    <div
      v-for="(item, index) in rowItem['to'].slice(0, 18)"
      :key="index"
      class="w-10 flex-shrink-0 px-1 pt- mb- mr- cursor-pointer flex items-center justify-between"
      :class="getDeltaColor(item)"
      @click="clickCell(item, false)"
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
</template>

<script>
import {
  loadData,
  prices,
  ladder,
  options,
  intervals,
  selectedCell,
  changeSelectedCell,
} from "../stateOrderflow";
import { placeOrder } from "../execution";
import { reactive, ref } from "vue";
export default {
  props: {
    // Props definition is here
    rowItem: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const grads = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 900];
    const maxOpacity = 1.0;
    const minOpacity = 0;
    const px = ref(props.rowItem["to"][0]["price"]);

    // const priceColor = (price) => {
    //   // return "bg-slate-200 text-black";
    //   if (price == value_[0]) return "bg-slate-900 text-white   ";
    //   if (price == value_[1]) return "bg-slate-600 text-white ";
    //   if (price == value_[2]) return "bg-slate-400 text-white ";
    //   if (price == value_[3]) return "bg-slate-300 text-black ";
    //   if (price == value_[4]) return "bg-slate-200 text-black ";
    //   // if (price == value_[5])
    //   //   return "bg-slate-300 text-black ";
    //   // if (price == value_[6])
    //   //   return "bg-slate-200 text-black ";
    //   // if (price == value_[7])
    //   //   return "bg-slate-100 text-black ";
    //   return "bg-slate-50 text-black ";
    // };
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
      const background = `bg-${color}-${grads[grad]}`;
      return `${background} ${grad > 3 ? " text-white" : ""} border ${border}`;
    };
    const clickCell = (item, from = true) => {
      console.log(item);
      changeSelectedCell(item, from);
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
      // priceColor,
      getTotalVolumeColor,
      getDeltaColor,
      getTotalDeltaColor,
      timeDots,
      options,
      px,
      handleMouseDown,
      clickCell,
    };
  },
};
</script>

<style>
</style>