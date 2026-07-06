# Correspondence System (Sistem Korespondensi)

A professional, modern, and responsive web-based correspondence management system designed to streamline organization mail workflows. This application features an interactive dashboard, secure authentication, and real-time data visualization.

This project was built to fulfill the Final Project (UAS) requirements for the SIB (Sistem Informasi Bisnis) program.

---

## 🚀 Key Features

* **Secure Authentication**: Specialized login interface for access control management (`src/AuthPage.jsx`).
* **Interactive Analytics Dashboard**: Provides an overview of incoming and outgoing mail with rich visual components (`src/Dashboard.jsx`).
* **Data Visualization**: Uses professional charts to display mail traffic statistics trends over time.
* **Modern & Clean UI**: Designed with Tailwind CSS and enhanced with crisp vector icons from Lucide React.
* **Fully Responsive**: Optimally rendered across mobile, tablet, and desktop viewports.

---

## 🛠️ Built With (Tech Stack)

* **Core Library**: [React 19](https://react.dev/) - Component-based UI rendering.
* **Build Tool**: [Vite](https://vitejs.dev/) - Lightning-fast development server and bundler.
* **Styling Engine**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework for modern styling.
* **Icons**: [Lucide React](https://lucide.dev/) - Beautiful and consistent icon kit.
* **Charts**: [Recharts](https://recharts.org/) - Composable charting library for business metrics.

---

## 💻 Local Setup and Installation

Follow these step-by-step instructions to deploy, install dependencies, and run this repository locally on your computer:

```bash
# 1. Prerequisites (Check Node.js and npm versions)
node -v
npm -v

# 2. Clone the Repository
git clone [https://github.com/xyz17-dom/correspondence-system.git](https://github.com/xyz17-dom/correspondence-system.git)

# 3. Navigate into the Project Folder
cd correspondence-system

# 4. Install Dependencies
npm install

# 5. Running the Application
npm run dev

# 6. Building for Production
npm run build
```

> **Note:** Once the development server (`npm run dev`) is compiled, open your browser and navigate to the local server port displayed in your terminal (typically `http://localhost:5173`).

---

## 📁 Repository Directory Structure

```text
├── public/                  # Static assets (favicons, browser configurations)
│   └── icons.svg            # Centralized system vector icons
├── src/
│   ├── assets/              # Graphic media assets
│   │   ├── hero.png         # Main onboarding background asset
│   │   └── vite.svg         # Default Vite branding graphic
│   ├── App.css              # Global system stylesheets and core layout adjustments
│   ├── App.jsx              # Application router and entry layout wrapper
│   ├── AuthPage.jsx         # User credentials authentication workflow views
│   ├── Dashboard.jsx        # Business intelligence dashboard interface and metrics
│   └── main.jsx             # React Virtual DOM bootstrap mount file
├── .gitignore               # System instruction instructing Git which files to exclude
├── eslint.config.js         # Linting validation parameters for keeping code clean
├── index.html               # Main HTML presentation engine skeleton
├── package-lock.json        # Exact dependency tree configuration history snapshot
├── package.json             # Registered platform dependencies and runtime scripts
└── vite.config.js           # Core execution profile settings for the Vite compiler
```

---

## 📄 License & Academic Integrity

This software is developed strictly as an academic submission for the UAS SIB (Sistem Informasi Bisnis) evaluation. All source code and design concepts remain within academic bounds.

Developed with ❤️ by [xyz17-dom](https://github.com/xyz17-dom).
