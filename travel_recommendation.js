// Search button
const searchBtn = document.getElementById("searchBtn");

// Reset button
const resetBtn = document.getElementById("resetBtn");

// Search input
const searchInput = document.getElementById("searchInput");

// Results container
const resultsContainer = document.getElementById("recommendation-results");


// Fetch JSON data
async function fetchRecommendations() {

  try {

    const response = await fetch('travel_recommendation_api.json');

    const data = await response.json();

    console.log(data);

    return data;

  } catch (error) {

    console.error('Error fetching data:', error);

  }

}


// Display recommendations
function displayResults(results) {

  resultsContainer.innerHTML = "";

  results.forEach(item => {

    const resultHTML = `
      <div class="result-card">

        <img src="${item.imageUrl}" alt="${item.name}">

        <h3>${item.name}</h3>

        <p>${item.description}</p>

      </div>
    `;

    resultsContainer.innerHTML += resultHTML;

  });

}


// Search functionality
// Search button
searchBtn.addEventListener('click', async () => {

    // Convert input to lowercase
    let keyword = searchInput.value.toLowerCase().trim();
  
    // Fetch JSON data
    const data = await fetchRecommendations();
  
    let matchedResults = [];
  
    // Handle keyword variations
    if (keyword === "beach" || keyword === "beaches") {
  
      matchedResults = data.beaches;
  
    }
  
    else if (keyword === "temple" || keyword === "temples") {
  
      matchedResults = data.temples;
  
    }
  
    else {
  
      // Search countries and cities
      data.countries.forEach(country => {
  
        // Match country names
        if (country.name.toLowerCase().includes(keyword)) {
  
          matchedResults.push(...country.cities);
  
        }
  
        // Match city names
        country.cities.forEach(city => {
  
          if (city.name.toLowerCase().includes(keyword)) {
  
            matchedResults.push(city);
  
          }
  
        });
  
      });
  
    }
  
    // Display results
    displayResults(matchedResults);
  
  });


// Reset functionality
resetBtn.addEventListener('click', () => {

  searchInput.value = "";

  resultsContainer.innerHTML = "";

});