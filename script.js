let discountRateSelected = 0; //user selects discount rate
let yearsSelected = 0; //user selects the number of years of projection

//CAGR
let cf = 0;
let endValue;

/*
const Microsoft = {
    name: 'Microsoft', //name of the company
    cfYear1: 59475, //free cash flow of microsoft in 2023
    inBillions: true, // this defines if the company free cash flow is in millions or billions
}
*/



class Company{
    constructor(name, cfYear1, inBillions){
        this.name = name;
        this.cfYear1 = cfYear1;
        this.inBillions = inBillions;
    }
}



//Calculate
function getSelectedOptions(){

    const companySelect = document.getElementById('companySelect');
    const companySelectedValue = companySelect.value;
      
    if(companySelectedValue == 'Microsoft'){

        //we create the object and asign the global variable
        const microsoft = new Company('Microsoft', 59475, true)
        cf =  microsoft.cfYear1;

        console.log("company selected: " + companySelectedValue)

    } else if (companySelectedValue == 'Apple'){

        //we create the object and asign the global variable
        const apple = new Company('Apple', 99584, true)
        cf =  apple.cfYear1;
  
        console.log("company selected: " + companySelectedValue)

    } else if (companySelectedValue == 'Google'){

        //we create the object and asign the global variable
        const google = new Company('Google', 69495, true)
        cf =  google.cfYear1;
 
        console.log("company selected: " + companySelectedValue)

    }

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

    let result = getCAGR();

    document.getElementById("result").innerHTML = "Compounded Annual Growth Rate Expected: " + result + '%';

}



//DFC


function dfcFormula(){
    let DFC = 0;
    let discountRatePercentage = discountRateSelected / 100; //we make this a percentage

    for(let i = 1; i <= yearsSelected; i++ ){ // here we do a cicle for the number of years of projection, we declare i = 1 because we start in year 1

       DFC = DFC + (cf / ((1 + discountRatePercentage)**i)) // cash flow year / (1 + discount rate) elevated to iteration

       console.log('DFC inside for year '+ i + ': ' +  DFC);

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

