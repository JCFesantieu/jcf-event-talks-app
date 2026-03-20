# TechTalks 2026 - Project Context & Rules

This document provides essential context and development mandates for the **TechTalks 2026** event website. All AI agents and developers must adhere to these standards to maintain consistency and quality.

## 🎯 Project Overview
A high-performance, single-page schedule website for a technical conference. It is designed to be lightweight, zero-dependency, and highly interactive with a developer-centric aesthetic.

## 🏗️ Technical Stack
- **Server:** Node.js (Standard `http` and `fs` modules). **Do not add Express or other npm dependencies** unless explicitly requested.
- **Frontend:** Vanilla HTML5, CSS3 (Variables-based), and Vanilla JavaScript (ES6+).
- **Data:** Static JSON storage in `public/data/talks.json`.
- **Testing:** Built-in Node.js test runner (`node:test`).

## 📏 Core Mandates

### 1. Zero-Dependency Policy
- Maintain the current "no-npm-install" architecture. Use built-in Node.js modules for server-side logic and native browser APIs for the frontend.

### 2. Schedule Logic & Precision
- **Start Time:** Exactly 10:00 AM.
- **Talks:** 1 hour each.
- **Transitions:** Exactly 10 minutes between talks.
- **Lunch:** 1 hour break exactly after the 3rd talk (starts at 13:20 PM).
- **Validation:** Any change to schedule rendering must be verified by `npm test`.

### 3. UX & Styling Standards
- **Theme:** Strict **Dark Mode** (`--bg-color: #121212`).
- **Feedback:** Real-time search highlighting is a core feature; do not break the `highlightText` utility.
- **Navigation:** The header must remain `sticky` with a backdrop blur for constant search accessibility.
- **Interactivity:** Category tags must be clickable to trigger filtering.
- **Responsiveness:** All layouts must be mobile-first and use CSS Flexbox/Grid.
- **Descriptions:** Talk descriptions must remain **always visible** per user requirement.

### 4. Search Behavior
- **Unified Search:** The search bar must match against **Title**, **Speakers**, and **Categories**.
- **Case Sensitivity:** Search must always be case-insensitive.
- **Highlighting:** Matching substrings must be wrapped in `<span class="highlight">`.

## 🧪 Testing Protocol
- **Command:** `npm test`
- **Coverage:** Tests must cover time formatting, schedule math, search logic, data schema, server routing, and **Frontend JS Syntax Validation**.
- **Regressions:** Always run the full suite before pushing any frontend or logic changes.

## 📂 File Map
- `server.js`: Entry point, handles static routing and 404s.
- `public/script.js`: Contains the core rendering, timing, search, and calendar logic.
- `public/style.css`: Contains all theme variables, layout rules, and sticky behaviors.
- `test-automation.js`: The source of truth for application correctness and syntax integrity.

---
*Last Updated: March 20, 2026*
