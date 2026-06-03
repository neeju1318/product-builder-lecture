
# Daily Utility Tools (일상생활 유틸리티 모음)

## Overview

This project is a collection of useful utility tools for daily life. It started as a Lotto Number Recommendation site and is expanding into a multi-functional utility hub. The goal is to provide simple, beautiful, and functional tools that help users with common daily tasks.

## Features

### 1. Lotto Number Generator (로또 번호 생성기)
*   **Three Recommendation Modes:** Hot (weighted toward frequently drawn numbers), Cold (weighted toward rarely drawn numbers), and pure Random.
*   **Recent Winning Numbers:** Grid of the last 10 draws.
*   **Frequency Statistics:** Per-number appearance chart over the last 10 draws.

### 2. Meal Menu Recommender (식사 메뉴 추천)
*   **Random Recommendation:** Suggests a meal menu with a high-quality image when the user clicks a button.
*   **Visual Appeal:** Displays the food name and an appetizing image to help users decide what to eat.

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

1.  **Rebrand to 'Daily Utility Tools':**
    *   Update `index.html` title, header, and branding.
    *   Restructure the layout to accommodate multiple tools.
2.  **Implement Meal Menu Recommender:**
    *   Create a Web Component `<meal-recommender>` in `main.js`.
    *   Prepare a list of meal menus with corresponding images (using high-quality free stock images or placeholders).
    *   Add the component to the main page.
3.  **Refactor Lotto Generator (Optional but Recommended):**
    *   Encapsulate the Lotto generator into a Web Component `<lotto-generator>` for better organization.
4.  **Enhance UI/UX:**
    *   Add a "Tool Selector" or "Dashboard" feel to the top of the page.
    *   Ensure consistent styling across all tools.
5.  **Update Content:**
    *   Update SEO metadata to reflect the broader scope.
    *   Ensure legal pages (`privacy.html`, `terms.html`) still apply.
6.  **Verification:**
    *   Check for errors in console and preview.
    *   Test responsiveness.
