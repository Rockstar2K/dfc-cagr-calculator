//* User variables
let discountRateSelected = 0;
let yearsSelected = 0;
let initialInvestment = 0;

let currentStockPrice = 0;

class Company {
  constructor(name, cashFlow, inBillions, stockName) {
    this.name = name;
    this.cashFlow = cashFlow;
    this.inBillions = inBillions;
    this.stockName = stockName;
  }
}

const companies = [
  new Company("Microsoft", 59475, true, "MSFT"),
  new Company("Apple", 99584, true, "AAPL"),
  new Company("Google", 69495, true, "GOOG"),
];

document
  .getElementById("calculate-btn")
  .addEventListener("click", getSelectedOptions);

//* Calculate
async function getSelectedOptions() {
  let companyName = "";
  let cashFlow = 0;
  let yearsSelected = 0;
  let discountRateSelected = 0;
  let initialInvestment = 0;
  let stock = ";";

  const companySelect = document.getElementById("companySelect");
  const companySelectedValue = companySelect.value;

  //Metodos de array (antes era un switch)
  const selectedCompany = companies.find(
    (company) => company.name === companySelectedValue
  );
  companyName = selectedCompany.name;

  console.log("selectedCompany: " + selectedCompany.name);
  cashFlow = parseInt(selectedCompany.cashFlow, 10);

  const yearsSelect = document.getElementById("yearsSelect");
  yearsSelected = parseInt(yearsSelect.value, 10);

  const discountedRateSelect = document.getElementById("discountedRateSelect");
  discountRateSelected = parseInt(discountedRateSelect.value, 10);

  const initialInvestmentSelect = document.getElementById("initial-investment");
  initialInvestment = parseInt(initialInvestmentSelect.value);

  stock = selectedCompany.stockName;

  console.log(
    " selectedCompany: " +
      selectedCompany.name +
      " selectedCompany cashFlow: " +
      cashFlow +
      " Years selected: " +
      yearsSelected +
      " Discounted Rate Selected: " +
      discountRateSelected +
      " your initial investment was: " +
      initialInvestment
  );

  if (isNaN(initialInvestment) || initialInvestment <= 0) {
    alert("Please insert a valid initial investment");
    return; // Exit the function
  }

  let endValue = dfcFormula(discountRateSelected, yearsSelected, cashFlow);
  let cagrPercentageResult = getCAGR(cashFlow, endValue, yearsSelected);
  let finalInvestmentResult = getFinalInvestment(
    cagrPercentageResult,
    initialInvestment,
    yearsSelected
  );

  await getStockData(stock);

  let futureStockPrice = stockPriceCagrProjection(cagrPercentageResult);
  updateChart(stock);

  //!updateChart(stock, futureStockPrice);
  displayResult(cagrPercentageResult, initialInvestment, finalInvestmentResult);

  saveToHistory(
    companyName,
    yearsSelected,
    discountRateSelected,
    initialInvestment,
    finalInvestmentResult,
    cagrPercentageResult
  );
  showHistory();
}

//* save to history
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

function saveToHistory(
  selectedCompany,
  yearsSelected,
  discountRateSelected,
  initialInvestment,
  finalInvestment,
  cagrPercentageResult
) {
  let search = {
    companyHistory: selectedCompany,
    yearsHistory: yearsSelected,
    initialInvestmentHistory: initialInvestment,
    discountRateHistory: discountRateSelected,
    finalInvestmentHistory: finalInvestment,
    cagrHistory: cagrPercentageResult,
  };

  searchHistory.push(search);

  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  console.log("Updated search history:", searchHistory);
}

const toggleBtn = document.getElementById("toggleHistoryBtn");
const toggleContent = document.getElementById("toggleHistoryContent");

toggleBtn.addEventListener("click", function () {
  // Toggle the visibility of the content
  if (toggleContent.style.display === "none") {
    toggleContent.style.display = "block";
    toggleBtn.textContent = "Hide History"; // Change button text
  } else {
    toggleContent.style.display = "none";
    toggleBtn.textContent = "Show History"; // Change button text
  }
});

showHistory();
function showHistory() {
  
  if (searchHistory.length > 0) { //add to history toggle

    toggleContent.innerHTML = "";

    searchHistory.forEach((search, index) => {
      const searchItem = `
        <div>
          <p>${search.companyHistory} <strong>#${index + 1}</strong></p>
          <p>Years: ${search.yearsHistory}</p>
          <p>Initial Investment: <strong>${search.initialInvestmentHistory} USD</strong></p>
          <p>Discount Rate: <strong>${search.discountRateHistory} %</strong></p>
          <p>Final Investment: <strong>${search.finalInvestmentHistory.toFixed(0)} USD</strong></p>
          <p>CAGR: <strong>${search.cagrHistory}%</strong></p>
        </div><hr>
      `;
      toggleContent.innerHTML += searchItem;
    });
  } else {
    toggleContent.innerHTML = "<p>No search history available.</p>";
  }
}

//* Final Investment Calculation
function getFinalInvestment(cagrResult, initialInvestment, yearsSelected) {
  let finalInvestment = initialInvestment; // Start with the initial investment
  let cagrDecimal = cagrResult / 100; // Convert CAGR from percentage to decimal

  console.log("Initial Investment: " + finalInvestment + " USD");

  for (let i = 1; i <= yearsSelected; i++) {
    finalInvestment *= 1 + cagrDecimal; // Compound the investment each year
    console.log(
      "Investment year " + i + ": " + finalInvestment.toFixed(2) + " USD"
    );
  }

  return finalInvestment; // Return the final investment after all years
}

//* Display result

function displayResult(
  cagrPercentageResult,
  initialInvestment,
  finalInvestmentResult
) {
  let cagrClass;
  if (cagrPercentageResult >= 25) {
    cagrClass = "green"; // Green
  } else if (cagrPercentageResult >= 10) {
    cagrClass = "yellow"; // Yellow
  } else if (cagrPercentageResult < 10) {
    cagrClass = "red"; // Red
  }

  let finalInvestmentClass;
  if (finalInvestmentResult > initialInvestment) {
    finalInvestmentClass = "green";
  } else {
    finalInvestmentClass = "red";
  }

  document.getElementById("display-investment").innerHTML = `
    <p id="display-investment_initial-investment"> Initial Investment: </br><b>${initialInvestment} USD </b></p>
    <p id="display-investment_final-investment"> Final Investment: </br><b class="${finalInvestmentClass}">${finalInvestmentResult.toFixed(
    0
  )} USD </b></p>
    <p id="display-investment_cagr"> CAGR: </br><b class="${cagrClass}">${cagrPercentageResult} %</b></p>
  `;
}

//* Stock Price projected with CAGR

function stockPriceCagrProjection(cagr) {
  try {
    cagr = cagr / 100;
    projectedStockPrice = currentStockPrice; // Start with current price

    for (let i = 1; i <= yearsSelected; i++) {
      projectedStockPrice *= 1 + cagr; // Update with compounding
    }

    console.log("FINAL STOCK PRICE: " + projectedStockPrice);
    return projectedStockPrice;
  } catch (error) {
    console.log(error);
  }
}

//*DFC

function dfcFormula(discountRateSelected, yearsSelected, cashFlow) {
  let DFC = 0;
  let discountRatePercentage = discountRateSelected / 100; //we make this a percentage

  for (let i = 1; i <= yearsSelected; i++) {
    DFC = DFC + cashFlow / (1 + discountRatePercentage) ** i; // cash flow year / (1 + discount rate) elevated to iteration
    console.log("DFC inside for year " + i + ": " + DFC);
  }

  return DFC;
}

function getCAGR(startValue, endValue, yearsSelected) {
  let cagr = (endValue / startValue) ** (1 / yearsSelected) - 1;
  let cagrPercentage = (cagr * 100).toFixed(2);

  console.log("Compounded Annual Growth Rate: " + cagrPercentage + "%");

  return cagrPercentage;
}

//* STOCK DATA (lo que más tiempo me tomo :P)

let stockData = {};

async function getStockData(stock) {
  const baseUrl =
    "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=";
  const apiKey = "&apikey=FR6DI9WAD3BV4ROT";
  const url = `${baseUrl}${stock}${apiKey}`;

  await fetchStockData(url, stock);

  console.log("All stock data:", stockData);
}

// Function to fetch data for each stock symbol
async function fetchStockData(url, stockSymbol) {
  try {
    const response = await fetch(url); // Await the fetch call
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json(); // Await the parsing of the JSON data
    console.log(`Stock data for ${stockSymbol}:`, data);

    if (data.Information) {
      //?esta es la estructura del objeto que llega cuando se acaba el limite de la API
      console.warn(`API limit hit for ${stockSymbol}: ${data.Information}`);
      return; // Don't update the data
    } else {
      //update data
      storeRightStockData(stockSymbol, data);
    }
  } catch (error) {
    console.error(
      `There has been a problem fetching data for ${stockSymbol}:`,
      error
    );
  }
}

function storeRightStockData(stockSymbol, data) {
  try {
    // Initialize stockData entry for this stockSymbol if it doesn't exist
    if (!stockData[stockSymbol]) {
      stockData[stockSymbol] = { closePrices: [], dates: [] };
    }

    // Access the 'Monthly Time Series' object directly from the response data
    const timeSeries = data["Monthly Adjusted Time Series"];

    // Loop through the dates in 'Monthly Time Series' and extract the 'close' prices
    for (const date in timeSeries) {
      if (timeSeries.hasOwnProperty(date)) {
        stockData[stockSymbol].dates.push(date); // Store the dates
        stockData[stockSymbol].closePrices.push(timeSeries[date]["4. close"]); // Store the 'close' prices

        currentStockPrice = parseFloat(timeSeries[date]["4. close"]); // Parse to float
      }
    }

    console.log("currentStockPrice: " + currentStockPrice);
  } catch (error) {
    console.log(error);
  }
}

//* CHART.JS

function updateChart(stockSymbol) {
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
