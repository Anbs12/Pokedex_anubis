//Usamos "use client" para renderizar la pagina o componente del lado del cliente
"use client"
import React, { useState, useEffect } from 'react';

// Función para convertir la primera letra a mayúsculas
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Mapeo de tipos de Pokémon a clases de color de fondo
const pokemonTypeColors = {
    poison: 'bg-purple-400',
    grass: 'bg-green-300',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    bug: 'bg-green-600',
    electric: 'bg-yellow-400',
    ground: 'bg-yellow-800',
    fairy: 'bg-pink-400',
    flying: 'bg-blue-200',
};

// Obtener los datos de la API de Pokémon y mostrarlos en una lista
async function getData(offset = 0, limit = 12) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);

    if (!response.ok) {
        // Esto lanzará un error que será capturado por el catch
        throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    const pokemonData = await Promise.all(data.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        return pokemonResponse.json();
    }));

    return pokemonData;
}

// Crear un componente de tarjeta
function PokemonCard({ pokemon }) {
    return (
        <div className="flex flex-col items-start p-4 bg-white transition-transform hover:-translate-y-1">
            <img className="w-48 h-48 mb-2 bg-slate-50 rounded-md" src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p className="text-xs mb-1">N. 00{pokemon.id}</p>
            <h2 className="text-xl mb-2 font-bold">{capitalizeFirstLetter(pokemon.name)}</h2>
            <div className="flex flex-wrap">
                {pokemon.types.map(typeInfo => (
                    <span key={typeInfo.type.name} className={`mr-2 mb-1 px-2 py-1 rounded ${pokemonTypeColors[typeInfo.type.name] || 'bg-gray-200'}`}>
                        {capitalizeFirstLetter(typeInfo.type.name)}
                    </span>
                ))}
            </div>
        </div>
    );
}

// Esta función se encarga de mostrar los datos en las tarjetas
export default function Page() {
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para cargar más Pokémon
    const loadMorePokemon = async () => {
        try {
            setLoading(true);
            const newPokemonData = await getData(pokemonList.length);
            setPokemonList(prevPokemonList => [...prevPokemonList, ...newPokemonData]);
        } catch (error) {
            console.error('Error fetching more Pokemon data:', error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect para cargar los primeros 12 Pokémon al cargar la página inicialmente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getData();
                setPokemonList(data);
            } catch (error) {
                console.error('Error fetching initial Pokemon data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Función para dividir los Pokémon en filas de 4
    const rows = [];
    for (let i = 0; i < pokemonList.length; i += 4) {
        rows.push(pokemonList.slice(i, i + 4));
    }

    return (
        <main className="flex flex-col gap-4 p-4">
            {rows.map((row, index) => (
                <div key={index} className="flex flex-wrap justify-center gap-4">
                    {row.map((pokemon, index) => (
                        <PokemonCard key={index} pokemon={pokemon} />
                    ))}
                </div>
            ))}
            <div className="flex justify-center mt-4">
                <button onClick={loadMorePokemon} disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {loading ? 'Cargando...' : 'Cargar más Pokémon'}
                </button>
            </div>
        </main>
    );
}