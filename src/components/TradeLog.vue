<template lang="">
    <div class="relative w-90 select-none">
        <div class="absolute sticky top-0 h-8 bg-slate-200 flex font-bold text-trade-log items-center w-90 ">
            <!-- <div class="font-bold uppercase text-xs">trades</div> -->
            <!-- <div class="text-trade-log flex px- py-1 bg-white border-b border-b-slate-200 font-bold"> -->
                <div class="h-full w-6 "></div>
                <div class="h-full w-16 "></div>
                <div class="h-full w-14 "></div>
                <div class="h-full w-16 "></div>
                <div class="h-full w-16 "></div>
                <div class="h-full w-16 "></div>
                <div class="h-full w-24 "></div>
                <!-- <div class="w-16"></div> -->
                <!-- <div class="w-20"></div> -->
            <!-- </div> -->
        </div>
        
       <div v-for="(trade, index) in trades.data" :key="index" class="text-trade-log bg-white border-b border-b-slate-400">
            <!-- <div class="pl-1 py-1 bg-slate-100 flex">
                <div class="pl-1 w-6 text-slate-400 ">
                </div>
                <div class="text-slate-400 w-16">{{index == 0 ? "-" : timeDiff(trade.EntryTime, trades.data[index-1].ExitTime)}}</div>
            </div> -->
            <div class="flex items-center  w-full py-1 pr-2 pl-2 ">
                <div class="w-1/3 mr-4 flex" >

                    <div class="pl- w-4 text-slate-400 ">
                        <div>{{index + 1}}</div>
                    </div>
                    <div class="px-1 w-">
                        <div class="font-bol">{{formatTime(trade.EntryTime)}}</div>
                        <div class="text-slate-400">{{timeDiff(trade.ExitTime, trade.EntryTime)}}</div>
                    </div>
                    <div class="px-1 w- font-bo" >
                        <div class=" font-bold">{{trade.Symbol.replace(".cash", "")}}</div>
                        <div class=" font-bold" :class="trade.Direction ? 'text-rose-400' : 'text-teal-500'">{{trade.Direction == 0 ? 'Buy' : 'Sell'}} {{formatCurrency(Math.abs(trade.Size))}}</div>
                    </div>
                    <!-- <div class="w-6"></div> -->
                </div>
                <div class="mt-1 grow font-bold mr- flex " >
                    <div class="w-16 mr-3">

                        <div class="text-right font-extrabold pr-" :class="trade.Pnl < 0 ? 'text-rose-400' : 'text-teal-400'">{{trade.Pnl > 0 ? '+': ''}}{{formatCurrency(trade.Pnl)}}</div>
                        <div class="text-right font-extrabold" :class="trade.Pnl < 0 ? 'text-rose-400' : 'text-teal-400'">{{trade.Pnl > 0 ? '+': ''}}{{trade.Points.toFixed(1)}} pts</div>
                    </div>
                    <div class="px-1 grow cursor-pointer">
                        <!-- <div class="text-right">{{formatNumber(trade.OpenPrice)}}</div> -->
                        <ProgressBar class="" :value="trade.Points" :minRange="trade.Direction == 1 ? (-trade.MaxPrice + trade.OpenPrice) : (trade.MinPrice - trade.OpenPrice)" :maxRange="(trade.Direction ? (-trade.MinPrice + trade.OpenPrice) : (trade.MaxPrice - trade.OpenPrice))"/>
                        <!-- <div class="">{{formatNumber(trade.ClosePrice)}}</div> -->
                         <div class="mt-1 w-full flex justify-between font-normal">
                            <div class="text-slate-400">{{(trade.Direction ? (-trade.MaxPrice + trade.OpenPrice) : (trade.MinPrice - trade.OpenPrice)).toFixed(1)}} pts</div>
                            <div clss="" :class="getResultScore(trade) > 0 ? 'text-teal-500' : getResultScore(trade) <  0 ? 'text-rose-500' : 'text-slate-400'">{{getResultScore(trade).toFixed(0)}} %</div>
                            <div class="text-slate-400">{{((trade.Direction ? (-trade.MinPrice + trade.OpenPrice) : (trade.MaxPrice - trade.OpenPrice))).toFixed(1)}} pts</div>
                            <!-- <div class="text-rose-400">{{((trade.MinPrice) ).toFixed(1)}}</div>
                            <div class="text-teal400">{{((trade.OpenPrice) ).toFixed(1)}}</div>
                            <div class="text-teal400">{{((trade.ClosePrice) ).toFixed(1)}}</div>
                            <div class="text-teal-400">{{((trade.MaxPrice) ).toFixed(1)}}</div> -->
                            <!-- <div class="text-teal-400">{{trade.Direction}}</div> -->
                         </div>
                        
                    </div>
                </div>                    
            </div>

            <div class="flex items-center  w-full py-1 pr-2 pl-2 bg-slate-100">
                <ProgressBar class="w-1/3 -mr-1 ml-5" :value="trade.CumPnl" :minRange="trade.minCumPnl" :maxRange="trade.maxCumPnl" size="medium"/>
                <div class="flex items-center grow font-bold mr-1 ">
                    
                    <div class="w-16">
                        <div v-if="trade.CumPnl != trade.minCumPnl && trade.CumPnl != trade.maxCumPnl" class="text-right" :class="trade.CumPnl < 0 ? 'text-rose-400' : 'text-teal-400'"></div>
                        <div v-if="trade.CumPnl == trade.maxCumPnl" class="text-teal-400  text-right">+{{formatCurrency(trade.CumPnl)}}</div>
                        <div v-if="trade.CumPnl == trade.minCumPnl" class="text-rose-400  text-right">{{formatCurrency(trade.CumPnl)}}</div>
                        <div v-if="trade.CumPnl != trade.minCumPnl && trade.CumPnl != trade.maxCumPnl" class="text-right" :class="trade.CumPnl < 0 ? 'text-rose-400' : 'text-teal-400'">{{trade.CumPnl > 0 ? '+': ''}}{{formatCurrency(trade.CumPnl)}}</div>
                    </div>
                    <div class="w-2">
                        <div v-if="trade.CumPnl == trade.maxCumPnl" class="underlborder-teal-400 text-teal-400 m-1"><Triangle/></div>
                        <div v-if="trade.CumPnl == trade.minCumPnl" class="underlborder-rose-400 text-rose-400 m-1"><Triangle :positive="false"/></div>
                    </div>
                    </div>                
            </div>
       </div>
    </div>
</template>

<script>
import { trades, selectedMkt } from '../stateJournal';
import { formatCurrency, formatTime, timeDiff,formatNumber } from '../utils';
import ProgressBar from './ProgressBar.vue';
import Triangle from './Icons/Triangle.vue';
export default {
    components: {ProgressBar, Triangle},
    setup(){
        const getResultScore = (trade) => {
            let score = 0
            if (trade.Direction) { //sell
                if (trade.Points > 0){
                    score = Math.min((trade.Points / (trade.OpenPrice - trade.MinPrice)),1)
                }  else {
                    score = Math.max((trade.Points / (trade.MaxPrice - trade.OpenPrice)),-1)
                }
            } else { //buy
                if (trade.Points > 0){
                    score = Math.min(trade.Points / (trade.MaxPrice - trade.OpenPrice),1)
                }  else {
                    score = Math.max(trade.Points / (trade.OpenPrice - trade.MinPrice),-1)
                }
            }
            return (score * 100)
        }
        return {
            trades,
            formatCurrency,
            formatTime,
            formatNumber,
            selectedMkt,
            ProgressBar,
            timeDiff,
            Triangle,
            getResultScore
        }
    }
    
}
</script>
<style>
.text-trade-log {
    font-size:11px
}
</style>