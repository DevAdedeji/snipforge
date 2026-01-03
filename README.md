## Introduction

Snipforge is a web application designed to facilitate the creation, organization, and sharing of code snippets. It addresses the common challenge of managing and retrieving frequently used code snippets across various projects and environments.

This project offers several key benefits: enhanced code reusability, improved code organization through categorization and tagging, and simplified collaboration by enabling easy sharing of snippets with others. Snipforge leverages Vue.js for a responsive and intuitive user interface.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

## Features
*   Authentication with firebase.
*   Create and manage code snippets.
*   Explain snippet, Improve snippet and generate test for snippet with Google Gemini

## Tech Stack

This project utilizes the following technologies:

*   **Frontend:**
    *   Vue.js (v3.x)
    *   Vue Router

*   **Build Tool:**
    *   Vite

## Prerequisites

To successfully utilize this project, ensure the following prerequisites are met:

**Required:**

*   **Node.js:** Version 18.0.0 or higher. Verify your Node.js version by executing `node -v` in your terminal.
*   **npm:** Version 8.0.0 or higher. Check your npm version with `npm -v`.
*   **Git:** Version 2.0.0 or higher. Confirm your Git installation and version using `git --version`.
*   **A code editor:** such as Visual Studio Code, Sublime Text, or similar.

**Optional:**

*   **A code editor extension for Vue.js:** This enhances development with features like syntax highlighting and autocompletion.

## Installation

To install and configure Snipforge, follow these steps:

1.  **Clone the Repository:** Clone the Snipforge repository to your local machine using Git.

    ```bash
    git clone https://github.com/DevAdedeji/snipforge.git
    ```

2.  **Navigate to the Project Directory:** Change your current directory to the newly cloned `snipforge` directory.

    ```bash
    cd snipforge
    ```

3.  **Install Node.js Dependencies:** Install the necessary Node.js packages using npm. Ensure you have Node.js version 16 or higher installed.

    ```bash
    npm install
    ```

4.  **Environment Variable Setup:** Create a `.env` file in the project root directory. Define the required environment variables.  At a minimum, you will need to set `VITE_API_URL` to the backend API URL.

    ```
    VITE_FIREBASE_API_KEY=""
    VITE_FIREBASE_AUTH_DOMAIN=""
    VITE_FIREBASE_PROJECT_ID=""
    VITE_FIREBASE_STORAGE_BUCKET=""
    VITE_FIREBASE_MESSAGING_SENDER_ID=""
    VITE_FIREBASE_APP_ID=""
    VITE_FIREBASE_MEASUREMENT_ID=""
    VITE_GEMINI_API_KEY=""
    VITE_APP_URL=http://localhost:3000
    ```

```markdown
## Usage

To run the application, execute the following command in your terminal:

```bash
npm run dev
```

This command starts the development server, allowing you to view and interact with the application in your browser.

## Configuration

This section details the configuration options for Snipforge. Configure these settings to tailor the application to your specific needs.

### Configuration Options

The following table outlines the available configuration options:

| Option Name        | Type      | Default Value | Description

## Testing

This project utilizes Vitest for unit testing and Playwright for end-to-end (E2E) testing.

## Project Structure

```
.husky/
.vscode/
e2e/
public/
src/
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── firebase/
│   ├── router/
│   ├── services/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   └── views/
.editorconfig
.gitattributes
.gitignore
.prettierrc.json
README.md
auto-imports.d.ts
components.d.ts
env.d.ts
eslint.config.ts
index.html
package-lock.json
package.json
playwright.config.ts
tsconfig.app.json
tsconfig.json
tsconfig.node.json
tsconfig.vitest.json
vite.config.ts
vitest.config.ts
```

## Deployment

This section details the deployment process for the `snipforge` application. The primary target platform is Vercel.

### Vercel Deployment

1.  **Prerequisites:** Ensure you have a Vercel account and the Vercel CLI installed. Install the CLI globally using npm:

    ```bash
    npm install -g vercel
    ```

2.  **Build the Application:** Navigate to the project's root directory and build the Vue application using the following command:

    ```bash
    npm run build
    ```

    This command generates the production-ready assets in the `dist` directory.

3.  **Deploy to Vercel:** Deploy the application using the Vercel CLI.  Authenticate with your Vercel account if prompted.

    ```bash
    vercel
    ```

    Follow the prompts to configure the deployment.  Vercel will automatically detect the project type and configure the necessary settings.

4.  **Environment Variables:** Configure environment variables within the Vercel dashboard. Navigate to your project settings on Vercel and access the "Environment Variables" section.  Add the following environment variables, replacing the placeholder values with your actual configuration:
    ```
    VITE_FIREBASE_API_KEY=""
    VITE_FIREBASE_AUTH_DOMAIN=""
    VITE_FIREBASE_PROJECT_ID=""
    VITE_FIREBASE_STORAGE_BUCKET=""
    VITE_FIREBASE_MESSAGING_SENDER_ID=""
    VITE_FIREBASE_APP_ID=""
    VITE_FIREBASE_MEASUREMENT_ID=""
    VITE_GEMINI_API_KEY=""
    VITE_APP_URL=http://localhost:3000
    ```

    Refer to the Vercel documentation for detailed instructions on environment variable management: [https://vercel.com/docs/concepts/projects/environment-variables](https://vercel.com/docs/concepts/projects/environment-variables).

5.  **Verification:** After deployment, Vercel provides a deployment URL. Access this URL in your browser to verify the application is running correctly.
