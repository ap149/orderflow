<template>
    <div class="p-4">
      <h2 class="text-lg font-bold mb-4">Journal Entry</h2>
      <!-- Quill Rich Text Editor -->
      <QuillEditor
         ref="quillEditor"
        class="mb-4"
        theme="snow"
        placeholder="Write your journal entry here..."
        @ready="quillReady"
        v-model:content="editorContent"
      />
  
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        @click="saveEntry"
        :disabled="isSaving"
      >
        <span v-if="isSaving">Saving...</span>
        <span v-else>Save Entry</span>
      </button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { QuillEditor } from "@vueup/vue-quill";
//   import { getDatabase, ref as dbRef, push } from "firebase/database";
  import { database } from "../firebase";

  export default {
    components: {
      QuillEditor,
    },
    setup() {
      const editorContent = ref(""); // Holds the HTML content
      const isSaving = ref(false); // Button state for saving
      const quillEditor = ref(null); // Reference to the Quill editor instance

      const quillReady = () => {
        console.log("quill ready")
      }

      onMounted(() => {
        console.log(quillEditor.value)
      // Check if quillEditor is available after mounting
        // if (quillEditor.value) {
        //     console.log('Quill editor is initialized');
        // }
      });
            
      const updateContent = (content) => {
        console.log(content)
        // const editor = quillEditor.value.quill;
        // const htmlContent = editor.root.innerHTML;
        // editorContent.value = htmlContent;
      };
      const saveEntry = async () => {
        console.log(editorContent._rawValue)
        if (!editorContent._rawValue) {
          alert("Journal entry cannot be empty!");
          return;
        }
  
        // isSaving.value = true;
  
        // Get Firebase database reference
        // const db = database;
        // const journalRef = dbRef(db, "journalEntries");
  
        // try {
        //   // Push the entry to Firebase
        //   await push(journalRef, {
        //     content: editorContent.value, // Store HTML content
        //     timestamp: Date.now(),
        //   });
  
        //   alert("Journal entry saved successfully!");
        //   editorContent.value = ""; // Clear the editor
        // } catch (error) {
        //   console.error("Error saving journal entry:", error);
        //   alert("Failed to save the entry. Please try again.");
        // } finally {
        //   isSaving.value = false;
        // }
      };
  
      return { 
        editorContent,
        isSaving, 
        saveEntry,
        updateContent, 
        quillReady
      };
    },
  };
  </script>
  
  <style>
  /* Add Quill's CSS */
  @import "quill/dist/quill.snow.css";
  </style>
  