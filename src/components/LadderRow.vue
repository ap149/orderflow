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
      class="border-l border-l-slate-500 border-r border-r-slate-500 flex flex-row ml- mr- items-center"
    >
      <div
        class="text-center w-32 cursor-pointer ml- border-r border-r-white"
      >
        <ProgressBar :value="rowItem['from'].slice(-1)[0]['total_volume']" :minRange="0" :maxRange="options.maxVolume" :neutral="true" />
      </div>
      <div
        class="text-center w-32 cursor-pointer ml- border-r border-r-white"
      >
        <ProgressBar :value="rowItem['from'].slice(-1)[0]['delta']" :minRange="-options.maxTotal" :maxRange="options.maxTotal" />
      </div>
      <div
        class="px-1 text-slate-500 text-center leading-relaxed cursor-pointer hover:bg-rose-400 hover:text-white w-16"
        :class="getVWAPClass(px)"
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
        class="px-2 font-bold text-center leading-relaxed cursor-pointer w-16"
        :class="rowItem['filled'] == 2 ? 'bg-slate-700 text-white' : ''"
      >
        {{ (parseFloat(px) + parseFloat(options.adj)).toFixed(2) }}
      </div>
      <div
        class="px-1 text-slate-500 text-center leading-relaxed cursor-pointer hover:bg-teal-400 hover:text-white w-16"
        :class="getVWAPClass(px, false)"
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
        class="text-center w-32 cursor-pointer ml- border-r border-r-white"
      >
        <ProgressBar :value="rowItem['to'][0]['delta']" :minRange="-options.maxTotal" :maxRange="options.maxTotal" />
      </div>
      <div
        class="text-center w-32 cursor-pointer ml- border-r border-r-white"
      >
        <ProgressBar :value="rowItem['to'][0]['total_volume']" :minRange="0" :maxRange="options.maxVolume"  :reverse="true" :neutral="true"/>
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
  fromVWAP,
  toVWAP
} from "../stateOrderflow";
import { placeOrder } from "../execution";
import { reactive, ref } from "vue";
import ProgressBar from "./ProgressBar.vue";
export default {
  components: {ProgressBar},
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

    const getVWAPClass = (px, from=true) => {
      const step = options.step
      const vwap = from ? Math.round(fromVWAP.value/options.step)*options.step : Math.round(toVWAP.value/options.step)*options.step
      const adjPx = (parseFloat(px) + parseFloat(options.adj))
      const classStr0 = 'bg-amber-400 text-white font-bold'
      const classStr1 = 'bg-amber-300 text-white font-bold'
      const classStr2 = 'bg-amber-200  font-bold'
      if (vwap == adjPx) {
        console.log("exact vwap")
        return classStr0
      }
      if (vwap <= adjPx + step && vwap >= adjPx - step) {
        console.log("1step vwap")
        return classStr1
      }
      if (vwap <= adjPx + step*2 && vwap >= adjPx - step*2) {
        console.log("2step vwap")
        return classStr2
      }
      return ''
    }

    const handleMouseDown = (event, px, dir) => {
      console.log("Cell value_:", px);
      console.log("rounded: ", Math.round(fromVWAP.value/options.step)*options.step);
      const step = options.step
      const vwap = Math.round(fromVWAP.value/options.step)*options.step - options.spread/2
      const adjPx = (parseFloat(px) + parseFloat(options.adj))
      const classStr = 'bg-amber-400 text-white'
      console.log(step)
      console.log(vwap)
      console.log(adjPx)
      console.log(adjPx == vwap)
      // if (vwap == adjPx) classStr
      // if (vwap <= adjPx + step || vwap >= adjPx - step) classStr
      // if (vwap <= adjPx + step*2 || vwap >= adjPx - step*2) classStr
      // return ''      
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
        border = `border-1 border-${colorBorder}-${grads[gradBorder]}`;
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
      ProgressBar,
      fromVWAP,
      toVWAP,
      getVWAPClass
    };
  },
};
</script>

<style>
</style>