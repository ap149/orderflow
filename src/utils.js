const formatCurrency = (number) => {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,  // Minimum fraction digits
        maximumFractionDigits: 0   // Maximum fraction digits
      }).format(number);
}

const formatDate = (date) => {
  let dt = new Date(date)
  let res = new Intl.DateTimeFormat("en-GB", {
    weekday: "short", // Abbreviated weekday (e.g., "Wed")
    day: "numeric",   // Day of the month (e.g., "8")
    month: "short",   // Abbreviated month (e.g., "Jan")
    // hour: "numeric",
    // minute: "numeric",
    // second: "numeric",    
  }).format(dt);
  return res
} 
const formatTime = (date) => {
  let dt = new Date(date)
  let res = new Intl.DateTimeFormat("en-GB", {
    // weekday: "short", // Abbreviated weekday (e.g., "Wed")
    // day: "numeric",   // Day of the month (e.g., "8")
    // month: "short",   // Abbreviated month (e.g., "Jan")
    hour: "numeric",
    minute: "numeric",
    second: "numeric",    
  }).format(dt);
  return res
} 
  
const formatNumber = (num) => {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1, // Ensure at least 1 decimal place
    maximumFractionDigits: 1, // Ensure no more than 1 decimal place
  }).format(num);
  return formattedNumber  
}

const timeDiff = (t1, t2) => {
  const date1 = new Date(t1);
  const date2 = new Date(t2);
  
  // Calculate the difference in milliseconds
  const diffInMs = Math.abs(date2 - date1);
  
  // Convert to minutes and seconds
  const diffInSeconds = Math.floor(diffInMs / 1000); // Total seconds
  const minutes = Math.floor(diffInSeconds / 60); // Extract minutes
  const seconds = diffInSeconds % 60; // Extract remaining seconds
  
  // Format as "Xm Ys"
  return `${minutes}m ${seconds}s`; 
}

const getUTC = (iso) => {
  return new Date(iso).getTime()
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export {
    formatCurrency,
    formatDate,
    formatTime,
    timeDiff,
    formatNumber,
    getUTC, delay
}