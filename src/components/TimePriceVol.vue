<template>
  <div class="mx-4">
    <div
      class="text-xxs border-b border-b-slate-200 border-t border-t-slate-200 flex flex-row"
      v-for="(item, index) in tpv"
      :key="index"
    >
      <div
        class="w-12 text-slate-400 px-2 border-r border-r-slate-500 border-l border-l-slate-500 bg-slate-100"
      >
        {{ formatTime(item["from"]["utc"]) }}
      </div>
      <!-- <div
        class="w-12 text-center"
        :class="getTotalDeltaColor(item['from']['delta'])"
      >
        {{ item["from"]["delta"] }}
      </div> -->
      <div class="w-12 text-center border-r-2 border-r-slate-500 bg-white">
        {{ item["from"]["price"].toFixed(2) }}
      </div>
      <div
        class="w-12 text-center font-bold"
        :class="getPxChgColor(item['from']['chg'])"
      >
        {{ item["from"]["chg"].toFixed(2) }}
      </div>
      <div
        class="w-12 text-center font-bold"
        :class="getDeltaColor(item['from'])"
      >
        {{ item["from"]["volume"] * (item["from"]["chg"] < 0 ? -1 : 1) }}
      </div>
      <div class="w-12 text-center border-l-2 border-l-slate-500 bg-white">
        {{ item["to"]["price"].toFixed(2) }}
      </div>
      <!-- <div
        class="w-12 text-center border-r border-r-slate-500"
        :class="getTotalDeltaColor(item['to']['delta'])"
      >
        {{ item["to"]["delta"] }}
      </div> -->
    </div>
  </div>
</template>

<script>
import { tpv, options } from "../state";
export default {
  setup() {
    const grads = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 900];
    const formatTime = (timestamp, ms = false) => {
      const date = new Date(parseFloat(timestamp));
      const hours = String(date.getUTCHours()); // 24-hour format, padded to 2 digits
      const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // Padded minutes
      const seconds = String(date.getUTCSeconds()).padStart(2, "0"); // Padded seconds
      const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0"); // Padded milliseconds
      return `${hours}:${minutes}:${seconds}`;
    };
    const getPxChgColor = (delta) => {
      const absDelta = Math.abs(delta) * 2;
      const opacity =
        absDelta >= options.max_chg ? 1 : absDelta / options.max_chg;
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
    const getTotalDeltaColor = (delta) => {
      const absDelta = Math.abs(delta);
      const opacity =
        absDelta >= options.maxTotal ? 0 : absDelta / options.maxTotal;
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
        delta_abs >= options.maxCell ? 1 : delta_abs / options.maxCell;
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
      const volume = Math.abs(item["volume"]);
      return `${background} ${grad > 3 ? " text-white" : ""} `;
    };
    return {
      tpv,
      options,
      formatTime,
      getPxChgColor,
      getTotalDeltaColor,
      getDeltaColor,
    };
  },
};
</script>

<style>
</style>