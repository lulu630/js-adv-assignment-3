# Cat Breed Explorer

A small educational project built with HTML, CSS, and JavaScript for exploring cat breeds.

## Description

The app loads cat breed data from [The Cat API](https://thecatapi.com/) and displays cards with an image, breed name, origin, life span, temperament, and description.

Users can choose how many breeds to display and click the **Load** button.

## Technologies

- HTML
- CSS
- JavaScript
- Fetch API
- The Cat API

## Publish with GitHub Pages

The frontend runs on GitHub Pages. A separate Cloudflare Worker calls The Cat API
with a secret key. The browser receives data, never the key.

1. In the [Cloudflare dashboard](https://dash.cloudflare.com/), open **Workers & Pages**,
   create a Worker (the Hello World starter is sufficient), and deploy it.
2. Open **Edit code**, replace the starter code with the contents of
   `worker/worker.mjs`, and deploy the change.
3. In the Worker's **Settings → Variables and Secrets**, add a variable of type
   **Secret** named `CAT_API_KEY`. Paste your actual The Cat API key as its value
   and deploy/save the change. Do not paste the key into the Worker source code.
4. Copy the Worker's public URL (for example `https://cat-api.example.workers.dev`).
   Open that URL with `/v1/breeds` appended: it should return a JSON array of breeds.
5. Paste the base URL, without `/v1/breeds`, into `api-config.js`:

   ```js
   window.CAT_API_BASE_URL = "https://cat-api.example.workers.dev";
   ```

6. Commit and push the project. In the GitHub repository's **Settings → Pages**,
   select the branch and folder containing `index.html` as the publishing source.
7. Open the GitHub Pages site and click **Load**. Test again in a private browser
   window to confirm it works without your local files.

The URL in `api-config.js` is public and safe to commit. `config.js` contains the
previous local key, remains ignored by Git, and is no longer loaded by the site.
Never upload that file manually. After setting the Worker secret, you can delete
that local file if you no longer need it.

The Worker is a public read-only endpoint. Successful responses are cached for one
hour to reduce API usage; caching is not a hard quota or abuse limit.

## Local preview

After configuring the Worker URL, open `index.html` in a browser or use Live Server.
An internet connection and the deployed Worker are required.

## Deployment references

- [Create a Worker in the dashboard](https://developers.cloudflare.com/workers/get-started/dashboard/)
- [Configure Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

## Features

- loads cat breeds from an API;
- lets the user choose the number of cards;
- displays an image and key information about each breed;
- shows an error message if the data cannot be loaded.
