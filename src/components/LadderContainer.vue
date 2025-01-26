 

                    <!-- <div class="">
                      <div v-for="(item, index) in ladder" :key="index" class="w-20">
                        <div v-if="item['filled']" class="h-4">
                          <ProgressBar :value="50" :maxRange="100" :minRange="-50"/>
                        </div>
                      </div>        
                    </div>                     -->
<template>
  <div
    class="grow overflow-y-auto overflow-x-auto text-xxs pb-8 fixed top-12 left-[18rem] right-[18rem] bottom-0 l-2 bg-white"
  >
      <div class=" z-50 flex justify-center">
 <!-- <div class="absolute sticky top-0 w-full h-8 flex justify-center z-50 left-0 right-0">
    <div class="flex w-full">
      <ProgressBar class="flex-1" :value="delta.from.current" :maxRange="delta.from.max" :minRange="delta.from.min" size="large"/>
      <ProgressBar class="flex-1" :value="delta.to.current" :maxRange="delta.to.max" :minRange="delta.to.min" size="large"/>
      </div>
      </div> -->
  <!-- <div class="flex border-r border-r-slate-500 border-l border-l-slate-500">
    <div class="" v-if="Object.keys(deltaLadderFrom).length > 0">
      <div v-for="(item, index) in ladder" :key="index" class="">
        <div v-if="item['filled']" class="h-4  text-center">
          <div class="border-b border-b-white border-t border-t-white w-12 px-2" :class="getCumDeltaColor(getCumDelta(item))">{{ getCumDelta(item)}}</div>
          </div>
          </div>
          </div>
        <div class="">
          <div v-for="(item, index) in ladder" :key="index" class="">
            <div v-if="item['filled']" class="h-4  text-center border-l border-l-white border-r border-r-white">
              <div class="border-b border-b-white border-t border-t-white w-12 px-2" :class="getCumDeltaNetColor(getCumDelta(item, false) + getCumDelta(item, true))">{{ getCumDelta(item, true) + getCumDelta(item, false)}}</div>
              </div>
              </div>      
              </div>
              <div class="">
                <div v-for="(item, index) in ladder" :key="index" class="">
                  <div v-if="item['filled']" class="h-4  text-center ">
                    <div class="border-b border-b-white border-t border-t-white w-12 px-2" :class="getCumDeltaColor(getCumDelta(item, false))">{{ getCumDelta(item, false)}}</div>
                    </div>
                    </div>      
                    </div>
                    </div> -->
                    <!-- <div class=""><ProgressBar :value="50" :maxRange=""/></div> -->
      <div class="">
        <div v-for="(item, index) in ladder" :key="index" class="">
          <div v-if="item['filled']" class="h-4">
            <LadderRow :rowItem="item" />
          </div>
        </div>        
      </div>
    </div>


    <div class="mt- absolute left- top-0 z-10">

    </div>
  </div>
</template>

<script>
import { ladder, delta, deltaLadderFrom, deltaLadderTo, options } from "../stateOrderflow";
import LadderRow from "./LadderRow.vue";
import ProgressBar from "./ProgressBar.vue";
export default {
  components: { LadderRow, ProgressBar },
  setup() {
    const grads = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 900];
    const getCumDelta =(item, from=true) => {
      const px = item.from.at(-1).price
      let res = ""
      // if (deltaLadderFrom.data[item.from.at(-1).price.toFixed(2)] && deltaLadderTo.data[item.to.at(0).price.toFixed(2)]) {
      try{
        res = from ? Math.round(deltaLadderFrom.data[item.from.at(-1).price.toFixed(2)].cum_delta) : Math.round(deltaLadderTo.data[item.to.at(0).price.toFixed(2)].cum_delta)
      } catch {
        console.log("no cumdelta data here")
      }
      // }
      if (px) {
        return isNaN(res) ? "" : res 
      } else {
        return 0
      }
    }
    const getCumDeltaColor = (delta) => {
      if (delta == "") return 
      const absDelta = Math.abs(delta);
      const opacity =
        absDelta >= options.maxCumDelta
          ? 1
          : 0 +
            (absDelta / options.maxCumDelta) ;
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
    const getCumDeltaNetColor = (delta) => {
      if (delta == "") return 
      const absDelta = Math.abs(delta);
      const opacity =
        absDelta >= options.maxCumDeltaNet
          ? 1
          : 0 +
            (absDelta / options.maxCumDeltaNet) ;
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
    return {
      LadderRow,
      ladder,
      deltaLadderFrom,
      deltaLadderTo,
      delta,
      ProgressBar,
      getCumDelta,
      getCumDeltaColor,
      getCumDeltaNetColor,
      options
    };
  },
};
</script>

<style>
.scroller {
  height: 400px;
  overflow-y: auto;
}
.item {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
</style>