import React from "react";
import type { Pokemon } from "../interfaces/Pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <div className="flex justify-center">
        <img
          className="w-32 h-32"
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-center capitalize">
          {pokemon.name}
        </div>
        <div className="flex justify-center gap-2">
          {pokemon.types.map((type, index) => (
            <span
              key={index}
              className={`inline-block rounded-full px-3 py-1 text-sm font-semibold text-white bg-${type.type.name}-type`}
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
