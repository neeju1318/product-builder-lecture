
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
*   **Analytics & Tracking:** Integrated Google Analytics (gtag.js) and Microsoft Clarity for user behavior analysis.
*   **Google AdSense Integration:** Optimized for monetization.
*   **Responsive Design:** Works perfectly on mobile and desktop.

## Design and Style

*   **Hub Layout:** A central navigation area that lets users quickly switch between different tools.
*   **Glassmorphism Aesthetic:** Semi-transparent containers with blur effects, vibrant gradients, and soft shadows.
*   **Modern Components:** Use of Web Components for modularity and encapsulation.
*   **Interactive UI:** Smooth transitions, animations, and glowing effects on interactive elements.

### 3. Smart Man Mascot (스마트 맨 마스코트)
*   **Visual Identity:** A friendly, intelligent-looking male character with a short sports cut and no glasses.
*   **Purpose:** Used as a mascot or site representative to enhance the friendly utility tool vibe.
*   **Implementation:** Scalable SVG asset for high-quality display on all devices.

## Current Plan

1.  **Create Smart Man Icon:**
    *   Design a modern SVG icon of a smart-looking man (short hair, no glasses, kind expression).
    *   Save the asset as `assets/smart-man.svg`.
2.  **Update Site Identity:**
    *   Replace the generic emoji favicon with the new Smart Man icon in `index.html`.
    *   Potentially use the icon in the hero section or about section.
3.  **Integrate Microsoft Clarity:**
    *   Add the MS Clarity tracking script to the `<head>` section of `index.html` using the project ID `x2ntzlyr93`. (Already in blueprint, keeping for consistency)
