📽️ MovieDB

MovieDB is a responsive movie search and watchlist web app built using React + TypeScript, styled with Tailwind CSS, and powered by the OMDb API.

✨ Features

- 🔍 Search movies by title using the OMDb API
- 🎬 View full movie details in a modal
- ❤️ Add/remove movies from a watchlist (stored in localStorage)
- 🧾 Simple login/logout UI flow (no password reset yet)
- ⚡ Responsive UI with Tailwind CSS
- 🚀 Deployed on GitHub Pages

🧠 How I Approached It

This project was built from scratch using React + Vite for fast development.
I focused on:
- Modular and reusable components (MovieCard, Search, Watchlist, Login)
- Managing state cleanly using useState and useEffect
- LocalStorage to persist watchlist without backend
- Creating a minimal but clean UI with Tailwind
- Dealing with public API limitations (no API key exposure)

I used Git for version control and deployed with GitHub Pages.

🛠️ Tech Stack

- React (with TypeScript)
- Tailwind CSS
- Vite
- OMDb API
- gh-pages for deployment

🚀 Getting Started (Clone & Run Locally)

1. Clone the repository

    git clone https://github.com/JAGRIT098/MovieDB.git
    cd MovieDB

2. Install dependencies

    npm install

3. Setup environment variable

Create a .env file in the root directory and add:

    VITE_OMDB_API_KEY=your_api_key_here

Get a free API key from http://www.omdbapi.com/apikey.aspx

4. Run the development server

    npm run dev

Open http://localhost:5173 in your browser.

📦 Build & Deploy

To build and deploy to GitHub Pages:

    npm run build
    npm run deploy

📝 License

This project is open-source and free to use.
