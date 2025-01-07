<template>
  <div class="bg-slate-10 relative">
    <div class="flex flex-col h-screen w-screen">
      <div class="bg-slate-800 shadow flex flex-row justify-between">
        <!-- <div class="bg-slate-800 text-white p-4">{{ formatTime(utc.utc) }}</div> -->
        <!-- <div class="bg-slate-800 text-white p-4">
          {{ intervals.length > 0 ? formatTime(intervals[0]) : "preopen" }}
        </div> -->
        <div class="bg-slate-800 p-4">
          <div class="flex flex-row">
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="text-white mr-2">Size:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 mr-6 text-xs"
                v-model="options.size"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="text-white mr-2">SL:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 mr-6 text-xs"
                v-model="options.stop"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="text-white mr-2">TP:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 mr-6 text-xs"
                v-model="options.limit"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="text-white mr-2">Spread:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 mr-6 text-xs"
                v-model="options.spread"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="text-white mr-2">Adj:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 mr-6 text-xs"
                v-model="options.adj"
              />
            </div>
          </div>
        </div>

        <div class="bg-slate-800 p-4 flex text-xs">
          <select @change="changeMarket">
            <option v-for="mkt in ['DAX', 'NQ', 'ES']" :value="mkt" :key="mkt">
              {{ mkt }}
            </option>
          </select>
          <div
            class="rounded px-2 py-1 text-xs text-center w-24 bg-slate-300 ml-4 cursor-pointer uppercase font-bold hover:text-white hover:bg-slate-700"
            @click="load"
          >
            load
          </div>
        </div>
        <div class="bg-slate-800 p-4">
          <div class="flex flex-row">
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="text-white mr-2">Max Volume:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 mr-6 text-xs"
                v-model="options.maxVolume"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="text-white mr-2">Max cell:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 mr-6 text-xs"
                v-model="options.maxCell"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="text-white mr-2">Max total:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 mr-6 text-xs"
                v-model="options.maxTotal"
              />
            </div>
          </div>
        </div>
      </div>
      <LadderContainer />
      <div
        class="fixed left-0 w-72 top-14 bottom-0 overflow-y-scroll bg-slate-800"
      >
        <TimePriceVol />
      </div>
      <CellDetail
        v-if="selectedCell.selectedCell"
        :selectedCell="selectedCell.selectedCell"
        :from="selectedCell.from"
      />
      <!-- <orderflow /> -->
    </div>
  </div>
</template>

<script>
import {
  loadData,
  utc,
  selectedMarket,
  options,
  initOptions,
  intervals,
  selectedCell,
} from "./state";
import { onMounted } from "vue";
import Orderflow from "./components/Orderflow.vue";
import LadderContainer from "./components/LadderContainer.vue";
import TimePriceVol from "./components/TimePriceVol.vue";
import CellDetail from "./components/CellDetail.vue";
export default {
  components: { Orderflow, LadderContainer, TimePriceVol, CellDetail },
  setup() {
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
    const changeMarket = (event) => {
      console.log(event.target.value);
      selectedMarket.selectedMarket = event.target.value;
    };
    const load = () => {
      // initOptions();
      // loadData();
    };
    onMounted(() => {
      // console.log("mounted app");
      initOptions();
    });
    return {
      utc,
      Orderflow,
      TimePriceVol,
      CellDetail,
      formatTime,
      selectedMarket,
      changeMarket,
      load,
      options,
      intervals,
      selectedCell,
    };
  },
};
</script>

<style>
.text-xxs {
  font-size: xx-small;
}
</style>