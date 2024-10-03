
export function updateChart(stockSymbol, stockData) {
console.log('chart JS');

    try {
      const dates = stockData[stockSymbol].dates;
      const closePrices = stockData[stockSymbol].closePrices;
  
      const ctx = document.getElementById("myChart").getContext("2d");
      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates, // Dates as x-axis labels
          datasets: [
            {
              label: `${stockSymbol.toUpperCase()} Monthly Close Prices`,
              data: closePrices, // Close prices as the data
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
    } catch (error) {
      console.log(error);
    }
  }
  