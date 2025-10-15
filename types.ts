export interface NutritionalInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  nutritionalInfo: NutritionalInfo;
  matchPercentage?: number;
}

export type DietaryPreference = 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Dairy-Free';
export type Difficulty = 'Any' | 'Easy' | 'Medium' | 'Hard';
