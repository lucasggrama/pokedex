import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pokedex from "./pages/Pokedex";
import PokemonDetails from "./pages/PokemonDetails";
import PokemonSearch from "./components/PokemonSearch";

const App: React.FC = () => {
  return (
    <Router basename={import.meta.env.PUBLIC_URL}>
      <div className="min-h-screen bg-dracula-background text-dracula-foreground">
        <Routes>
          <Route path="/" element={<Pokedex />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
          <Route path="/search" element={<PokemonSearch />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
