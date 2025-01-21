<template lang="">
    <div>
        <ChartTradeAnalysis/>
        <!-- <TVChart :candles="tradeCandles "/> -->
        <ChartTradeTV :candles="tradeCandles.value" :trades="tradesTV.data"/>
    </div>
</template>
<script>
import ChartTradeAnalysis from './Charts/ChartTradeAnalysis.vue';
import ChartTradeTV from './Charts/ChartTradeTV.vue';
import {tradeCandles, tradesTV, loadedTrade, tradeInfo} from "../stateJournal";
export default {
    components: {ChartTradeAnalysis,ChartTradeTV },
    setup(){
        return {
            ChartTradeAnalysis,
            ChartTradeTV,
            tradeCandles,
            tradesTV,
            loadedTrade,
            tradeInfo
        }
    }
}
</script>
<style lang="">
    
</style>