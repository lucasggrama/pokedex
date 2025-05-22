import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface PokemonListItem {
  name: string;
  url: string;
}

const PokemonSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [suggestions, setSuggestions] = useState<PokemonListItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Carrega todos os Pokémon na inicialização
  useEffect(() => {
    const fetchAllPokemon = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=2000"
        );
        const data = await response.json();
        setAllPokemon(data.results);
      } catch (error) {
        console.error("Error fetching Pokémon list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  // Atualiza as sugestões conforme o termo de pesquisa muda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = allPokemon
      .filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5); // Limita a 5 sugestões

    setSuggestions(filtered);
  }, [searchTerm, allPokemon]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (pokemonUrl: string) => {
    const pokemonId = pokemonUrl.split("/").slice(-2, -1)[0];
    navigate(`/pokemon/${pokemonId}`);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      const pokemonId = suggestions[0].url.split("/").slice(-2, -1)[0];
      navigate(`/pokemon/${pokemonId}`);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          placeholder="Pesquisar Pokémon..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
          className="w-full p-4 bg-dracula-background text-dracula-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-dracula-cyan border border-dracula-selection"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSuggestions([]);
            }}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-dracula-comment hover:text-dracula-foreground"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-dracula-cyan text-dracula-background p-1 rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-dracula-background rounded-lg shadow-lg border border-dracula-selection">
          <ul>
            {suggestions.map((pokemon) => {
              const pokemonId = pokemon.url.split("/").slice(-2, -1)[0];
              return (
                <li
                  key={pokemon.name}
                  onClick={() => handleSuggestionClick(pokemon.url)}
                  className="px-4 py-3 hover:bg-dracula-selection cursor-pointer flex items-center bg-white gap-3"
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                    alt={pokemon.name}
                    className="w-8 h-8"
                  />
                  <span className="capitalize text-dracula-foreground">
                    {pokemon.name}
                  </span>
                  <span className="ml-auto text-dracula-comment text-sm">
                    #{pokemonId.padStart(3, "0")}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {showSuggestions &&
        searchTerm &&
        suggestions.length === 0 &&
        !loading && (
          <div className="absolute z-10 w-full mt-1 bg-dracula-current-line rounded-lg shadow-lg p-4 text-dracula-comment">
            No Pokémon found
          </div>
        )}
    </div>
  );
};

export default PokemonSearch;
