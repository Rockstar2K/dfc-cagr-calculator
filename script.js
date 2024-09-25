

//* User variables
let discountRateSelected = 0;
let yearsSelected = 0; 
let initialInvestment = 0;


//CAGR
let cashFlow = 0;


let projectedStockPrice = 0;
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
  new Company("Microsoft", 59475, true, 'MSFT'),
  new Company("Apple", 99584, true, 'AAPL'),
  new Company("Google", 69495, true, 'GOOG'),
];

document
  .getElementById("calculate-btn")
  .addEventListener("click", getSelectedOptions);

//* Calculate
async function getSelectedOptions() {
  const companySelect = document.getElementById("companySelect");
  const companySelectedValue = companySelect.value;

  //Metodos de array (antes era un switch)
  const selectedCompany = companies.find(
    (company) => company.name === companySelectedValue
  );
  console.log("selectedCompany: " + selectedCompany.name);
  cashFlow = selectedCompany.cashFlow;
  console.log("selectedCompany cashFlow: " + cashFlow);

  const yearsSelect = document.getElementById("yearsSelect");
  yearsSelected = yearsSelect.value;
  console.log("Years selected: " + yearsSelected);

  const discountedRateSelect = document.getElementById("discountedRateSelect");
  discountRateSelected = discountedRateSelect.value;
  console.log("Discounted Rate Selected: " + discountRateSelected);

  const initialInvestmentSelect = document.getElementById("initial-investment");
  initialInvestment =  initialInvestmentSelect.value;
  console.log("your initial investment was: " + initialInvestment);

  if (!initialInvestment || initialInvestment == 0) {
    alert("please insert your initial investment");
  }

  let cagrPercentageResult = getCAGR();
  let finalInvestmentresult = getFinalInvestment(
    cagrPercentageResult,
    initialInvestment
  );

  let stock = selectedCompany.stockName;
  await getStockData(stock);
  console.log('awaited and current stock price is: ' + currentStockPrice)
  stockPriceCagrProjection(cagrPercentageResult);
  displayResult(cagrPercentageResult, finalInvestmentresult);
}

//* Final Investment Calculation

function getFinalInvestment(cagrResult, initialInvestment) {
  let finalInvestment = parseFloat(initialInvestment);
  let cagrValue = parseFloat(((cagrResult * finalInvestment) / 100).toFixed(1));
  console.log("cagrValue: " + cagrValue);

  for (let i = 1; i <= yearsSelected; i++) {
    finalInvestment = finalInvestment + cagrValue;
    console.log("Investment year " + i + ": " + finalInvestment + "USD");
  }

  return finalInvestment;
}

//* Display result

function displayResult(cagrPercentageResult, finalInvestmentresult) {
  document.getElementById("result").innerHTML =
    "Compounded Annual Growth Rate Expected: " +
    cagrPercentageResult +
    "%" +
    ", and initial investment compounds to: " +
    finalInvestmentresult.toFixed(1) +
    "USD over a period of: " +
    yearsSelected +
    "years";
}

//* Stock Price projected with CAGR

function stockPriceCagrProjection(cagr) {
  cagr = cagr / 100;
  projectedStockPrice = currentStockPrice; // Start with current price

  for (let i = 1; i <= yearsSelected; i++) {
    projectedStockPrice = currentStockPrice * cagr;
  }

  console.log('FINAL STOCK PRICE: ' + projectedStockPrice)
}

//*DFC

function dfcFormula() {
  let DFC = 0;
  let discountRatePercentage = discountRateSelected / 100; //we make this a percentage

  for (let i = 1; i <= yearsSelected; i++) {

    DFC = DFC + cashFlow / (1 + discountRatePercentage) ** i; // cash flow year / (1 + discount rate) elevated to iteration
    //console.log('DFC inside for year '+ i + ': ' +  DFC);
  }

  return DFC;
}

function getCAGR() {
  let endValue = dfcFormula();
  let startValue = cashFlow;

  let cagr = (endValue / startValue) ** (1 / yearsSelected) - 1;
  let cagrPercentage = (cagr * 100).toFixed(2);

  console.log("Compounded Annual Growth Rate: " + cagrPercentage + "%");

  return cagrPercentage;
}

//* STOCK DATA (lo que más tiempo me tomo :P)

let stockData = {};

async function getStockData(stock) {
  const baseUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=";
  const apiKey = "&apikey=FR6DI9WAD3BV4ROT";
  const url = `${baseUrl}${stock}${apiKey}`; 
  
  await fetchStockData(url, stock); 
  
  console.log('All stock data:', stockData); 

  // Now update the chart after fetching data for a stock
  updateChart(stock);


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

    if (data.Information) { //?esta es la estructura del objeto que llega cuando se acaba el limite de la API
      console.warn(`API limit hit for ${stockSymbol}: ${data.Information}`);
      return; // Don't update the data
    } else{ //update data
      storeRightStockData(stockSymbol, data)
    }

  } catch (error) {
    console.error(`There has been a problem fetching data for ${stockSymbol}:`, error);
  }
}

function storeRightStockData(stockSymbol, data) {
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

  console.log('currentStockPrice: ' + currentStockPrice);

}

//* CHART.JS

function updateChart(stockSymbol) {
  const dates = stockData[stockSymbol].dates;
  const closePrices = stockData[stockSymbol].closePrices;

  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line', 
    data: {
      labels: dates, // Dates as x-axis labels
      datasets: [{
        label: `${stockSymbol.toUpperCase()} Monthly Close Prices`,
        data: closePrices, // Close prices as the data
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: {
          type: 'time', 
          time: {
            unit: 'month', 
          }
        }
      }
    }
  });
}
