# Klyaksonchik Design Studio website

A static one-page website ready for GitHub Pages.

## Add the portfolio videos

Open `script.js`. At the top of the file, replace each empty `youtubeId` value:

```js
youtubeId: "YOUR_VIDEO_ID"
```

Use only the YouTube ID:

- `https://www.youtube.com/watch?v=ABC123` → `ABC123`
- `https://youtu.be/ABC123` → `ABC123`

The site uses privacy-enhanced YouTube embeds from `youtube-nocookie.com`.

## Publish with GitHub Pages

1. Upload every file and folder from this directory to the root of a GitHub repository.
2. Open the repository’s **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder.
5. Save.

No build step, package installation, database, or server is required.

## Contact form

The form does not store or transmit data to a server. It creates a pre-filled
WhatsApp message for `+382 68 480 723` and opens WhatsApp in a new tab.

## Files

- `index.html` — page content and metadata
- `styles.css` — responsive layout and animation
- `script.js` — YouTube projects, mobile navigation, reveals, and WhatsApp form
- `assets/` — logo, social preview image, favicon, and local fonts
- `.nojekyll` — prevents GitHub Pages from changing the static file structure

