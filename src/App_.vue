<template>
  <div class="bg-slate-10">
    <div class="flex flex-col h-screen w-screen">
      <div class="bg-slate-800 shadow flex flex-row">
        <div class="flex flex-col justify-between">
          <div class="flex flex-row items-end cursor-pointer">
            <div
              @click="changeMarket('DAX')"
              class="font-bold py-2 px-4 min-w-24 max-w-24 border-b-4 flex flex-row justify-center"
              :class="getClasses('DAX')"
            >
              <div class="">DAX</div>
            </div>
            <div
              @click="changeMarket('ES')"
              class="font-bold py-2 px-4 min-w-24 max-w-24 border-b-4 flex flex-row justify-center"
              :class="getClasses('ES')"
            >
              <div class="">ES</div>
            </div>
            <div
              @click="changeMarket('NQ')"
              class="font-bold py-2 px-4 min-w-24 max-w-24 border-b-4 flex flex-row justify-center"
              :class="getClasses('NQ')"
            >
              <div class="">NQ</div>
            </div>
          </div>
          <div class="text-xxs p-4">
            <div class="flex flex-row">
              <div class="mr-12">
                <div class="flex flex-row mb-2 justify-between">
                  <div class="text-white mr-4">Cookie:</div>
                  <input
                    type="text"
                    class="px-2 min-w-12 max-w-12"
                    v-model="options.cookie"
                  />
                </div>
                <div class="flex flex-row mb-2 justify-between">
                  <div class="text-white mr-4">Max Vol:</div>
                  <input
                    type="text"
                    class="px-2 min-w-12 max-w-12"
                    v-model="options.maxVolume"
                    @change="handleChangeMaxVolume"
                  />
                </div>
                <div class="flex flex-row mb-2 justify-between">
                  <div class="text-white mr-4">Candle Vol:</div>
                  <input
                    type="text"
                    class="px-2 min-w-12 max-w-12"
                    v-model="options.candleVolumeVolume"
                  />
                </div>
                <div class="flex flex-row mb-2 justify-between">
                  <div class="text-white mr-4">Spread:</div>
                  <input
                    type="text"
                    class="px-2 min-w-12 max-w-12"
                    v-model="options.spread"
                  />
                </div>
              </div>
              <div class="">
                <div class="flex flex-row justify-between mb-2">
                  <div class="text-white mr-4">Size:</div>
                  <input
                    type="text"
                    class="px-2 min-w-12 max-w-12"
                    v-model="options.size"
                  />
                </div>
                <div class="flex flex-row justify-between mb-2">
                  <div class="text-white mr-4">Stop:</div>
                  <input
                    type="text"
                    class="px-2 min-w-12 max-w-12"
                    v-model="options.stop"
                  />
                </div>
                <div class="flex flex-row justify-between mb-2">
                  <div class="text-white mr-4">Limit:</div>
                  <input
                    type="text"
                    class="px-2 min-w-12 max-w-12"
                    v-model="options.limit"
                  />
                </div>
                <div class="flex flex-row justify-between">
                  <div class="text-white mr-4">Adj:</div>
                  <input
                    type="text"
                    class="px-2 min-w-12 max-w-12"
                    v-model="options.adj"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="grow text-black flex flex-row px-8 text-xxs text-center pt-8 select-none bg-slate-50 overflow-x-auto"
        >
          <div class="ml-2 mr-8">
            <div class="text-slate-400 text-xxs font-bold mb-2 p-1">
              SESSION
            </div>
            <div
              class="my-1 px-1"
              :class="getColor(cumulativeDelta.value_.session, 'max')"
            >
              {{ cumulativeDelta.value_.session.max }}
            </div>
            <div
              class="my-1 px-1"
              :class="getColor(cumulativeDelta.value_.session, 'total')"
            >
              {{ cumulativeDelta.value_.session.total }}
            </div>
            <div
              class="my-1 px-1"
              :class="getColor(cumulativeDelta.value_.session, 'min')"
            >
              {{ cumulativeDelta.value_.session.min }}
            </div>
            <div class="my-1 px-1">
              {{ cumulativeDelta.value_.session.vol }}
            </div>
          </div>
          <div
            class="ml-4"
            v-for="item in objectToArray(
              cumulativeDelta.value_.intervals
            ).reverse()"
            :key="item.key"
          >
            <div
              class="text-slate-600 text-xxs mb-2 p-1 font-bold"
              :class="getTimeBG(item.value_['time'])"
            >
              {{ formatTime(item.value_["time"], false) }}
            </div>
            <div class="my-1 px-1" :class="getColor(item.value_, 'max')">
              {{ item.value_["max"] }}
            </div>
            <div class="my-1 px-1" :class="getColor(item.value_, 'total')">
              {{ item.value_["total"] }}
            </div>
            <div class="my-1 px-1" :class="getColor(item.value_, 'min')">
              {{ item.value_["min"] }}
            </div>
            <!-- <div class="my-1 px-1">
              {{
                (
                  (item.value_["vol"] / cumulativeDelta.value_.session.vol) *
                  100
                ).toFixed(2) + "%"
              }}
            </div> -->
            <div class="my-1 px-1">
              {{ item.value_["vol"] }}
            </div>
          </div>
        </div>

        <!-- <div class="text-white">{{ cumulativeDelta.intervals }}</div> -->
      </div>
      <orderflow />
      <!-- <div
        v-else
        class="w-full h-full flex flex-row justify-center items-center"
      >
        <div class="text-sm uppercase font-bold text-slate-400">Loading...</div>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  selectedMarket,
  changeMarket,
  loadData,
  options,
  cumulativeDelta,
} from "./state_";
import Orderflow from "./components/Orderflow_.vue";
import { onMounted, reactive } from "vue";
// import Orderflow from "./components/Orderflow.vue";

export default {
  components: { Orderflow },
  //   components: {
  //     // RealtimeData,
  //     Orderflow,
  //   },
  setup() {
    // const intervals = reactive({value_:[]})
    const getClasses = (mkt) => {
      if (mkt == selectedMarket.value_) {
        return "text-white border-white";
      } else {
        return "text-slate-400  hover:border-slate-300 hover:text-slate-300 border-slate-900";
      }
    };
    const formatTime = (timestamp, ms = false) => {
      const date = new Date(parseFloat(timestamp));
      const hours = String(date.getUTCHours()); // 24-hour format, padded to 2 digits
      const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // Padded minutes
      const seconds = String(date.getUTCSeconds()).padStart(2, "0"); // Padded seconds
      const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0"); // Padded milliseconds
      return `${hours}:${minutes}`;
    };
    const objectToArray = (obj) => {
      return Object.keys(obj).map((key) => ({ key, value_: obj[key] }));
    };
    onMounted(() => {
      console.log("mounted");

      loadData();
    });
    const grads = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 900];
    const getColor = (item, val) => {
      const max_abs = Math.max(Math.abs(item["min"]), item["max"]);
      // console.log(max_abs, item["min"], item["max"]);
      const opacity = Math.abs(item[val] / max_abs);
      const grad = Math.round(opacity * 10);
      let color;
      if (val == "max") color = "teal";
      if (val == "min") color = "rose";
      if (val == "total") color = item["total"] > 0 ? "teal" : "rose";
      return `bg-${color}-${grads[grad]} ${grad > 4 ? "text-white" : ""}`;
    };
    const gradsReverse = [900, 700, 500, 300, 200];
    const getTimeBG = (time) => {
      return "";
    };

    return {
      selectedMarket,
      changeMarket,
      options,
      getClasses,
      Orderflow,
      cumulativeDelta,
      formatTime,
      objectToArray,
      getColor,
      getTimeBG,
    };
  },
};
//
</script>


<style scoped>
.text-xxs {
  font-size: xx-small;
}

/* Position the second column (adjust according to the width of the first column) */
</style>