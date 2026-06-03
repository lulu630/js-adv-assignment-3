const catsContainer = document.querySelector("#cats-container");
// find the cat card section

const limitInput = document.querySelector("#limit-input");
// find the input that controls how many cats to show

const loadCatsBtn = document.querySelector("#load-cats-btn");
// find the button that loads cat breeds



async function getCats() {
  // create async function that loads cat breeds and images

  try {
    const limit = Number(limitInput.value);
    // get the number entered by the user
  
    const breedsResponse = await fetch("https://api.thecatapi.com/v1/breeds");
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
          `https://api.thecatapi.com/v1/images/search?breed_ids=${cat.id}`
        ); // request an image for the current breed

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

        <section>
          <h3>Origin</h3>
          <p>${cat.origin}</p>
        </section>

        <section class="cat-temperament">
          <h3>Temperament</h3>
          <p>${cat.temperament}</p>
        </section>

        <section>
          <h3>Description</h3>
          <p>${cat.description}</p>
        </section>
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
  
  }
}


loadCatsBtn.addEventListener("click", getCats);
// run function when button is clicked
