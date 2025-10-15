import React from 'react';
import { Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: boolean;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose, onToggleFavorite, isFavorite }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 sm:p-6 border-b border-gray-200 flex justify-between items-start z-10">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{recipe.name}</h2>
                <p className="mt-1 text-sm text-gray-600">{recipe.description}</p>
            </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
            <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-6">
                <span className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>{recipe.cookingTime} mins</span>
                <span className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v1H5V4zM5 8h10a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V9a1 1 0 011-1z" /></svg>{recipe.difficulty}</span>
                <span className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 9c-1.55 0-2.958.427-4.07 1.17a6.97 6.97 0 00-1.5 4.33c0 .34.024.673.07 1h8.86zM9 18a1 1 0 01-2 0h-1a3 3 0 00-3 3a1 1 0 01-2 0 5.002 5.002 0 0110 0 1 1 0 01-2 0 3 3 0 00-3-3h-1z" /></svg>{recipe.servings} servings</span>
                 <button onClick={() => onToggleFavorite(recipe)} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {isFavorite ? 'Favorite' : 'Add to Favorites'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Ingredients</h3>
                    <ul className="space-y-2 text-gray-700">
                        {recipe.ingredients.map((ing, i) => <li key={i} className="flex items-start"><span className="mr-2 mt-1 text-emerald-500">&#8227;</span><span>{ing}</span></li>)}
                    </ul>
                </div>
                <div className="md:col-span-3">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Instructions</h3>
                    <ol className="space-y-4 text-gray-700">
                        {recipe.instructions.map((step, i) => (
                            <li key={i} className="flex">
                                <span className="bg-emerald-500 text-white rounded-full h-6 w-6 text-sm flex items-center justify-center font-bold mr-3 flex-shrink-0">{i + 1}</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t">
                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Nutritional Information</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-gray-100 p-2 rounded-lg"><p className="font-bold text-emerald-600">{recipe.nutritionalInfo.calories}</p><p className="text-sm text-gray-600">Calories</p></div>
                    <div className="bg-gray-100 p-2 rounded-lg"><p className="font-bold text-emerald-600">{recipe.nutritionalInfo.protein}</p><p className="text-sm text-gray-600">Protein</p></div>
                    <div className="bg-gray-100 p-2 rounded-lg"><p className="font-bold text-emerald-600">{recipe.nutritionalInfo.carbs}</p><p className="text-sm text-gray-600">Carbs</p></div>
                    <div className="bg-gray-100 p-2 rounded-lg"><p className="font-bold text-emerald-600">{recipe.nutritionalInfo.fat}</p><p className="text-sm text-gray-600">Fat</p></div>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;