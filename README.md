# TechTalks 2026 - Event Website

A high-performance, single-page website for a 1-day technical event, built with **Node.js** and **Vanilla JavaScript**. This project features a sleek **Dark Mode** design and a highly interactive schedule with real-time advanced filtering.

## 🚀 Features

- **Dynamic Schedule:** Automatically calculates timings starting at 10:00 AM.
  - 6 technical talks (1 hour each).
  - 10-minute transitions between sessions.
  - 1-hour lunch break after the 3rd talk.
- **Advanced Unified Search:** Instantly filter talks by **Category**, **Speaker**, or **Title**.
- **Visual Feedback:** Matches are dynamically highlighted in the UI as you type.
- **Interactive UX:**
  - **Sticky Header:** Keep the search bar accessible at all times with a modern blur effect.
  - **Clickable Tags:** Instantly filter the schedule by clicking any category tag.
  - **Clear Search:** Quickly reset your view with a dedicated "Clear" button.
- **Add to Calendar:** Integrated Google Calendar links for every session.
- **Dark Mode UI:** A professional, developer-centric aesthetic using CSS variables.
- **Zero Dependencies:** Built using standard Node.js APIs and modern browser primitives.
- **Robust Testing:** A comprehensive suite of automated tests verifying logic, data, server integrity, and **JavaScript syntax**.

## 🛠️ Project Structure

```text
.
├── public/                 # Static assets
│   ├── index.html          # Main entry point
│   ├── style.css           # Dark mode styles & sticky header
│   ├── script.js           # Frontend logic, search & highlighting
│   ├── 404.html            # Custom error page
│   └── data/
│       └── talks.json      # Event talk data (JSON)
├── server.js               # Node.js HTTP server (Standard Library)
├── test-automation.js      # Automated test suite (Logic + Syntax)
├── README.md               # User documentation
├── GEMINI.md               # AI context & core mandates
└── package.json            # Project configuration
```

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)

### Running the Website

1. Start the local server:
   ```bash
   node server.js
   ```
2. Open your browser and navigate to:
   [http://localhost:8080](http://localhost:8080)

## 🧪 Testing

The project includes an automated test suite that verifies schedule logic, search functionality, resource integrity, and frontend syntax.

Run the tests using:
```bash
npm test
```

## 📝 Customization

To update the event schedule or speaker information, edit the `public/data/talks.json` file. The website will automatically update the timings and layout on the next refresh.

---
Built for TechTalks 2026.
