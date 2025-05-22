import React, { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";
import type { Pokemon } from "../interfaces/Pokemon";

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
  const [searchTerm, setSearchTerm] = useState("");

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
    <div className="container mx-auto px-4 py-8 bg-buffy">
      <h1 className="text-4xl font-bold text-center mb-8 text-pink-500">
        Pokédex
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemon?.map((pokemon: Pokemon) => (
          <div className="hover:scale-120">
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          </div>
        ))}
      </div>

      {filteredPokemon?.length === 0 && (
        <div className="text-center text-xl mt-8">
          No Pokémon found matching "{searchTerm}"
        </div>
      )}

      {isFetchingNextPage && (
        <div className="text-center text-xl mt-8">Loading more Pokémon...</div>
      )}

      {!hasNextPage && !isFetchingNextPage && (
        <div className="text-center text-xl mt-8">
          You've reached the end of the Pokédex!
        </div>
      )}
    </div>
  );
};

export default Pokedex;
