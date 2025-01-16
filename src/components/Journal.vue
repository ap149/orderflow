<template>
    <div     class="flex h-screen w-screen z-10 pt-12 bg-slate-200 ">
        <div class="  overflow-x-hidden flex select-none"   >
            <div class="bg-slate-800 p-1 cursor-pointer  text-xs flex-1" @click="toggleLHS">
                <div class="w- pt- px-1">
                    <div v-if="!isLHSOpen"  class="rounded hover:bg-slate-500 hover:text-white rounded-full  text-white p-1 px-1 w-10 h-10 flex items-center justify-center">
                        <CalendarIcon class=""/>
                    </div>
                    <div v-else  class="rounded hover:bg-slate-500 hover:text-white rounded-full  text-white p-1 px-1 w-10 h-10 flex items-center justify-center">
                        <ChevronLL />
                    </div>
                </div>
            </div>
            <!-- <Calendar :class="`transition-all duration-0 ${isLHSOpen ? 'w-[55rem]' : 'w-0'} ${isLHSOpen && !hideLHS ? 'overflow-y-auto' : ' overflow-hidden'}`" class="border-r border-r-slate-400" /> -->
            <Calendar v-if="isLHSOpen" class="border-r border-r-slate-400" />
        </div>
        <div class="  border-r border-r-slate-400 w-[35rem]">
            <Analysis/>
        </div>
        <div class=" bg-slate-100 overflow-y-scroll w-90  grow">
            <TradeLog class=""/>
        </div>
        <div class="  overflow-x-hidden flex select-none"   >
            <div v-if="isRHSOpen" class="py-1 px-4 w-[50rem]">
            <p>trade analysis</p>
        </div>
            <div class="bg-slate-800 p-1 cursor-pointer  text-xs flex-1" @click="toggleRHS">
                <div class="w- pt- px-1">
                    <div v-if="!isRHSOpen"  class="rounded hover:bg-slate-500 hover:text-white rounded-full  text-white p-1 px-1 w-10 h-10 flex items-center justify-center">
                        <ChartIcon/>
                    </div>
                    <div v-else  class="rounded hover:bg-slate-500 hover:text-white rounded-full  text-white p-1 px-1 w-10 h-10 flex items-center justify-center">
                        <ChevronRR />
                    </div>
                </div>
            </div>
            <!-- <Calendar :class="`transition-all duration-0 ${isRHSOpen ? 'w-[55rem]' : 'w-0'} ${isRHSOpen && !hideRHS ? 'overflow-y-auto' : ' overflow-hidden'}`" class="border-r border-r-slate-400" /> -->
        </div>        

    </div>
</template>


<script>
import Calendar from './Calendar.vue';
import TradeLog from './TradeLog.vue';
import { trades } from '../stateJournal';
import Analysis from './Analysis.vue';
import {ref} from "vue";
import CalendarIcon from './Icons/CalendarIcon.vue';
import ChevronLL from './Icons/ChevronLL.vue';
import ChartIcon from './Icons/ChartIcon.vue';
import ChevronRR from "./Icons/ChevronRR.vue"

export default {
    components: {Calendar, TradeLog, Analysis, CalendarIcon, ChevronLL, ChartIcon, ChevronRR},
    setup(){
        const isLHSOpen = ref(true);
        const isRHSOpen = ref(false);
        const hideLHS = ref(false);
        const toggleLHS = () => {
            console.log("hide")
            isLHSOpen.value = !isLHSOpen.value;
            if (isLHSOpen.value) isRHSOpen.value = false; // Collapse RHS if Calendar is opened
            setTimeout(() => {
                console.log("hide calendare")
                // hideLHS.value = !hideLHS.value
            },300)
        };
        const toggleRHS = () => {
            isRHSOpen.value = !isRHSOpen.value;
            if (isRHSOpen.value) isLHSOpen.value = false; // Collapse RHS if Calendar is opened
        };

        return {
            isLHSOpen, 
            isRHSOpen,
            hideLHS,
            toggleLHS,
            toggleRHS,
            Calendar,
            TradeLog,
            Analysis,
            CalendarIcon,
            ChevronLL,
            ChevronRR,
            ChartIcon
        }
    }
}
</script>

