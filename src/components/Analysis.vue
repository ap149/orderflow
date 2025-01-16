<template lang="">
    <div class="h-full flex flex-col bg-slate-100">
        <div class="h-4/6">
            <div class="absolute sticky top-0 bg-slate-200 flex items-center justify-center h-8" >
                <div v-if="selectedDay.date" class="font-bold uppercase text-xs mr-4 flex justify-end flex-1">
                    <div>{{formatDate(selectedDay.date)}} :</div>
                </div>
                <div v-if="selectedDay.date" class="font-bold uppercase text-xs flex flex-1">
                    <div>{{selectedMkt.mkt ? selectedMkt.mkt : "TOTAL"}}</div>
                </div>
            </div>
            <div class="py-2 shadow-md z-20 border-b border-b-slate-300  px-2">
                <ChartComponent class="bg-white" v-if="trades.data.length > 0"  />
            </div>
        </div> 

        <div class="grow overflow-y-scroll pt-2 z-10 bg-slate-100">
                <div v-for="comment in comments" :key="comment.timestamp" class="bg-white m-4 p-2 text-xs rounded-lg">
                    <div class="text-slate-400 text-xxs">{{formatTime(comment.timestamp) }}</div>
                    <div>{{ comment.comment }}</div>
                </div>

        </div>

    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { selectedDay, selectedMkt, trades } from '../stateJournal';
import { formatTime, formatDate, timeDiff } from '../utils';
import { getDatabase, ref as dbRef, query, orderByChild, startAt, endAt, onChildAdded, orderByKey, update, get } from 'firebase/database';
import { database } from "../firebase";
import ChartComponent from './ChartComponent.vue';
import JournalEntry from './JournalEntry.vue';
export default {
    components: {ChartComponent, JournalEntry},
    
    setup(){
        const comments = ref([]); // Holds the comments

        

        let unsubscribe = () => {};
        const fetchComments = async () => {
            let todayStart = selectedDay.date ? new Date(selectedDay.date.split("-")[0],selectedDay.date.split("-")[1]-1,selectedDay.date.split("-")[2]) : null;
            let todayEnd = selectedDay.date ? new Date(selectedDay.date.split("-")[0],selectedDay.date.split("-")[1]-1,selectedDay.date.split("-")[2]) : null;
            todayStart.setHours(0, 0, 0, 0);
            todayEnd.setHours(23, 59, 59, 999);
            const todayStartStr = todayStart.getTime().toString();
            const todayEndStr = todayEnd.getTime().toString();                
            const commentsRef = dbRef(database, "comments"); // Create a reference to the "commentEntries" node
            const commentsQuery = query(
                commentsRef,
                orderByKey(), // Order by the key (timestamp)
                startAt(todayStartStr), // Start of today's date
                endAt(todayEndStr) // End of today's date
            );
            try {
                // console.log("Fetching comments", todayStartStr, todayEndStr);
                const snapshot = await get(commentsQuery);
                if (snapshot.exists()) {
                    // console.log("Comments fetched:", snapshot.val());
                    comments.value = Object.values(snapshot.val()); // Reverse to show latest at the top
                } else {
                    console.log("No comments found for the selected date.");
                    comments.value = [];
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }            
        }
        watch(
            () => selectedDay.date,
            () => {
                console.log("date chg")
                fetchComments()
            },
            { deep: true }
        );
        onUnmounted(() => {
            // if (unsubscribe) unsubscribe(); // Remove listener on unmount
        });        
        return{
            selectedDay,
            formatDate,
            ChartComponent,
            trades,
            selectedMkt,
            JournalEntry,
            comments,
            formatTime,
            timeDiff,

        }
    }
}
</script>

<style lang="">
    
</style>