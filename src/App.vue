<template>
    <div class="bg-slate-800 fixed right-0 left-0 text-white h-12 flex z-50 flex items-center justify-center px-10">
      <div @click="goToPath('orderflow')" class="mr-12 cursor-pointer uppercase text-sm pt-1 font-bold" :class="$route.path == '/orderflow' ? 'text-white' : 'text-slate-400 hover:text-white'">orderflow</div>
      <div @click="goToPath('journal')" class="mr-12 cursor-pointer uppercase text-sm pt-1 font-bold" :class="$route.path == '/journal' ? 'text-white' : 'text-slate-400 hover:text-white'">journal</div>
    </div>
  <router-view></router-view>
</template>

<script>
import {
  initOptions,
} from "./stateOrderflow";
import { onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';

export default {

  setup() {
    const router = useRouter(); // Access the router instance
    const route = useRoute();   // Access the current route

    const goToPath = (path) => {
      router.push('/' + path);
    }

    onMounted(() => {
      // console.log("mounted app");
      // initOptions();
    });
    return {
      goToPath
    };
  },
};
</script>

<style>
.text-xxs {
  font-size: xx-small;
}
</style>