<template>
    <div class="flex  border border-slate-300"
         :class="size == 'medium' ? 'h-3' : 'h-1'"   
    >
      <!-- LHS Div -->
      <div
        :style="lhsStyle"
        class="h-full  border-r border-r-slate-500"
      ></div>
      <!-- RHS Div -->
      <div
        :style="rhsStyle"
        class="h-full "
      ></div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  
  export default {
    props: {
      value: {
        type: Number,
        required: true,
      },
      minRange: {
        type: Number,
        required: true,
      },
      maxRange: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: false,
        default: "medium"
      },
    },
    setup(props) {
      // Calculate the width proportions
      const totalRange = computed(() => Math.abs(props.maxRange - props.minRange));
      const lhsWidth = computed(() =>
        Math.abs(props.minRange) / totalRange.value
      );
      const rhsWidth = computed(() => 1 - lhsWidth.value);
  
      // Define styles for LHS and RHS
      const lhsStyle = computed(() => {
        let color = "white" //#FFF1F2
        if (props.value < 0) {
          const proportion = Math.abs(props.value / props.minRange);
          return `width: ${lhsWidth.value * 100}%; background: linear-gradient(to left, #FB7185 ${proportion * 100}%, ${color} ${proportion * 100}%);`;
        }
        return `width: ${lhsWidth.value * 100}%; background: ${color};`;
      });
  
      const rhsStyle = computed(() => {
        let color = "white" //#F0FDFA
        if (props.value > 0) {
          const proportion = Math.abs(props.value / props.maxRange);
          return `width: ${rhsWidth.value * 100}%; background: linear-gradient(to right, #2DD4BF ${proportion * 100}%, ${color}  ${proportion * 100}%);`;
        }
        return `width: ${rhsWidth.value * 100}%; background: ${color} ;`;
      });
  
      return { lhsStyle, rhsStyle };
    },
  };
  </script>
  
  <style>
  /* Optional additional styling */
  </style>
  