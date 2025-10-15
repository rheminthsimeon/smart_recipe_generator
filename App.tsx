import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Spinner from './components/Spinner';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import CameraModal from './components/CameraModal';
import { generateRecipes } from './services/geminiService';
import { Recipe, DietaryPreference, Difficulty } from './types';
import { AVAILABLE_INGREDIENTS, DIETARY_PREFERENCES, DIFFICULTY_LEVELS, COOKING_TIMES } from './constants';

type ActiveTab = 'search' | 'favorites';

const App: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([]);
    const [difficulty, setDifficulty] = useState<Difficulty>('Any');
    const [cookingTime, setCookingTime] = useState<number>(60);
    
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [favorites, setFavorites] = useState<Recipe[]>([]);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('search');
    
    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem('favoriteRecipes');
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (e) {
            console.error("Failed to parse favorites from localStorage", e);
            setFavorites([]);
        }
    }, []);

    const handleToggleIngredient = (ingredient: string) => {
        setIngredients(prev => 
            prev.includes(ingredient) 
                ? prev.filter(i => i !== ingredient) 
                : [...prev, ingredient]
        );
    };

    const handleToggleDietary = (preference: DietaryPreference) => {
        setDietaryPreferences(prev =>
            prev.includes(preference)
                ? prev.filter(p => p !== preference)
                : [...prev, preference]
        );
    };

    const handleGenerateRecipes = async () => {
        if (ingredients.length === 0) {
            setError("Please select at least one ingredient.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setSearched(true);
        setActiveTab('search');
        try {
            const newRecipes = await generateRecipes(ingredients, dietaryPreferences, difficulty, cookingTime);
            setRecipes(newRecipes);
            if(newRecipes.length === 0) {
                setError("No recipes found for your criteria. Try adjusting your filters!");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred while generating recipes. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleFavorite = (recipeToToggle: Recipe) => {
        const isCurrentlyFavorite = favorites.some(recipe => recipe.id === recipeToToggle.id);
        let newFavorites;
        if (isCurrentlyFavorite) {
            newFavorites = favorites.filter(recipe => recipe.id !== recipeToToggle.id);
        } else {
            newFavorites = [...favorites, recipeToToggle];
        }
        setFavorites(newFavorites);
        localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
    };

    const isFavorite = (recipeId: string) => favorites.some(recipe => recipe.id === recipeId);
    
    const handleIngredientsIdentified = (identifiedIngredients: string[]) => {
      const newIngredients = [...new Set([...ingredients, ...identifiedIngredients])];
      const validIngredients = newIngredients.filter(ing => AVAILABLE_INGREDIENTS.includes(ing.toLowerCase()));
      setIngredients(validIngredients);
    };
    
    const sortedRecipes = [...recipes].sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0));
    const displayedRecipes = activeTab === 'search' ? sortedRecipes : favorites;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 py-8 flex-grow">
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Your Perfect Recipe</h2>
                    
                    <div>
                        {/* Ingredients */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Available Ingredients</label>
                            <div className="flex items-center space-x-3 mb-3">
                                <p className="text-sm text-gray-600 flex-grow">Select what you have in your kitchen.</p>
                                <button
                                    onClick={() => setIsCameraOpen(true)}
                                    className="flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-md hover:bg-emerald-200 transition text-sm font-semibold"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span>Scan</span>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-100 rounded-lg">
                                {AVAILABLE_INGREDIENTS.map(ing => (
                                    <button
                                        key={ing}
                                        onClick={() => handleToggleIngredient(ing)}
                                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                            ingredients.includes(ing)
                                                ? 'bg-emerald-500 text-white shadow'
                                                : 'bg-white text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {ing.charAt(0).toUpperCase() + ing.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dietary Preferences */}
                        <div className="mt-6">
                            <label className="block text-gray-700 font-semibold mb-2">Dietary Preferences</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {DIETARY_PREFERENCES.map(pref => (
                                    <label key={pref} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={dietaryPreferences.includes(pref)}
                                            onChange={() => handleToggleDietary(pref)}
                                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="ml-2 text-gray-700">{pref}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        {/* Difficulty */}
                        <div className="mt-6">
                            <label htmlFor="difficulty" className="block text-gray-700 font-semibold mb-2">Difficulty</label>
                            <select
                                id="difficulty"
                                value={difficulty}
                                onChange={e => setDifficulty(e.target.value as Difficulty)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-800"
                            >
                                {DIFFICULTY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                        </div>
                        
                        {/* Cooking Time */}
                        <div className="mt-6">
                            <label htmlFor="cookingTime" className="block text-gray-700 font-semibold mb-2">
                                Max Cooking Time: <span className="font-bold text-emerald-600">{cookingTime} mins</span>
                            </label>
                            <input
                                id="cookingTime"
                                type="range"
                                min={15}
                                max={120}
                                step={15}
                                value={cookingTime}
                                onChange={e => setCookingTime(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                {COOKING_TIMES.map(t => <span key={t}>|</span>)}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleGenerateRecipes}
                            disabled={isLoading}
                            className="bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {isLoading ? 'Generating...' : 'Generate Recipes'}
                        </button>
                    </div>
                </div>
                
                {(searched || favorites.length > 0) && (
                    <div className="mb-6 flex justify-center border-b border-gray-200">
                        <button onClick={() => setActiveTab('search')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'search' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}>
                           Search Results
                        </button>
                        <button onClick={() => setActiveTab('favorites')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'favorites' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}>
                           My Favorites ({favorites.length})
                        </button>
                    </div>
                )}


                {isLoading && <Spinner />}

                {!isLoading && error && activeTab === 'search' && (
                    <div className="text-center p-8 bg-yellow-100 text-yellow-800 rounded-lg">
                        <p>{error}</p>
                    </div>
                )}
                
                {!isLoading && displayedRecipes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedRecipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onSelectRecipe={setSelectedRecipe}
                                onToggleFavorite={handleToggleFavorite}
                                isFavorite={isFavorite(recipe.id)}
                            />
                        ))}
                    </div>
                )}

                {!isLoading && searched && recipes.length === 0 && activeTab === 'search' && (
                     <div className="text-center p-8">
                        <h3 className="text-xl font-semibold text-gray-700">No Recipes Found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters to discover new recipes!</p>
                    </div>
                )}

                {activeTab === 'favorites' && favorites.length === 0 && (
                     <div className="text-center p-8">
                        <h3 className="text-xl font-semibold text-gray-700">No Favorite Recipes</h3>
                        <p className="text-gray-500 mt-2">You haven't saved any recipes yet. Find one you love and click the heart!</p>
                    </div>
                )}

                {!searched && favorites.length === 0 && !isLoading && (
                    <div className="text-center p-8 bg-white rounded-lg shadow">
                         <h3 className="text-xl font-semibold text-gray-700">Ready to Cook?</h3>
                        <p className="text-gray-500 mt-2">Select your ingredients and preferences above to get started.</p>
                    </div>
                )}

            </main>
            <Footer />
            {selectedRecipe && (
                <RecipeModal 
                    recipe={selectedRecipe} 
                    onClose={() => setSelectedRecipe(null)}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={isFavorite(selectedRecipe.id)}
                />
            )}
            {isCameraOpen && (
                <CameraModal
                    onClose={() => setIsCameraOpen(false)}
                    onIngredientsIdentified={handleIngredientsIdentified}
                />
            )}
        </div>
    );
};

export default App;