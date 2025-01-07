import axios from 'axios'
import {options, selectedMarket } from "./state.js"



const placeOrder = async (px, sell=true) => {
  // console.log("placing order...: ", px, options.size)
  const stop = sell ? (parseFloat(px) + parseFloat(options.stop)).toFixed(2) : (parseFloat(px) - parseFloat(options.stop)).toFixed(2)
  const limit = sell ? (parseFloat(px) - parseFloat(options.limit)).toFixed(2) : (parseFloat(px) + parseFloat(options.limit)).toFixed(2)
  console.log("placing order...: ")
  console.log("px: ", px)
  console.log("sell: ", sell)
  console.log("size: ", options.size)
  console.log("stop: ", stop)
  console.log("limit: ", limit)
  fetch('http://127.0.0.1:5000/',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // Your data here
      price: px,
      size: options.size,
      stop: stop,
      limit: limit,
      market: selectedMarket.selectedMarket,
      tradeModeID: sell,
    }),    
    // mode: 'no-cors',
  })
  .then(response => {
    if (!response.ok) {
      console.log(response)
      throw new Error('Network response was not ok');
    }
    return response.json(); // Assuming the response is JSON
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}

export { placeOrder }