<template>
    <div class="flex  border border-slate-300 bg-white"
         :class="getContainerClass()"    
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
      neutral: {
        type: Boolean,
        required: false,
        default: false
      },
      reverse: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    setup(props) {
      // Calculate the width proportions
      const neutralColor = "#CBD5E1"
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
        let bg = "white" //#F0FDFA
        let color = props.neutral ? neutralColor : "#2DD4BF" //#F0FDFA
        if (props.value > 0) {
          const proportion = Math.abs(props.value / props.maxRange);
          return `width: ${rhsWidth.value * 100}%; background: linear-gradient(to right, ${color}  ${proportion * 100}%, ${bg}  ${proportion * 100}%);`;
        }
        return `width: ${rhsWidth.value * 100}%; background: ${bg} ;`;
      });
      const getContainerClass = () => {
        let height = props.size == 'medium' ? 'h-3' : props.size=='large' ? 'h-6' : 'h-1'
        let rotate = props.reverse ? 'rotate-180' : ''
        return `${height} ${rotate}`
      }
      return { 
        lhsStyle, 
        rhsStyle,
        getContainerClass
      };
    },
  };
  </script>
  
  <style>
  /* Optional additional styling */
  </style>
  