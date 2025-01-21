<template>
  <div class="bg-slate-200 relative ">
    <div class="flex h-screen w-screen z-10">
      <div class="bg-slate-200 flex flex-col  absolute right-0 top-12 w-80 bottom-0 pr-10 py-6">
        <div class="bg-slate-80 py- flex text-xs justify-between">
          <div @click="handleChangeMarket('DAX')" class="text-white rounded p-1 font-bold w-14 text-center cursor-pointer" :class="selectedMarket.selectedMarket == 'DAX' ? 'bg-teal-500 font-bold text-center' : 'bg-slate-300 text-slate-400 hover:bg-teal-500 hover:text-white'">DAX</div>
          <div @click="handleChangeMarket('ES')" class="text-white rounded p-1 font-bold w-14 text-center cursor-pointer" :class="selectedMarket.selectedMarket == 'ES' ? 'bg-teal-500 font-bold text-center' : 'bg-slate-300 text-slate-400 hover:bg-teal-500 hover:text-white'">ES</div>
          <div @click="handleChangeMarket('NQ')" class="text-white rounded p-1 font-bold w-14 text-center cursor-pointer" :class="selectedMarket.selectedMarket == 'NQ' ? 'bg-teal-500 font-bold text-center' : 'bg-slate-300 text-slate-400 hover:bg-teal-500 hover:text-white'">NQ</div>
          <!-- <div @click="handleChangeMarket('NAS')" class="text-white rounded p-1 font-bold w-16 text-center cursor-pointer" :class="selectedMarket.selectedMarket == 'NAS' ? 'bg-teal-500 font-bold text-center' : 'bg-slate-300 text-slate-400 hover:bg-teal-500 hover:text-white'">ES</div> -->
        </div>
        <div class="bg-slate-80 mt-8">
          <div class="uppercase text-xs font-bold mb-4 text-slate-500">Trading params</div>
          <div class="flex flex-col">
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="mr-2">Size:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 text-xs"
                v-model="options.size"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="mr-2">SL:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 text-xs"
                v-model="options.stop"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="mr-2">TP:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 text-xs"
                v-model="options.limit"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="mr-2">Spread:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 text-xs"
                v-model="options.spread"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="mr-2">Adj:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12 text-xs"
                v-model="options.adj"
              />
            </div>
          </div>
        </div>


        <div class="bg-slate-80 w-">
          <div class="uppercase text-xs font-bold mt-8 mb-4 text-slate-500">Display params</div>          
          <div class="flex flex-col">
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="mr-2">Max Cell:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12  text-xs"
                v-model="options.maxCell"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="mr-2">Max Volume:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12  text-xs"
                v-model="options.maxVolume"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="mr-2">Max Delta:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12  text-xs"
                v-model="options.maxTotal"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="mr-2">Max Cum. Delta:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12  text-xs"
                v-model="options.maxCumDelta"
              />
            </div>
            <div class="flex flex-row mb-2 justify-between text-xs">
              <div class="mr-2">Max Cum. Delta Net:</div>
              <input
                type="text"
                class="px-2 min-w-12 max-w-12  text-xs"
                v-model="options.maxCumDeltaNet"
              />
            </div>
          </div>
        </div>
      </div>
      <LadderContainer />
      <div
        class="fixed left-0 w-80 top-12 bottom-0 flex flex-col"
      >
        <TimePriceVol class="bg-white"/>
        <div class="overflow-y-scroll h-96 bg-white" ref="scrollContainer" >
          <div class="sticky top-0 bg-slate-200 text-xxs py-1 pl-1 font-bold uppercase border-t border-t-slate-300 z-50 shadow-lg">Comments</div>
          <Comments class="z-10 " @scroll-to-bottom="scrollToBottom"/>
        </div>
        <EnterComment/>
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
  changeMarket,
  options,
  initOptions,
  intervals,
  selectedCell,
} from "../stateOrderflow";
import { nextTick, onMounted,ref } from "vue";
import LadderContainer from "./LadderContainer.vue";
import TimePriceVol from "./TimePriceVol.vue";
import CellDetail from "./CellDetail.vue";
import Comments from "./Comments.vue";
import EnterComment from "./EnterComment.vue";
export default {
  components: { LadderContainer, TimePriceVol, CellDetail, Comments,EnterComment },
  setup() {
    const scrollContainer = ref(null);
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
    const handleChangeMarket = (instrument) => {
      changeMarket(instrument);
    };
    const load = () => {
      // initOptions();
      // loadData();
    };
    const scrollToBottom = async () => {
      console.log("scrolling to bottom")
      console.log(scrollContainer.value)
      if (scrollContainer.value) {
        await nextTick()
        console.log("scrolling to bottom - container")
        console.log("Container dimensions:");
        console.log("scrollHeight:", scrollContainer.value.scrollHeight); // Total content height
        console.log("offsetHeight:", scrollContainer.value.offsetHeight); // Visible height
        console.log("scrollTop:", scrollContainer.value.scrollTop); // Curren        
        console.log(scrollContainer.value.scrollHeight, scrollContainer.value.scrollTop )
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight// - scrollContainer.value.offsetHeight + 100;
        console.log(scrollContainer.value.scrollHeight, scrollContainer.value.scrollTop )
      }
    };    
    onMounted(() => {
      // console.log("mounted app");
      initOptions();

    });
    return {
      utc,
      TimePriceVol,
      CellDetail,
      formatTime,
      selectedMarket,
      handleChangeMarket,
      load,
      options,
      intervals,
      selectedCell,
      EnterComment,
      Comments,
      scrollContainer,
      scrollToBottom
    };
  },
};
</script>

<style>
.text-xxs {
  font-size: xx-small;
}
</style>