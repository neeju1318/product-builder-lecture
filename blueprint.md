
# Lotto Number Recommendation Site

## Overview

This project is a content-rich, AdSense-ready web application for Korean Lotto 6/45. Users choose one of three recommendation modes — Hot (frequently drawn), Cold (rarely drawn), or pure Random — to generate number sets, and can browse recent winning numbers, frequency statistics, a lottery guide, and FAQ.

## Features

*   **Three Recommendation Modes:** Hot (weighted toward frequently drawn numbers), Cold (weighted toward rarely drawn numbers), and pure Random. Hot/Cold weights are computed client-side from the last 10 draws.
*   **Embedded Real Draw Data:** The most recent 10 verified Lotto 6/45 results are bundled in `main.js`. Live fetching was ruled out — the legacy 동행복권 JSON API now 302-redirects to its homepage, and a static site cannot call it from the browser due to CORS. Data is manually updatable (prepend new draws to the `DRAWS` array).
*   **Recent Winning Numbers:** Grid of the last 10 draws with round, date, six numbers, and bonus.
*   **Frequency Statistics:** Per-number (1–45) appearance chart over the last 10 draws, plus Hot/Cold TOP 6 summaries.
*   **Content Sections (for AdSense quality):** Lottery guide (rules, odds table, tips), FAQ, and a responsible-gaming notice.
*   **Required Policy Pages:** `privacy.html` (개인정보처리방침, includes the mandatory AdSense cookie/ads disclosure) and `terms.html` (이용약관).
*   **SEO:** Meta description/keywords, Open Graph, canonical, JSON-LD, `robots.txt`, and `sitemap.xml`.
*   **Theme Toggle:** Dark (default) / Light mode, persisted in localStorage.
*   **Partnership Inquiry Form:** Formspree-powered contact form.
*   **Comments:** Disqus thread.
*   **Google AdSense Integration:** Loader script + account verification meta tag in `<head>`, `ads.txt` at root, and in-content responsive ad units (replace `data-ad-slot` placeholders with real slot IDs once units are created).

## Design and Style

*   **Layout:** A centered, single-column layout with a theme toggle button.
*   **Theme Support:** 
    *   **Dark Mode:** Vibrant animated gradient background with semi-transparent glassmorphism container.
    *   **Light Mode:** Clean, soft gray/blue gradient background with high-contrast text and container.
*   **Typography:** Clear and readable fonts for the title and numbers.
*   **Color Scheme:** Dynamic color variables for text, background, and borders.
*   **Interactivity:** A button with a clear call to action and hover effects. Form inputs with glowing focus states.
*   **Animations:** Numbers fade in, scale up, and slide up when generated. The background has a subtle gradient animation.
*   **Visual Effects:** Glassmorphism (`backdrop-filter`) for the container. A subtle noise texture on the background, and soft glows/shadows on the balls and button. Each ball has a radial gradient to simulate 3D depth.
*   **Form Design:** Elegant input fields with smooth transitions, matching the glassmorphism aesthetic of the site.

## Current Plan

1.  **Add Theme Support:** (Completed)
    *   Implement Dark/Light mode using CSS variables.
    *   Add a theme toggle button and JavaScript logic for persistence.
2.  **Enhance Visuals:** (Completed)
    *   Implement color-coded lottery balls based on number ranges.
    *   Add radial gradients to balls for a 3D effect.
    *   Refine entrance animations for a smoother feel.
3.  **Add Partnership Inquiry Form:** (Completed)
    *   Create a Formspree-powered contact form (`https://formspree.io/f/xwvzgyoz`).
    *   Style the form to match the existing premium look.
    *   Ensure responsiveness and clear labels.
4.  **Integrate Google AdSense:** (Completed)
    *   Add the AdSense auto-ads script to the `<head>`.
    *   Add the AdSense account verification meta tag.
    *   Create `ads.txt` with the authorized publisher information.
5.  **Optimize for AdSense Approval & Add Hot/Cold/Random Modes:** (Completed)
    *   Rebuild as a multi-section, content-rich, responsive site with sticky nav and footer.
    *   Add Hot/Cold/Random generation modes driven by verified last-10-draw data.
    *   Add recent-draws grid, frequency chart, guide, FAQ, and responsible-gaming notice.
    *   Add required `privacy.html` and `terms.html`, plus `robots.txt` and `sitemap.xml`.
6.  **Deployment:**
    *   Commit and push changes to GitHub.
