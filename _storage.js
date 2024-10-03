//* save to history
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

export function saveToHistory( selectedCompany, yearsSelected, discountRateSelected, initialInvestment, finalInvestment,cagrPercentageResult) {
    
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



export function showHistory() {
  
  if (searchHistory.length > 0) { //add to history toggle

    toggleContent.innerHTML = "";

    searchHistory.forEach((search, index) => {
      const searchItem = `
        <div class="history-individual-container">
          <p>${search.companyHistory} <strong>#${index + 1}</strong></p>
          <p>Years: <strong>${search.yearsHistory}</strong></p>
          <p>Initial Investment: <strong>${search.initialInvestmentHistory} USD</strong></p>
          <p>Discount Rate: <strong>${search.discountRateHistory} %</strong></p>
          <p>Final Investment: <strong>${search.finalInvestmentHistory.toFixed(0)} USD</strong></p>
          <p>CAGR: <strong>${search.cagrHistory}%</strong></p>
          
          <button class="close-history" data-index="${index}">x</button>
        </div>
      `;
      toggleContent.innerHTML += searchItem;
    });

    const closeButtons = document.querySelectorAll('.close-history');
    closeButtons.forEach(button => {
      button.addEventListener('click', deleteHistory);
    });
  } else {
    toggleContent.innerHTML = "<p>No search history available.</p>";
  }
}

function deleteHistory(event) {
    const index = event.target.getAttribute('data-index'); // Get the index from the button's data attribute
  
    // Remove the entry from searchHistory
    searchHistory.splice(index, 1);

    // Update localStorage after deletion
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  
    // Show the updated history
    showHistory(); // Call showHistory again to refresh the display
  }




