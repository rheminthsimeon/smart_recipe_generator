import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelectRecipe, onToggleFavorite, isFavorite }) => {

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(recipe);
    };

  return (
    <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex flex-col justify-between"
        onClick={() => onSelectRecipe(recipe)}
        style={{ minHeight: '180px' }}
    >
        {recipe.matchPercentage !== undefined && (
            <div className="absolute top-0 left-0 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg rounded-tl-lg shadow-md z-10">
                {Math.round(recipe.matchPercentage)}% Match
            </div>
        )}

      <div className="p-4 flex-grow">
        <div className="flex justify-end items-start -mr-2 -mt-2">
            <button 
                onClick={handleFavoriteClick} 
                className="bg-white rounded-full p-2 shadow-md hover:bg-red-100 transition z-10"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
        </div>

        <div className="pr-2 -mt-4">
            <h3 className="text-xl font-semibold text-gray-800 truncate pt-1">{recipe.name}</h3>
            <p className="text-gray-600 mt-1 text-sm h-10 overflow-hidden">{recipe.description}</p>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center text-sm text-gray-700">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>
            {recipe.cookingTime} mins
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;