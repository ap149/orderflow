<template lang="">
    <div class="select- pb-2 bg-white">
        <div v-for="comment in comments" :key="comment.timestamp" class=" flex mt-2 ml-2 mr-2 flex justify-between">
          <div class="text-xs rounded-md relative bg-slate-100 pl-2 pr-2 py-1 flex items-center justify-between">
            <div>
              <div class="flex items-start">
                <div class="text-slate-400 text-xxs w-12">{{formatTime(comment.timestamp) }}</div>
                <EditIcon class="mt- pr-  text-slate-400 cursor-pointer"/>
              </div>
              <div class="pr-4">{{ comment.comment }}</div>
            </div>
            <Trash class="" :commentKey="comment.timestamp"/>
          </div>
          <div class="w- text-xxs flex   items-center justify-end">
          <div class="w-8 p-2 rounded-full mx-1 " :class="getCommentTypeStyle('comment', comment)" @click="handleChangeCommentType('comment', comment)"><ChatIcon/></div>
          <div class="w-8 p-2 rounded-full      " :class="getCommentTypeStyle('level', comment)"   @click="handleChangeCommentType('level', comment)"><LevelsIcon/></div>
          <!-- <div class="w-8">L</div> -->
          </div>
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
import ChartIcon from './Icons/ChartIcon.vue';
import ChatIcon from './Icons/ChatIcon.vue';
import LevelsIcon from './Icons/LevelsIcon.vue';
import EditIcon from "./Icons/EditIcon.vue"
import { changeCommentType } from '../stateJournal';
export default {
  components: {Trash, ChartIcon, ChatIcon, LevelsIcon, EditIcon},
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
                const newComments = snapshot.val();
                if (newComments) {
                  console.log("new comment")
                  emit('scroll-to-bottom')
                  comments.value = Object.values(newComments);
                }
            });                  
        }
    const getCommentTypeStyle = (str, comment) => {
      if (str == comment.type) {
        return "text-teal-300"
      } else {
        return "cursor-pointer text-slate-200 hover:bg-slate-100 hover:text-slate-300"
      }
    }

    const handleChangeCommentType = (str, comment) => {
      if (str == comment.type) return
      // console.log(`changing comment ${comment.timestamp} from ${comment.type} t ${str}`)
      changeCommentType(str, comment.timestamp)
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
        Trash,
        ChartIcon,
        ChatIcon,
        LevelsIcon,
        EditIcon,
        getCommentTypeStyle,
        handleChangeCommentType
    }
  }
}
</script>
<style lang="">
    
</style>