const catsContainer = document.querySelector("#cats-container");
// find the cat card section

const limitInput = document.querySelector("#limit-input");
// find the input that controls how many cats to show

const loadCatsBtn = document.querySelector("#load-cats-btn");
// find the button that loads cat breeds


async function getCats() {
  // create async function that loads cat breeds and images

  try {
    if (!window.CAT_API_BASE_URL) {
      catsContainer.textContent = "Cat service is not connected yet. Please try again later.";
      return;
    }

    if (!limitInput.reportValidity()) return;
    const limit = Number(limitInput.value);
    if (!Number.isInteger(limit) || limit < 1 || limit > 20) return;

    loadCatsBtn.disabled = true;
    catsContainer.textContent = "Loading cats…";
    // get the number entered by the user
  
    const breedsResponse = await fetch(`${window.CAT_API_BASE_URL.replace(/\/$/, "")}/v1/breeds`);
    // request all cat breeds from the api

    if (!breedsResponse.ok) {
      throw new Error("Could not load cat breeds");
    }

    const breeds = await breedsResponse.json();
    // convert the response into the js array

    const selectedBreeds = breeds.slice(0, limit);
    // keep only the number of breeds requested by the user

    catsContainer.innerHTML = "";
    // clear previous cards before rendering new ones

    const catCards = await Promise.all(
      selectedBreeds.map(async function (cat) {
        // create a promise for each breed

        const imageResponse = await fetch(
          `${window.CAT_API_BASE_URL.replace(/\/$/, "")}/v1/images/search?breed_ids=${encodeURIComponent(cat.id)}`
        ); // request an image for the current breed

        if (!imageResponse.ok) {
          throw new Error("Could not load cat image");
        }

        const imageData = await imageResponse.json();
        // convert the image response into a javascript array

        const imageUrl = imageData[0]?.url || "";
        // prevent errors if no image is returned

        const catCard = document.createElement("article");
        // create a card for the current breed

        catCard.classList.add("cat-card");
        // add a css class to the card

        catCard.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="${cat.name}">` : ""}
        <h2>${cat.name}</h2>
        <h3>📍 ${cat.origin}</h3>
        <p class="cat-life">⏳ ${cat.life_span} years</p>
        <p class="cat-temp">${cat.temperament}</p>
        <p>${cat.description}</p>
      `;
        // add breed information and image

        return catCard;
        // return finished card
      })
    );

    catsContainer.append(...catCards);
    // add all cards to the page after every request is finished

  } catch (error) {
    catsContainer.innerHTML = "<p>Could not load cats. Please try again.</p>";
  } finally {
    loadCatsBtn.disabled = false;
  }
}

loadCatsBtn.addEventListener("click", getCats);
// run function when button is clicked
