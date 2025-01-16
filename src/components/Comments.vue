<template lang="">
    <div class="select-none">
        <div v-for="comment in comments" :key="comment.timestamp" class="bg-slate-100 m-2 mx-2 py-1 pl-2 pr-8 text-xs rounded-md relative">
            <div class="text-slate-400 text-xxs">{{formatTime(comment.timestamp) }}</div>
            <div>{{ comment.comment }}</div>
            <Trash class="absolute right-2 top-2" :commentKey="comment.timestamp"/>
        </div>
        <!-- <div class="text-xxs text-white">gap</div> -->
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { formatTime } from '../utils';
import { getDatabase, ref as dbRef, query, orderByChild, startAt, endAt, onChildAdded, orderByKey, get, onValue } from 'firebase/database';
import { database } from "../firebase";
import Trash from "./Icons/Trash.vue"
export default {
  components: {Trash},
  // emits:['scroll-to-bottom'],
   setup(_, {emit}) {

    const comments = ref([]); // Holds the comments

    let unsubscribe = () => {};
    const fetchComments = () => {
            let todayStart = new Date();
            let todayEnd = new Date();
            todayStart.setHours(0, 0, 0, 0);
            todayEnd.setHours(23, 59, 59, 999);
            const todayStartStr = todayStart.getTime()//.toString();
            const todayEndStr = todayEnd.getTime()//.toString();                
            const commentsRef = dbRef(database, "comments"); // Create a reference to the "commentEntries" node
            const commentsQuery = query(
              commentsRef,
              // orderBy(),
              orderByChild("timestamp", ""),
              startAt(todayStartStr),
              endAt(todayEndStr)
            );
            console.log("Comments being fetched:", todayStartStr, todayEndStr);
            const res = onValue(commentsQuery, (snapshot) => {
              // console.log(snapshot)
                const newComments = snapshot.val();
                if (newComments) {
                  console.log("new comment")
                  emit('scroll-to-bottom')
                  comments.value = Object.values(newComments);
                }
            });            
            // try {
            //     console.log("Fetching comments", todayStartStr, todayEndStr);
            //     const snapshot = await get(commentsQuery);
            //     if (snapshot.exists()) {
            //         comments.value = Object.values(snapshot.val()); // Reverse to show latest at the top
            //     } else {
            //         console.log("No comments found for the selected date.");
            //         comments.value = [];
            //     }
            // } catch (error) {
            //     console.error("Error fetching comments:", error);
            // }            
        }
    onMounted(() => {
      // Set up the listener for child added
      fetchComments()
    });
    onUnmounted(() => {
      // if (unsubscribe) unsubscribe(); // Remove listener on unmount
    });
    return {
        comments,
        formatTime,
        Trash
    }
  }
}
</script>
<style lang="">
    
</style>