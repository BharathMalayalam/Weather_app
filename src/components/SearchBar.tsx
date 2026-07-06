import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, X, Star, Loader2, Navigation } from 'lucide-react';
import { searchCities } from '../services/weatherApi';
import type { FavoriteCity } from '../types/weather';

interface SearchBarProps {
    onSearch: (lat: number, lon: number, city: string, country: string) => void;
    onGeolocate: () => void;
    favorites: FavoriteCity[];
    onToggleFavorite: (city: FavoriteCity) => void;
    currentCity?: string;
    isLoading: boolean;
}

interface CityResult {
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    onGeolocate,
    favorites,
    onToggleFavorite,
    currentCity,
    isLoading,
}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CityResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleSearch = useCallback(async (val: string) => {
        if (!val.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }
        setIsSearching(true);
        try {
            const data = await searchCities(val);
            setResults(data);
            setIsOpen(data.length > 0);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => handleSearch(query), 400);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, handleSearch]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setShowFavorites(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const selectCity = (city: CityResult) => {
        onSearch(city.lat, city.lon, city.name, city.country);
        setQuery('');
        setIsOpen(false);
        setShowFavorites(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && results.length > 0) {
            selectCity(results[0]);
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
            {/* Search Input */}
            <div className="relative group">
                <div className="glass-strong rounded-2xl overflow-hidden transition-all duration-300 group-focus-within:ring-2 group-focus-within:ring-white/30">
                    <div className="flex items-center gap-3 px-4 py-3">
                        {isSearching ? (
                            <Loader2 size={20} className="text-white/70 spin-animation flex-shrink-0" />
                        ) : (
                            <Search size={20} className="text-white/70 flex-shrink-0" />
                        )}
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => {
                                if (favorites.length > 0 && !query) setShowFavorites(true);
                                if (results.length > 0) setIsOpen(true);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Search city, country..."
                            className="search-input flex-1 bg-transparent text-white placeholder-white/40 text-sm font-medium outline-none"
                            id="city-search-input"
                            aria-label="Search for a city"
                            autoComplete="off"
                        />
                        {query && (
                            <button
                                onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
                                className="text-white/50 hover:text-white transition-colors"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                        {/* Divider */}
                        <div className="w-px h-5 bg-white/20" />
                        {/* Geolocate */}
                        <button
                            onClick={onGeolocate}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors px-1"
                            aria-label="Use my location"
                            title="Use my location"
                        >
                            <Navigation size={18} className={isLoading ? 'spin-animation' : ''} />
                        </button>
                        {/* Favorites toggle */}
                        {favorites.length > 0 && (
                            <button
                                onClick={() => { setShowFavorites(!showFavorites); setIsOpen(false); }}
                                className="flex items-center gap-1.5 text-yellow-400/80 hover:text-yellow-400 transition-colors px-1"
                                aria-label="Show favorites"
                                title="Favorites"
                            >
                                <Star size={18} className="fill-current" />
                                <span className="text-xs font-semibold">{favorites.length}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Dropdown: City Results */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full glass-strong rounded-2xl overflow-hidden z-50 shadow-2xl">
                    <div className="p-1.5">
                        {results.map((city, idx) => (
                            <button
                                key={`${city.name}-${city.lat}-${idx}`}
                                onClick={() => selectCity(city)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 text-left group"
                                id={`city-result-${idx}`}
                            >
                                <MapPin size={16} className="text-white/50 group-hover:text-white/80 transition-colors flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <span className="text-white font-medium text-sm">{city.name}</span>
                                    {city.state && <span className="text-white/50 text-xs ml-1">{city.state},</span>}
                                    <span className="text-white/50 text-xs ml-1">{city.country}</span>
                                </div>
                                <span className="text-white/30 text-xs font-mono">
                                    {city.lat.toFixed(1)}°, {city.lon.toFixed(1)}°
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Dropdown: Favorites */}
            {showFavorites && favorites.length > 0 && !isOpen && (
                <div className="absolute top-full mt-2 w-full glass-strong rounded-2xl overflow-hidden z-50 shadow-2xl">
                    <div className="p-3">
                        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 px-2">
                            ⭐ Saved Cities
                        </p>
                        <div className="space-y-1">
                            {favorites.map((fav, idx) => (
                                <div key={`${fav.name}-${idx}`} className="flex items-center gap-2 group">
                                    <button
                                        onClick={() => selectCity(fav)}
                                        className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 text-left"
                                        id={`favorite-city-${idx}`}
                                    >
                                        <MapPin size={15} className="text-yellow-400/70 flex-shrink-0" />
                                        <span className="text-white font-medium text-sm">{fav.name}</span>
                                        <span className="text-white/50 text-xs">{fav.country}</span>
                                        {currentCity === fav.name && (
                                            <span className="ml-auto text-xs text-green-400 font-medium">Current</span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => onToggleFavorite(fav)}
                                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-yellow-400/70 hover:text-red-400"
                                        title="Remove from favorites"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
