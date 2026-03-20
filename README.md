# TechTalks 2026 - Event Website

A high-performance, single-page website for a 1-day technical event, built with **Node.js** and **Vanilla JavaScript**. This project features a sleek **Dark Mode** design and a dynamic schedule with real-time category filtering.

## 🚀 Features

- **Dynamic Schedule:** Automatically calculates timings starting at 10:00 AM.
  - 6 technical talks (1 hour each).
  - 10-minute transitions between sessions.
  - 1-hour lunch break after the 3rd talk.
- **Real-time Search:** Instantly filter talks by category keywords (e.g., Frontend, Security).
- **Dark Mode UI:** A professional, developer-centric aesthetic using CSS variables.
- **Zero Dependencies:** Built using standard Node.js APIs and modern browser primitives.
- **Automated Testing:** A robust suite of 6 automated tests to ensure logic and server integrity.

## 🛠️ Project Structure

```text
.
├── public/                 # Static assets
│   ├── index.html          # Main entry point
│   ├── style.css           # Dark mode styles
│   ├── script.js           # Frontend logic & search
│   ├── 404.html            # Custom error page
│   └── data/
│       └── talks.json      # Event talk data (JSON)
├── server.js               # Node.js HTTP server
├── test-automation.js      # Automated test suite
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

The project includes an automated test suite that verifies schedule logic, search filtering, and server connectivity.

Run the tests using:
```bash
npm test
```

## 📝 Customization

To update the event schedule or speaker information, simply edit the `public/data/talks.json` file. The website will automatically update the timings and layout on the next refresh.

---
Built for TechTalks 2026.
