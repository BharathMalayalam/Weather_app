import React from 'react';
import { Info, Settings } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface NavbarProps {
    onSearch: (lat: number, lon: number) => void;
    onGeolocate: () => void;
    favorites: any[];
    onToggleFavorite: (city: any) => void;
    currentCity?: string;
    isLoading: boolean;
    onTogglePanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    onSearch,
    onGeolocate,
    favorites,
    onToggleFavorite,
    currentCity,
    isLoading,
    onTogglePanel,
}) => {
    return (
        <header className="w-full py-4">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 glass">
                        <span className="text-xl">🌤️</span>
                    </div>
                    <div>
                        <h1 className="text-white font-semibold text-lg">SkyCast</h1>
                        <p className="text-white/40 text-xs">Professional Weather</p>
                    </div>
                </div>

                <div className="flex-1 mx-4">
                    <SearchBar
                        onSearch={onSearch}
                        onGeolocate={onGeolocate}
                        favorites={favorites}
                        onToggleFavorite={onToggleFavorite}
                        currentCity={currentCity}
                        isLoading={isLoading}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onTogglePanel}
                        className="p-2 rounded-xl glass hover:bg-white/12 text-white/60"
                        aria-label="Toggle panel"
                        title="Toggle panel"
                    >
                        <Info size={16} />
                    </button>
                    <button className="p-2 rounded-xl glass hover:bg-white/12 text-white/60" title="Settings">
                        <Settings size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
