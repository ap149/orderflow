<template>
  <div
    class="grow overflow-y-auto overflow-x-auto text-xxs pb-8 fixed top-12 left-80 right-72 bottom-0 right-0 ml-2 "
  >
    <div v-for="(item, index) in ladder" :key="index" class="">
      <div v-if="item['filled']">
        <LadderRow :rowItem="item" />
      </div>
    </div>
  </div>
</template>

<script>
import { ladder } from "../stateOrderflow";
import LadderRow from "./LadderRow.vue";
export default {
  components: { LadderRow },
  setup() {
    return {
      LadderRow,
      ladder,
    };
  },
};
</script>

<style>
.scroller {
  height: 400px;
  overflow-y: auto;
}
.item {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
</style>