<template lang="">
    <div class="h-32  w-full  ">
        <div  v-if="cellData.data.display" class="  ">
            <div  @click="(event) => handleUpdateTrades('DAX', event)" class="flex justify- px-2 py-2 mb-2 rounded  font-bold cursor-pointer border-2" :class="cellData.data.dax.pnl >= 0 ? 'border-teal-400 text-teal-400 hover:bg-teal-500 hover:text-white' : 'border-rose-400 text-rose-400 hover:bg-rose-500 hover:text-white'">
                    <div class="w-12 text-left">DAX: </div>
                    <div class="w-12 text-left">{{formatCurrency(cellData.data.dax.pnl)}}</div>
                <div class="w-12 text-right">[{{cellData.data.dax.trades}}]</div>
            </div>
            <div  @click="(event) => handleUpdateTrades('ES', event)" class="flex justify- px-2 py-2 mb-2 rounded  font-bold cursor-pointer border-2" :class="cellData.data.us.pnl >= 0 ? 'border-teal-400 text-teal-400 hover:bg-teal-500 hover:text-white' : 'border-rose-400 text-rose-400 hover:bg-rose-500 hover:text-white'">
                    <div class="w-12 text-left">ES: </div>
                    <div class="w-12 text-left">{{formatCurrency(cellData.data.us.pnl)}}</div>
                <div  class="w-12 text-right">[{{cellData.data.us.trades}}]</div>
            </div>
            <div  @click="(event) => handleUpdateTrades(false, event)" class="flex justify- px-2 py-2 mb-2 rounded text-white font-bold cursor-pointer text-white" :class="cellData.data.total.pnl >= 0 ? 'bg-teal-400 hover:bg-teal-500' : 'bg-rose-400 hover:bg-rose-500'">
                    <div class="w-12 text-left">Total: </div>
                    <div class="w-12 text-left">{{formatCurrency(cellData.data.total.pnl)}}</div>
                <div class="w-12 text-right">[{{cellData.data.total.trades}}]</div>
            </div>

        </div>
    </div>
</template>

<script>
import {database} from "../firebase"
import { getDatabase, ref, query, orderByKey, startAt, endAt, get } from 'firebase/database';
import { reactive, onMounted } from "vue";
import { formatCurrency } from "../utils";
import { selectedDay, selectedMkt, updateTrades } from "../stateJournal";
export default {
    props: {
    // Props definition is here
        cellDate: {
            type: Object,
            required: true,
        }
    },
    setup(props) {
        const cellData = reactive({data:{dax:{}, us:{}, total:{}, display: false}});
        const cellTrades = reactive({});
        const getUtcTimestampsForDay = (dateString) => {
  // Create a Date object from the date string
            const date = new Date(dateString); // e.g., "2025-01-07"

            // Start of the day (00:00:00)
            const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
            
            // End of the day (23:59:59)
            const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59));

            // Get the UTC timestamps (milliseconds since Unix epoch)
            const startTimestamp = startOfDay.getTime();
            const endTimestamp = endOfDay.getTime();

            return { startTimestamp,endTimestamp };
        }

        const  fetchTransactionsInRange = () => {
            const transactionsRef = ref(database, 'tradeHistory/');
            const { startTimestamp, endTimestamp } = getUtcTimestampsForDay(props.cellDate.date);
            // Build the query with the start and end timestamps
            const transactionsQuery = query(
                transactionsRef,
                orderByKey(),
                startAt(startTimestamp.toString()), // startAt takes strings (timestamps as strings)
                endAt(endTimestamp.toString()) // endAt takes strings (timestamps as strings)
            );

            get(transactionsQuery)
                .then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();    
                    // console.log(data)
                    cellTrades.data = data
                    cellCalcs(data)
                } else {
                    console.log('No transactions found for the given range.');
                }
                })
                .catch((error) => {
                console.error('Error fetching data:', error);
                });
        }                

        const cellCalcs = (data) => {
            let display = false
            let dax = {trades: 0, points: 0, pnl: 0}
            let us = {trades: 0, points: 0, pnl: 0}
            let total = {trades: 0, points: 0, pnl: 0}
            Object.entries(data).forEach(([key, trade]) => {
                // console.log(key, value.split(','));
                // console.log(trade)
                display = true
                // const entry = value.split(',')
                total.trades += 1
                total.pnl += trade.Pnl
                if (trade.Symbol.includes("DAX")) {
                    dax.trades += 1
                    dax.pnl += trade.Pnl                    
                }
                if (trade.Symbol.includes("ES")) {
                    us.trades += 1
                    us.pnl += trade.Pnl                    
                }

            });
            cellData.data = {dax, us, total, display}
        }

        const handleUpdateTrades = (mkt=false, event) => {
            event.stopPropagation(); // Prevent parent click from triggering            
            selectedDay.date = props.cellDate.date
            selectedMkt.mkt = mkt
            console.log(selectedDay.date)
            updateTrades(mkt, cellTrades.data)
        }

        onMounted(() => {
            fetchTransactionsInRange()
        });

        return {
            cellData,
            cellTrades,
            formatCurrency,
            handleUpdateTrades
        }
    }
}
</script>

<style lang="">
    
</style>