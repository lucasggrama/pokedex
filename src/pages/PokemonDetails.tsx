import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Pokemon } from "../interfaces/Pokemon";

const PokemonDetails: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [id, setId] = useState<string | undefined>(params.id);
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemonDetails = async (pokemonId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      if (!response.ok) throw new Error("Pokémon not found");
      const data = await response.json();
      setPokemon(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPokemonDetails(id);
      // Atualiza a URL sem recarregar a página
      navigate(`/pokemon/${id}`, { replace: true });
    }
  }, [id, navigate]);

  const handleNextPokemon = () => {
    const nextId = parseInt(id || "0") + 1;
    setId(nextId.toString());
  };

  const handlePreviousPokemon = () => {
    const prevId = Math.max(1, parseInt(id || "1") - 1);
    setId(prevId.toString());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-dracula-cyan">Loading Pokémon details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-dracula-red mb-4">{error}</div>
        <button onClick={() => navigate("/")} className="btn-dracula">
          Voltar à Pokédex
        </button>
      </div>
    );
  }

  if (!pokemon) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="mb-6 btn-dracula flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Voltar à Pokédex
      </button>

      <div className="flex justify-between mb-6">
        <button
          onClick={handlePreviousPokemon}
          disabled={parseInt(id || "1") <= 1}
          className={`btn-dracula flex items-center gap-2 ${
            parseInt(id || "1") <= 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Pokémon Anterior
        </button>
        <button
          onClick={handleNextPokemon}
          className="btn-dracula flex items-center gap-2"
        >
          Próximo Pokémon
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section - Image and Basic Info */}
        <div className="bg-dracula-current-line rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold capitalize text-dracula-cyan">
              {pokemon.name}
            </h1>
            <span className="text-xl font-mono text-dracula-comment">
              #{pokemon.id.toString().padStart(3, "0")}
            </span>
          </div>

          <div className="flex justify-center mb-6">
            <img
              src={
                pokemon.sprites.other["official-artwork"].front_default ||
                pokemon.sprites.front_default
              }
              alt={pokemon.name}
              className="w-64 h-64 object-contain"
            />
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {pokemon.types.map((type, index) => (
              <span
                key={index}
                className={`type-badge bg-${type.type.name}-type`}
              >
                {type.type.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dracula-selection rounded-lg p-3">
              <h3 className="text-sm text-dracula-comment mb-1">Height</h3>
              <p className="text-lg">{(pokemon.height / 10).toFixed(1)} m</p>
            </div>
            <div className="bg-dracula-selection rounded-lg p-3">
              <h3 className="text-sm text-dracula-comment mb-1">Weight</h3>
              <p className="text-lg">{(pokemon.weight / 10).toFixed(1)} kg</p>
            </div>
          </div>
        </div>

        {/* Right Section - Stats and Details */}
        <div className="bg-dracula-current-line rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-dracula-green mb-4">Stats</h2>
          <div className="space-y-3">
            {pokemon.stats.map((stat, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="capitalize text-dracula-foreground">
                    {stat.stat.name.replace("-", " ")}
                  </span>
                  <span className="font-mono text-dracula-yellow">
                    {stat.base_stat}
                  </span>
                </div>
                <div className="w-full bg-dracula-selection rounded-full h-2">
                  <div
                    className="bg-dracula-cyan h-2 rounded-full"
                    style={{ width: `${Math.min(100, stat.base_stat)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-dracula-green mt-8 mb-4">
            Abilities
          </h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map((ability, index) => (
              <span
                key={index}
                className="bg-dracula-purple/20 text-dracula-foreground px-3 py-1 rounded-full text-sm capitalize"
              >
                {ability.ability.name.replace("-", " ")}
              </span>
            ))}
          </div>

          {pokemon.moves.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-dracula-green mt-8 mb-4">
                Moves
              </h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.moves.slice(0, 10).map((move, index) => (
                  <span
                    key={index}
                    className="bg-dracula-comment/20 text-dracula-foreground px-3 py-1 rounded-full text-sm capitalize"
                  >
                    {move.move.name.replace("-", " ")}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
