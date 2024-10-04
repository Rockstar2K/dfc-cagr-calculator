let myChart; // Declare a variable to hold the chart instance

export function updateChart(stockSymbol, stockData, futureStockPrice, futureDate) {
  console.log('chart JS');

  try {
    const dates = stockData[stockSymbol].dates;
    const closePrices = stockData[stockSymbol].closePrices;

    // Add the future date and future stock price to the arrays
    const updatedDates = [...dates, futureDate]; // Add future date
    const updatedClosePrices = [...closePrices, futureStockPrice]; // Add future stock price

    // Get the context of the canvas element
    const ctx = document.getElementById("myChart").getContext("2d");

    // Check if the chart instance already exists
    if (myChart) {
      // Update the existing chart data
      myChart.data.labels = updatedDates; // Use updated dates with future date
      myChart.data.datasets[0].data = updatedClosePrices; // Use updated close prices
      myChart.data.datasets[0].label = `${stockSymbol.toUpperCase()} Monthly Close Prices`; // Update label

      myChart.update();  
    } else {
      // Create a new chart instance if it doesn't exist
      myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: updatedDates, // Use updated dates with future date
          datasets: [
            {
              label: `${stockSymbol.toUpperCase()} Monthly Close Prices`,
              data: updatedClosePrices, // Use updated close prices
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
