
//* User variables
let discountRateSelected = 0; //user selects discount rate
let yearsSelected = 0; //user selects the number of years of projection

//CAGR
let cf = 0;
let endValue = 0;
let startValue = 0;


class Company{
    constructor(name, cfYear1, inBillions){
        this.name = name;
        this.cfYear1 = cfYear1;
        this.inBillions = inBillions;
    }
}

const companies = [
    new Company('Microsoft', 59475, true),
    new Company('Apple', 99584, true),
    new Company('Google', 69495, true)
];

document.getElementById('calculate-btn').addEventListener('click', getSelectedOptions);


//* Calculate
function getSelectedOptions(){

    const companySelect = document.getElementById('companySelect');
    const companySelectedValue = companySelect.value;

    //Metodos de array (antes era un switch)
    const selectedCompany = companies.find(company => company.name === companySelectedValue)
    console.log('selectedCompany: ' + selectedCompany.name)
    cf = selectedCompany.cfYear1;
    console.log('selectedCompany cf: ' + cf)

    const yearsSelect = document.getElementById('yearsSelect');
    const yearsSelectedValue = yearsSelect.value;
    //change global variable
    yearsSelected = yearsSelectedValue;
    console.log('Years selected: ' + yearsSelectedValue)

    const discountedRateSelect = document.getElementById('discountedRateSelect');
    const discountedRateSelectedValue = discountedRateSelect.value;
    //change global variable
    discountRateSelected = discountedRateSelectedValue;
    console.log('Discounted Rate Selected: ' + discountedRateSelectedValue)

    const initialInvestmentSelect = document.getElementById('initial-investment')
    const initialInvestmentSelectedValue = initialInvestmentSelect.value;
    console.log('your initial investment was: ' + initialInvestmentSelectedValue)

    if (!initialInvestmentSelectedValue){
        alert('please insert your initial investment')
    }

    let cagrResult = getCAGR();
    let finalInvestmentresult = getFinalInvestment(cagrResult, initialInvestmentSelectedValue);


    displayResult(cagrResult, finalInvestmentresult)
}

function getFinalInvestment(cagrResult, initialInvestmentSelectedValue){
    let finalInvestment = parseFloat(initialInvestmentSelectedValue);
    let cagrValue = parseFloat((cagrResult * finalInvestment / 100).toFixed(1));
    console.log('cagrValue: ' + cagrValue);


    for (let i = 1; i <= yearsSelected; i++){

        finalInvestment = finalInvestment + cagrValue;
        console.log('Investment year ' + i + ': ' + finalInvestment + 'USD');
    }

    return finalInvestment
}

function displayResult(cagrResult, finalInvestmentresult){
   document.getElementById("result").innerHTML = "Compounded Annual Growth Rate Expected: " + cagrResult + '%' + ', and initial investment compounds to: ' + finalInvestmentresult.toFixed(1) + 'USD over a period of: ' + yearsSelected + 'years'; 

}



//*DFC


function dfcFormula(){
    let DFC = 0;
    let discountRatePercentage = discountRateSelected / 100; //we make this a percentage

    for(let i = 1; i <= yearsSelected; i++ ){ // here we do a cicle for the number of years of projection, we declare i = 1 because we start in year 1

       DFC = DFC + (cf / ((1 + discountRatePercentage)**i)) // cash flow year / (1 + discount rate) elevated to iteration

       //console.log('DFC inside for year '+ i + ': ' +  DFC);

    }
    
    return DFC;
}

function getCAGR(){

    endValue =  dfcFormula()
    startValue = cf;

    let cagr = (endValue / startValue) ** (1 / yearsSelected) - 1;
    let cagrPercentage = (cagr * 100).toFixed(2)

    console.log('Compounded Annual Growth Rate: ' + cagrPercentage + '%')

    return cagrPercentage;
}


//* Chart.js

var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=MSFT&apikey=FR6DI9WAD3BV4ROT';

fetch(url)
  .then(response => {
    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); // Parse the JSON from the response
  })
  .then(data => {
    console.log('Stock data:', data); // Do something with the data
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });

console.log('stock api: ' + url)



const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar', // Tipo de gráfico
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# de votos',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true, // Allows height to change based on width

      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });