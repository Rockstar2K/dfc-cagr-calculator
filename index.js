let discountRateSelected = 10; //user selects discount rate
let yearsSelected = 5; //user selects the number of years of projection
let netPresentValue = 0;

const Microsoft = {
    name: 'Microsoft', //name of the company
    cfYear1: 59475, //free cash flow of microsoft in 2023
    inBillions: true, // this defines if the company free cash flow is in millions or billions

}


console.log('cfYear1: ' + Microsoft.cfYear1)


function formula(){
    let DFC = 0;
    let cf = Microsoft.cfYear1
    let discountRatePercentage = discountRateSelected / 100; //we make this a percentage

    for(let i = 1; i <= yearsSelected; i++ ){ // here we do a cicle for the number of years of projection, we declare i = 1 because we start in year 1

       DFC = DFC + (cf / ((1 + discountRatePercentage)**i)) // cash flow year / (1 + discount rate) elevated to iteration

       console.log('DFC inside for year '+ i + ': ' +  DFC);

    }

    let netPresentValue = DFC; // NPV is the sum of discounted cash flows
    
    console.log('DFC: ' + DFC);
    console.log('NPV: ' + netPresentValue);

    return DFC;
}

let endValue = formula();
let startValue = Microsoft.cfYear1;

let cagr = (endValue / startValue) ** (1 / yearsSelected) - 1;

console.log('CAGR: ' + (cagr * 100).toFixed(2) + '%')
