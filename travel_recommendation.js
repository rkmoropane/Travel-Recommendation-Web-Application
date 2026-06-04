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
  
    const headingColor = "#ffb6c1"; // light pink
  
    if (!results || results.length === 0) {
  
      resultsContainer.innerHTML = `
        <h2 style="color:${headingColor}; text-align:center;">
          No recommendations found.
        </h2>
      `;
  
      return;
    }
  
    // 🔥 Add heading FIRST
    resultsContainer.innerHTML = `
      <h2 style="
        color:${headingColor};
        text-align:center;
        margin-bottom:20px;
        font-size:32px;
      ">
        Search Results
      </h2>
    `;
  
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
    const seen = new Set();
  
    // ================= COUNTRY → SHOW ALL =================
    if (keyword === "country" || keyword === "countries") {
  
      data.countries.forEach(country => {
        country.cities.forEach(city => {
  
          if (!seen.has(city.name)) {
            seen.add(city.name);
  
            matchedResults.push({
              ...city,
              time: getLocalTime(country.timeZone)
            });
          }
        });
      });
  
    }
  
    // ================= CITY → SHOW ALL =================
    else if (keyword === "city" || keyword === "cities") {
  
      data.countries.forEach(country => {
        country.cities.forEach(city => {
  
          if (!seen.has(city.name)) {
            seen.add(city.name);
  
            matchedResults.push({
              ...city,
              time: getLocalTime(country.timeZone)
            });
          }
        });
      });
  
    }
  
    // ================= BEACHES =================
    else if (keyword === "beach" || keyword === "beaches") {
      matchedResults = data.beaches;
    }
  
    // ================= TEMPLES =================
    else if (keyword === "temple" || keyword === "temples") {
      matchedResults = data.temples;
    }
  
    // ================= NORMAL SEARCH =================
    else {
  
      data.countries.forEach(country => {
  
        const countryMatch =
          country.name.toLowerCase().includes(keyword);
  
        const cityMatches = country.cities.filter(city =>
          city.name.toLowerCase().includes(keyword)
        );
  
        // If country matches → show ALL its cities
        if (countryMatch) {
          country.cities.forEach(city => {
  
            if (!seen.has(city.name)) {
              seen.add(city.name);
  
              matchedResults.push({
                ...city,
                time: getLocalTime(country.timeZone)
              });
            }
          });
        }
  
        // If city matches → show only matched cities
        cityMatches.forEach(city => {
  
          if (!seen.has(city.name)) {
            seen.add(city.name);
  
            matchedResults.push({
              ...city,
              time: getLocalTime(country.timeZone)
            });
          }
        });
  
      });
    }
  
    // ================= UI UPDATE =================
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