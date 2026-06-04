// ================= BUTTONS =================
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

// ================= INPUT =================
const searchInput = document.getElementById("searchInput");

// ================= RESULTS =================
const resultsContainer = document.getElementById("recommendation-results");

// ================= SECTIONS =================
const homeSection = document.getElementById("home");
const aboutSection = document.getElementById("about");
const contactSection = document.getElementById("contact");
const resultsSection = document.getElementById("results-section");

// ================= VIEW CONTROLLER =================
function showOnly(sectionToShow) {
  const sections = [homeSection, aboutSection, contactSection, resultsSection];

  sections.forEach(section => {
    if (section) section.classList.add("hidden");
  });

  if (sectionToShow) sectionToShow.classList.remove("hidden");
}

// ================= INITIAL STATE =================
showOnly(homeSection);

// ================= NAVIGATION (SAFE BINDING) =================
document.addEventListener("DOMContentLoaded", () => {

  const homeLink = document.querySelector('a[href="#home"]');
  const aboutLink = document.querySelector('a[href="#about"]');
  const contactLink = document.querySelector('a[href="#contact"]');

  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      showOnly(homeSection);
    });
  }

  if (aboutLink) {
    aboutLink.addEventListener("click", (e) => {
      e.preventDefault();
      showOnly(aboutSection);
    });
  }

  if (contactLink) {
    contactLink.addEventListener("click", (e) => {
      e.preventDefault();
      showOnly(contactSection);
    });
  }

});

// ================= FETCH DATA =================
async function fetchRecommendations() {
  try {
    const response = await fetch("travel_recommendation_api.json");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// ================= LOCAL TIME =================
function getLocalTime(timeZone) {
  const options = {
    timeZone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };

  return new Date().toLocaleTimeString("en-US", options);
}

// ================= DISPLAY RESULTS =================
function displayResults(results) {

  resultsContainer.innerHTML = "";

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = `<h2>No recommendations found.</h2>`;
    return;
  }

  results.forEach(item => {
    const resultHTML = `
      <div class="result-card">
        <img src="${item.imageUrl}" alt="${item.name}">
        <div class="card-content">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          ${item.time ? `<p class="time">Local Time: ${item.time}</p>` : ""}
        </div>
      </div>
    `;

    resultsContainer.innerHTML += resultHTML;
  });
}

// ================= SEARCH =================
searchBtn.addEventListener("click", async () => {

  const keyword = searchInput.value.toLowerCase().trim();
  const data = await fetchRecommendations();

  if (!data) return;

  let matchedResults = [];

  if (keyword === "beach" || keyword === "beaches") {
    matchedResults = data.beaches;
  }

  else if (keyword === "temple" || keyword === "temples") {
    matchedResults = data.temples;
  }
  
  else {

    const seen = new Set();
  
    data.countries.forEach(country => {
  
      const countryMatch =
        country.name.toLowerCase().includes(keyword);
  
      country.cities.forEach(city => {
  
        const cityMatch =
          city.name.toLowerCase().includes(keyword);
  
        if (countryMatch || cityMatch) {
  
          const key = city.name;
  
          if (!seen.has(key)) {
            seen.add(key);
  
            matchedResults.push({
              ...city,
              time: getLocalTime(country.timeZone)
            });
          }
        }
      });
  
    });
  
  }
  showOnly(resultsSection);
  displayResults(matchedResults);

  resultsSection.scrollIntoView({ behavior: "smooth" });
});

// ================= RESET =================
resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  resultsContainer.innerHTML = "";
  showOnly(homeSection);
  homeSection.scrollIntoView({ behavior: "smooth" });
});