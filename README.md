# Love Lab 💗 — Full Prank Edition

A romantic, funny, **mobile-friendly** single-page prank based on the original “Do you love me?” game. It preserves the liquid-glass buttons, but upgrades the experience to personalised share links, escalating No-button escapes, and a cinematic Yes finale.

## Try it

Open `index.html` in a browser to preview it, or publish it as a static site. No framework, database, account, backend, or build command is required.

**Create a link:** Open the live hosted page, click **Make a prank**, enter the recipient and sender names and (optionally) a secret note, then choose **Create my prank link**. Use **Copy** or the system **Share** menu. The received link opens with the personalised greeting and the message becomes visible on the Yes screen.

When the project is viewed from a local `file://` URL, the prank can still be previewed and the result card can be downloaded, but public link-sharing is disabled. A locally opened file is not a public website. Publish to a static host such as GitHub Pages to enable sending URLs.

## Interaction

- **Yes, I do:** CSS liquid spin → expanding pink heart → dramatic light beams, sparkles, floating hearts, personalised reveal, and share options.
- **Maybe a little:** A reassuring little message and blue liquid-glass activation.
- **No, not really (desktop):** Moves away from the cursor across the screen. Repeated attempts increase speed, urgency, jokes, and decoys.
- **No, not really (touchscreen):** Splits into two halves, flies apart with different paths, and reassembles somewhere else. Repeated taps trigger the prank again.
- **Share the result:** Save an original 1080 × 1350 PNG card generated in the browser (names, note, and escape count). Share the result message using the device share sheet, or copy it if native sharing is unavailable.
- **Replay:** Restores the original button layout, resets the escape count and effects, and preserves the personalised recipient details.
- **Light / dark:** Theme toggle.

## Privacy and accessibility

All logic runs in the browser. The page does **not** collect, transmit, store, or track names, clicks, results, or user responses. Personalisation fields are URL query parameters (`to`, `from`, `note`); **anyone who sees the link can read them**. Do not put private information there. The note is rendered as text, never injected as HTML.

The app includes `prefers-reduced-motion` handling, dialog focus management, keyboard navigation, and an accessible response to keyboard-activated No. If the sender has not merged and published the PR yet, existing public links will still use the old version.

**Limitations:** personalised names are applied after page load, so social platforms generally display the same generic link thumbnail/title for all recipients. For personalised previews, a server-side link metadata service would be required. PNG downloads use a browser canvas with no external image dependency.

## Files

- `index.html` — interface, link builder, and Yes reveal
- `style.css` — responsive layout, liquid glass, flight animations, light/dark themes
- `script.js` — personalisation, runaway No, split animation, sharing, PNG export