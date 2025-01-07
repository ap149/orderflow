<template>
  <div
    class="fixed bottom-24 right-96 bg-slate-700 text-xs text-white mr-6 rounded"
  >
    <div class="flex flex-row justify-end">
      <div
        class="pt-1 pb-2 px-4 text-2xl hover:bg-slate-300 cursor-pointer"
        @click="changeSelectedCell(false)"
      >
        x
      </div>
    </div>
    <div class="p-4">
      <div class="text-xs text-slate-300 mb-1">
        {{ formatTime(selectedCell["utc"]) }}
      </div>
      <div class="flex flex-row pr-4 mb-1">
        <div class="w-12">To:</div>
        <div class="w-8">
          {{
            parseFloat(
              selectedCell["price"] + (from ? selectedCell["chg"] : 0)
            ).toFixed(2)
          }}
        </div>
      </div>
      <div class="flex flex-row pr-4 mb-1">
        <div class="w-12">Chg:</div>
        <div class="w-12">
          {{ selectedCell["chg"] > 0 ? "+" : ""
          }}{{ parseFloat(selectedCell["chg"]).toFixed(2) }}
        </div>
      </div>
      <div class="flex flex-row pr-4 mb-1">
        <div class="w-12">From:</div>
        <div class="w-8">
          {{
            parseFloat(
              selectedCell["price"] - (from ? 0 : selectedCell["chg"])
            ).toFixed(2)
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { changeSelectedCell } from "../state";
export default {
  props: {
    // Props definition is here
    selectedCell: {
      type: Object,
      required: true,
    },
    from: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const formatTime = (timestamp, ms = false) => {
      const date = new Date(parseFloat(timestamp));
      const hours = String(date.getUTCHours()); // 24-hour format, padded to 2 digits
      const minutes = String(date.getUTCMinutes()).padStart(2, "0"); // Padded minutes
      const seconds = String(date.getUTCSeconds()).padStart(2, "0"); // Padded seconds
      const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0"); // Padded milliseconds
      return `${hours}:${minutes}:${seconds}`;
    };
    return {
      formatTime,
      changeSelectedCell,
    };
  },
};
</script>

<style>
</style>