import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 001.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Smart Recipe Generator</h1>
                        <p className="mt-1 text-gray-600 text-sm">Discover recipes with the ingredients you have!</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;