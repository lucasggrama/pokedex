import React, { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PokemonCard from "../components/PokemonCard";
import type { Pokemon } from "../interfaces/Pokemon";
import PokemonSearch from "../components/PokemonSearch";

const fetchPokemonList = async ({ pageParam = 0 }) => {
  const limit = 20;
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=${limit}`
  );
  const data = await response.json();

  // Buscar detalhes de cada Pokémon na página atual
  const pokemonDetails = await Promise.all(
    data.results.map(async (pokemon: { url: string }) => {
      const res = await fetch(pokemon.url);
      return res.json();
    })
  );

  return {
    data: pokemonDetails,
    nextPage: data.next ? pageParam + limit : null,
  };
};

const Pokedex: React.FC = () => {
  const [searchTerm] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["pokemon"],
    queryFn: fetchPokemonList,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  // Função para lidar com o scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isFetchingNextPage
    ) {
      return;
    }
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold">Loading Pokémon...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-red-600">
          Error loading Pokémon
        </div>
      </div>
    );
  }

  // Filtrar Pokémon com base no termo de pesquisa
  const filteredPokemon = data?.pages
    .flatMap((page) => page.data)
    .filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <div className="container mx-auto px-4 py-8 bg-buffy">
        {/* Cabeçalho com título e busca na mesma linha */}
        <div className="sticky top-0 z-50 bg-buffy py-2 backdrop-blur-sm bg-opacity-90">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <h1 className="text-2xl font-bold text-red-700 flex items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/Pokebola-pokeball-png-0.png"
                alt="Pokédex"
                className="inline-block w-6 h-6 mr-2"
              />
              Pokédex
            </h1>
            <div className="w-full sm:w-64">
              {" "}
              {/* Largura fixa para a barra de pesquisa */}
              <PokemonSearch />
            </div>
          </div>
        </div>

        {/* Grade de Pokémon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPokemon?.map((pokemon: Pokemon) => (
            <div
              key={pokemon.id}
              className="hover:scale-105 transition-transform"
            >
              <a href={`/pokemon/${pokemon.id}`}>
                <PokemonCard pokemon={pokemon} />
              </a>
            </div>
          ))}
        </div>

        {/* Mensagens de status */}
        {filteredPokemon?.length === 0 && (
          <div className="text-center text-xl mt-8">
            No Pokémon found matching "{searchTerm}"
          </div>
        )}
        {isFetchingNextPage && (
          <div className="text-center text-xl mt-8">
            Loading more Pokémon...
          </div>
        )}
        {!hasNextPage && !isFetchingNextPage && (
          <div className="text-center text-xl mt-8">
            You've reached the end of the Pokédex!
          </div>
        )}
      </div>
    </>
  );
};

export default Pokedex;
