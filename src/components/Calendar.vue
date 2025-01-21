<template>
    <div class="py-1 px-4 h-full w-[50rem]">
      <!-- Calendar Header -->
      <div class="flex justify-between items-center mb-1 bg-slate-100">

        <button @click="prevMonth" class=" font-bold px-3 py-1 bg-slate-200 hover:bg-slate-300 hover:text-white rounded-full ml-2 text-slate-500"><ChevronL/></button>
        <h2 class="text-sm font-bold uppercase rounded px-2 py-1 hover:bg-slate-300 hover:text-white cursor-pointer " @click="hideCalendar">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </h2>
        <button @click="nextMonth" class="px-3 py-1 rounded bg-slate-200 hover:bg-slate-300 hover:text-white rounded-full mr-2  text-slate-500"><ChevronR/></button>

      </div>
  
      <!-- Calendar Grid -->
      <div class="grid grid-cols-5 gap-1 text-center">
        <!-- Weekday Headers -->
        <div v-for="day in weekdays" :key="day" class="font-bold text-xs uppercase ">
          {{ day }}
        </div>
  
        <!-- Days of the Month -->
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class=" rounded flex flex-col items-start px-2 py-1 relative text-xs cursor-pointer border-2 bg-white "
          @click="handleUpdateTrades(day.date)"
          :class="{
            'text-slate-400': !day.isCurrentMonth,
            // 'border-white': !day.isToday,
            'border-slate-400': day.isSelectedDay,
            'border-white': !day.isSelectedDay,
          }"
        >
          <span class="text-xs font-semibold mb-1 ">{{ day.day }}</span>
          <CalendarCell :cellDate="day"/>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from "vue";
import CalendarCell from "./CalendarCell.vue";
import ChevronL from "./Icons/ChevronL.vue";
import ChevronR from "./Icons/ChevronR.vue";
import { selectedDay, selectedMkt, updateTrades } from "../stateJournal";
  
  export default {
    components: {CalendarCell, ChevronL, ChevronR},
    setup(_, {emit}) {
      // Constants
      const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"]; // Only weekdays
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
  
      // State
      const today = new Date();
      const currentYear = ref(today.getFullYear());
      const currentMonth = ref(today.getMonth());
  
      // Helper: Get the day of the week (1 = Monday, ..., 5 = Friday)
      const getWeekdayIndex = (date) => {
        const day = date.getDay(); // Sunday = 0, Saturday = 6
        return day === 0 ? 6 : day - 1; // Map Sunday (0) to 6 and shift other days
      };
      // Computed: Calculate days for the calendar
      const calendarDays = computed(() => {
        const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
        const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0);
  
        // Start from the Monday of the first week of the calendar
        const startDate = new Date(firstDayOfMonth);
        while (getWeekdayIndex(startDate) > 0) {
          startDate.setDate(startDate.getDate() - 1);
        }
  
        // End at the Friday of the last week of the calendar
        const endDate = new Date(lastDayOfMonth);
        while (getWeekdayIndex(endDate) < 4) {
          endDate.setDate(endDate.getDate() + 1);
        }
  
        // Generate calendar days
        const days = [];
        let currentDate = new Date(startDate);
        console.log("today:", currentDate)
        // currentDate.setDate(currentDate.getDate() - 3); 
        // currentDate = currentDate.setDate(currentDate.getDay-1)
        let today = new Date()
        today.setDate(today.getDate())//-4)
        while (currentDate <= endDate) {
          if (getWeekdayIndex(currentDate) < 5) {
            days.push({
              date: currentDate.toISOString().split("T")[0],
              day: currentDate.getDate(),
              isCurrentMonth:
                currentDate.getMonth() === currentMonth.value &&
                currentDate.getFullYear() === currentYear.value,
              isToday:
                currentDate.toDateString() === today.toDateString(),
              isSelectedDay: 
                selectedDay.date ? currentDate.toDateString() === new Date(selectedDay.date).toDateString() : false
            });
          }
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
  
        return days;
      });
  
      // Methods to navigate months
      const prevMonth = () => {
        if (currentMonth.value === 0) {
          currentMonth.value = 11;
          currentYear.value--;
        } else {
          currentMonth.value--;
        }
      };
  
      const nextMonth = () => {
        if (currentMonth.value === 11) {
          currentMonth.value = 0;
          currentYear.value++;
        } else {
          currentMonth.value++;
        }
      };

      const handleUpdateTrades = (date) => {
            selectedDay.date = date
            selectedMkt.mkt = false
            console.log("parent callewd")
            updateTrades(false, [])
      }

      const hideCalendar =() => {
        console.log("emit")
        emit('hide-calendar')
      }

      return {
        weekdays,
        monthNames,
        currentYear,
        currentMonth,
        calendarDays,
        prevMonth,
        nextMonth,
        CalendarCell,
        selectedDay,
        handleUpdateTrades,
        hideCalendar,
        ChevronL,
        ChevronR
      };
    },
  };
  </script>
  
  <style scoped>
  /* Optional: Add custom styles here */
  </style>
  