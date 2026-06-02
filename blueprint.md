
# Lotto Number Recommendation Site

## Overview

This project is a web-based application that generates and displays lottery number recommendations. Users can click a button to get 5 sets of 6 unique random numbers between 1 and 45.

## Features

*   **Number Generation:** Generates 5 unique sets of 6 random numbers per request.
*   **User Interface:** A clean and simple interface to display the numbers.
*   **One-Click Generation:** A button to trigger the number generation.
*   **Theme Toggle:** Supports Dark Mode (default) and Light Mode with a simple toggle switch. User preference is persisted.
*   **Animations:** Engaging animations for a more dynamic user experience, including staggered entrance effects.
*   **Partnership Inquiry Form:** A dedicated section for businesses to reach out for inquiries, powered by Formspree.

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
4.  **Deployment:**
    *   Commit and push changes to GitHub.
