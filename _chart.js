let myChart; // Declare a variable to hold the chart instance

export function updateChart(stockSymbol, stockData, futureStockPrice, yearsSelected) {
  console.log('chart JS future stock pirce: ' + futureStockPrice);

  try {
    const dates = stockData[stockSymbol].dates.map(date => new Date(date)); // Convert to Date objects
    const closePrices = stockData[stockSymbol].closePrices;


    
    // Calculate future date
    const lastDate = dates[0]; // Get the last date from the existing dates
    console.log('LAST DATE: ' + lastDate);
    const futureDate = new Date(lastDate.setFullYear(lastDate.getFullYear() + yearsSelected)); // Add selected years to the last date


    // Add the future date and future stock price to the arrays
    const updatedDates = [...dates, futureDate]; // Append future date
    const updatedClosePrices = [...closePrices, futureStockPrice]; // Append future stock price

    // Sort the dates and close prices based on date order
    const sortedData = updatedDates.map((date, index) => ({ date, price: updatedClosePrices[index] }))
    .sort((a, b) => a.date - b.date); // Sort by date


    const finalDates = sortedData.map(item => item.date);
    const finalClosePrices = sortedData.map(item => item.price);


    // Get the context of the canvas element
    const ctx = document.getElementById("myChart").getContext("2d");

    // Check if the chart instance already exists
    if (myChart) {
      // Update the existing chart data
      myChart.data.labels = finalDates; // Use updated dates with future date
      myChart.data.datasets[0].data = finalClosePrices; // Use updated close prices
      myChart.data.datasets[0].label = `${stockSymbol.toUpperCase()} Monthly Close Prices`; // Update label

      myChart.update();  
    } else {
      // Create a new chart instance if it doesn't exist
      myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: finalDates, // Use updated dates with future date
          datasets: [
            {
              label: `${stockSymbol.toUpperCase()} Monthly Close Prices`,
              data: finalClosePrices, // Use updated close prices
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: false,
              tension: 0.1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: "month",
              },
            },
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}
