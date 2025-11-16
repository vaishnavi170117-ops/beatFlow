File structure

final beat/
├── Backend_project/  (Node.js/Express Backend)
│   ├── controllers/
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── dancestylemodel.js
│   │   ├── songmodel.js
│   │   └── userModel.js
│   ├── node_modules/
│   ├── routes/
│   │   ├── console
│   │   ├── danceStyleRoutes.js
│   │   ├── savedRoutes.js
│   │   ├── songRoutes.js
│   │   └── userRoutes.js
│   ├── temp_files/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
---
├── DanceBeat/        (React/Vite/TypeScript Frontend)
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── AudioVisualizer.tsx
│   │   │   ├── BeatPad.tsx
│   │   │   ├── BeatProcessor.tsx
│   │   │   ├── BeatViewer.tsx
│   │   │   ├── DanceFormCard.tsx
│   │   │   ├── DancePlayer.tsx
│   │   │   ├── Dancer.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── InstrumentSelector.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── NavLink.tsx
│   │   │   ├── PasswordStrength.tsx
│   │   │   ├── PlaybackControls.tsx
│   │   │   ├── SequenceDisplay.tsx
│   │   │   ├── SongCard.tsx
│   │   │   ├── SongModal.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── AppPage.tsx
│   │   │   ├── FavoritesPage.tsx
│   │   │   ├── Game.tsx
│   │   │   ├── Index.tsx
│   │   │   ├── LikedPage.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── MusicComposerPage.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── page.tsx
│   │   │   ├── SavedPage.tsx
│   │   │   └── Signup.tsx
│   │   ├── types/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── custom.d.ts
│   │   ├── global.d.ts
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .eslintrc
│   ├── .gitignore
│   ├── bun.lockb
│   ├── components
│   ├── eslint.config.js
│   ├── index
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── README
│   ├── tailwind.config
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts

