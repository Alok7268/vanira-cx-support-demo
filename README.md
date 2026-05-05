# Vanira CX Support Demo

This is a demonstration application showcasing the integration of the **Vanira Voice AI SDK** into a React + Vite project. It provides an interactive, voice-enabled customer support interface.

## Features

- **Vanira Voice AI Integration**: Seamless real-time voice conversations with an AI agent using WebRTC.
- **Dynamic Context Updates**: Passes tracking numbers and context to the AI in real-time.
- **Agent Interruption & Action Triggers**: The agent can handle external triggers and UI events during a call.
- **Interactive Tools**: The AI agent can highlight UI elements, open FAQ articles, and request options dynamically.
- **Page Navigation**: The AI agent can physically navigate users across different application views (e.g. from Home to the Returns Portal).

## Prerequisites

- Node.js (v18+ recommended)
- A Vanira SDK API Key

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Alok7268/vanira-cx-support-demo.git
   cd vanira-cx-support-demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your Vanira SDK API key:
     ```env
     VITE_VANIRA_API_KEY=your_vanira_api_key_here
     ```

## Running the Development Server

Start the development server with Vite:

```bash
npm run dev
```

Then, open the provided local URL (typically `http://localhost:5173`) in your browser to view the application.

## Building for Production

To build the project for production, run:

```bash
npm run build
```

This will compile TypeScript and bundle the application into the `dist` directory.

## Project Structure

- `src/components/VoiceAgent.tsx`: Contains the core implementation of the Vanira `WebRTCClient`, handling connection, state, context updates, and client tool calls.
- `src/App.tsx`: Main application layout containing the dashboard, customer details, FAQ section, and the integrated VoiceAgent.
- `src/index.css`: Global styles including animations and modern UI styling.
