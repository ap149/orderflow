<template lang="">
        <div class="border-t border-t-slate-300 pt-2 borderbt-2 border bt-slate-300 bg-slate-100 px-2 pb-2 flex ">
            <textarea
            v-model="commentText"
            class="w-full h-12 p-2 border border-gray-300 rounded text-xs focus:border-none"
            placeholder="Comment..."
            @keydown.enter="handleEnter"
            ref="commentTextArea"
            ></textarea>

            <div class="text-xs font-bold mb-3 flex items-center rounded-full h-full pl-2">
                <div
                @mousedown="startRecording"
                @mouseup="stopRecording"
                :class="isRecording ? 'bg-rose-500' : 'bg-teal-400 hover:bg-teal-500'"
                class="text-white px-2 py-2 w-8 h-8 rounded text-center uppercase cursor-pointer flex justify-center rounded-full"
                >
                <Speaker/>
                </div>
            </div>
        </div>  
</template>
<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { formatTime } from '../utils';
import { getDatabase, ref as dbRef, query, orderByChild, startAt, endAt, onChildAdded, orderByKey, update } from 'firebase/database';
import { database } from "../firebase";
import Speaker from './Icons/Speaker.vue';
export default {
    emits:["scroll-to-bottom"],
    components: {Speaker},
    setup(_, {emit}) {
        const commentText = ref(""); // The text input
        const commentTextArea = ref(null); // The text input        
        const commentsRef = dbRef(database, "comments"); // Create a reference to the "commentEntries" node
        const isRecording = ref(false);
        const transcript = ref("");
        const saved = ref(true)
        
        let recognition;
        const startRecording = () => {
        if (isRecording.value) return; // Prevent restarting if already active
            saved.value = false
            isRecording.value = true;
            console.log("start")
            recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                console.log("onresult")
                transcript.value = transcript.value + event.results[0][0].transcript + " ";
                console.log(transcript.value)

                if (transcript.value != "" && !isRecording.value && !saved.value) {
                    saveToFirebase(transcript.value);
                }     
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };

            recognition.onend = () => {
                console.log("on end")
                if (isRecording) {
                    console.log('Restarting recording...');
                    recognition.start(); // Restart if still recording
                } else {
               
                }
            };

            console.log('Recording started...');
            recognition.start();
        };

        const stopRecording = () => {
            console.log("check stop")
            if (!isRecording) return; // Prevent stopping if already inactive
            console.log("confirm stop")
            if (transcript.value != "" && !saved.value) {
                saveToFirebase(transcript.value);
            }
            isRecording.value = false;

            if (recognition) {
                recognition.onend = null; // Disable restart logic
                recognition.stop();
                console.log('Recording stopped...');
            }
        };

        const saveToFirebase = async (text) => {
        // Replace with your Firebase save logic
        transcript.value = ""
            console.log('Saving to Firebase:', text);
            let updateObj = {}
            const timestamp = Date.now() //- 2 * 24 * 60 * 60 * 1000; // Get current timestamp
            updateObj[timestamp] ={"comment":text, "timestamp": timestamp}
            console.log(updateObj)
                try {
                    update(commentsRef,updateObj)
                    .then(() => {
                        console.log("comment entry saved successfully!");
                        commentText.value = ""
                        transcript.value = ""
                        saved.value = true

                        // commentTextArea.value.blur()
                    })
                } catch (error) {
                    console.error("Error saving comment entry:", error);
                    alert("Failed to save the entry. Please try again.");
                } finally {
                    // isSaving.value = false;
                }            
        };

        const handleEnter = async (event) => {
            if (!event.shiftKey) {
                console.log(commentText.value)

                saveToFirebase(commentText.value)
                event.preventDefault();
            } else {
            }
        }
        
        return {
            handleEnter,
            commentText,
            isRecording,
            startRecording,
            stopRecording,
            Speaker
        }
    }
}
</script>
<style lang="">
    
</style>