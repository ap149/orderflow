<template lang="">
<div class="container h-2 w-2 -rotate-90">
        <svg id="triangle" viewBox="0 0 20 20" :class="props.positive ? 'fill-teal-500' : 'fill-rose-500'">
            	<polygon points="10 3, 20 20, 0 20"/>
        </svg>
     </div>   
</template>
<script>
export default {
    props: {
    // Props definition is here
        positive: {
            type: Boolean,
            default: true,
            required: false,
        }
    },
    setup(props) {
        return {
            props
        }
    }
}
</script>
<style lang="">
    
</style>