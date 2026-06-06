
# Daily Utility Tools (일상생활 유틸리티 모음)

## Overview

This project is a collection of useful utility tools for daily life. It started as a Lotto Number Recommendation site and is expanding into a multi-functional utility hub. The goal is to provide simple, beautiful, and functional tools that help users with common daily tasks.

## Features

### 1. Lotto Number Generator (로또 번호 생성기)
*   **Three Recommendation Modes:** Hot (weighted toward frequently drawn numbers), Cold (weighted toward rarely drawn numbers), and pure Random.
*   **Recent Winning Numbers:** Grid of the last 10 draws.
*   **Frequency Statistics:** Per-number appearance chart over the last 10 draws.

### 2. Meal Menu Recommender (식사 메뉴 추천)
*   **Categorized Database:** Menus are organized into cuisine categories (한식/일식/중식/양식/아시안) and recommend the specific sub-menu within a category, not just a broad category.
*   **Text-Only Celebration:** Shows the category badge and the menu name as bold text (no image). On reveal the name pops out with an overshoot animation and a confetti burst for a celebratory feel.

### Shared Features
*   **Theme Toggle:** Dark (default) / Light mode, persisted in localStorage.
*   **SNS Sharing:** Integrated sharing for KakaoTalk, Facebook, Twitter (X), and URL Copy to drive viral growth.
*   **SEO:** Meta description/keywords, Open Graph, canonical, JSON-LD, `robots.txt`, and `sitemap.xml`.
*   **GEO Optimized:** Freshness signals, enhanced structured data, and conversational content.
*   **Analytics & Tracking:** Integrated Google Analytics (gtag.js) and Microsoft Clarity.
*   **Google AdSense Integration:** Optimized for monetization.
*   **Responsive Design:** Works perfectly on mobile and desktop.

## Viral Growth Strategy

To encourage social sharing and virality, the site implements:
1.  **KakaoTalk Integration:** Using the Kakao SDK for rich link sharing (title, description, and image) optimized for the Korean mobile market.
2.  **Native Share API Support:** Leveraging the browser's native sharing capabilities where available.
3.  **One-Click Copy:** A simple feedback-driven "Copy URL" button for universal sharing.
4.  **Incentivized Messaging:** Encouraging users to share their results (e.g., "Share your lucky lotto numbers with friends!").

## Current Plan

1.  **Implement SNS Sharing UI:**
    *   Add a floating or fixed sharing button group to all pages (`index.html`, `lotto.html`, `meal.html`, `recipe.html`).
    *   Create a reusable sharing component or utility.
2.  **Integrate Social SDKs:**
    *   Add Kakao SDK for robust sharing in the Korean market.
    *   Set up sharing metadata (OG Tags) dynamically if possible.
3.  **Styling & Feedback:**
    *   Design vibrant, glowing buttons for each social platform.
    *   Add "Toast" notifications for "URL Copied" feedback.
4.  **Verification:**
    *   Test sharing links on mobile devices and desktop.
