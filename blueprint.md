
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
*   **SEO:** Meta description/keywords, Open Graph, canonical, JSON-LD, `robots.txt`, and `sitemap.xml`.
*   **Google AdSense Integration:** Optimized for monetization.
*   **Responsive Design:** Works perfectly on mobile and desktop.

## Design and Style

*   **Hub Layout:** A central navigation area that lets users quickly switch between different tools.
*   **Glassmorphism Aesthetic:** Semi-transparent containers with blur effects, vibrant gradients, and soft shadows.
*   **Modern Components:** Use of Web Components for modularity and encapsulation.
*   **Interactive UI:** Smooth transitions, animations, and glowing effects on interactive elements.

## Current Plan

1.  **Simplify and Consolidated Core Logic in `main.js`:**
    *   Overwrite `main.js` with a unified script handling the Meal Recommender, Lotto Generator, and Theme Toggle.
    *   Implement a massive meal database (100+ items) for the Recommender.
    *   Add `canvas-confetti` for interactive feedback on meal recommendations.
2.  **Verify UI Integration:**
    *   Ensure `index.html` has the necessary IDs: `recommend-meal-btn`, `meal-display`, `total-menu-count`, `theme-btn`, `generate-btn`, and `numbers-container`.
3.  **Enhance User Experience:**
    *   Confirm the confetti effect works as expected.
    *   Verify the random meal and number generation logic.
