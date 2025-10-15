import { GoogleGenAI, Type } from "@google/genai";
import { DietaryPreference, Difficulty, Recipe } from '../types';

// FIX: Initialize GoogleGenAI with a named apiKey parameter, getting the key from process.env.API_KEY.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "A unique identifier for the recipe, e.g., a UUID." },
      name: { type: Type.STRING, description: "The name of the recipe." },
      description: { type: Type.STRING, description: "A brief, appealing description of the dish." },
      ingredients: {
        type: Type.ARRAY,
        description: "A list of all ingredients required for the recipe.",
        items: { type: Type.STRING },
      },
      instructions: {
        type: Type.ARRAY,
        description: "Step-by-step cooking instructions.",
        items: { type: Type.STRING },
      },
      cookingTime: { type: Type.INTEGER, description: "Total cooking time in minutes." },
      difficulty: { type: Type.STRING, description: "Difficulty level, one of: 'Easy', 'Medium', 'Hard'." },
      servings: { type: Type.INTEGER, description: "The number of servings the recipe yields." },
      nutritionalInfo: {
        type: Type.OBJECT,
        description: "Approximate nutritional information per serving.",
        properties: {
          calories: { type: Type.STRING, description: "e.g., '350 kcal'" },
          protein: { type: Type.STRING, description: "e.g., '15g'" },
          carbs: { type: Type.STRING, description: "e.g., '30g'" },
          fat: { type: Type.STRING, description: "e.g., '20g'" },
        },
        required: ['calories', 'protein', 'carbs', 'fat'],
      },
    },
    required: ['id', 'name', 'description', 'ingredients', 'instructions', 'cookingTime', 'difficulty', 'servings', 'nutritionalInfo'],
};


export const generateRecipes = async (
    ingredients: string[],
    dietaryPreferences: DietaryPreference[],
    difficulty: Difficulty,
    cookingTime: number
): Promise<Recipe[]> => {
    
    let prompt = `Generate 3 unique and creative recipes based on the following criteria.

    Available ingredients: ${ingredients.join(', ')}. You can include a few common pantry staples not on this list (like salt, pepper, water).
    
    `;

    if (dietaryPreferences.length > 0) {
        prompt += `Dietary requirements: ${dietaryPreferences.join(', ')}.\n`;
    }
    if (difficulty !== 'Any') {
        prompt += `Difficulty level: ${difficulty}.\n`;
    }
    prompt += `Maximum cooking time: ${cookingTime} minutes.\n`;
    
    prompt += `For each recipe, provide a detailed breakdown. The difficulty must be one of 'Easy', 'Medium', or 'Hard'. The response must be a JSON array of recipe objects.`;

    try {
        // FIX: Use ai.models.generateContent to generate recipes.
        const response = await ai.models.generateContent({
            // FIX: Use 'gemini-2.5-flash' for basic text tasks.
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: recipeSchema,
                },
            },
        });
        
        // FIX: Access response text directly and parse it.
        const text = response.text;
        const recipes: Recipe[] = JSON.parse(text);

        // Calculate match percentage
        return recipes.map(recipe => {
            const recipeIngredientsLower = recipe.ingredients.map(ing => ing.toLowerCase());
            const availableIngredientsLower = ingredients.map(ing => ing.toLowerCase());
            
            const matchCount = availableIngredientsLower.filter(availableIng => 
                recipeIngredientsLower.some(recipeIng => recipeIng.includes(availableIng))
            ).length;
            
            const matchPercentage = ingredients.length > 0 ? (matchCount / availableIngredientsLower.length) * 100 : 0;
            
            return {
                ...recipe,
                matchPercentage: Math.min(matchPercentage, 100), // Cap at 100
            };
        });

    } catch (error) {
        console.error("Error generating recipes:", error);
        return [];
    }
};

export const identifyIngredientsFromImage = async (base64Image: string): Promise<string[]> => {
    const prompt = "Identify the food ingredients in this image. Respond with a JSON object that has a single key 'ingredients' which is an array of strings. List only the names of the ingredients. If there are no food items, return an empty array for the 'ingredients' key.";

    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };

    const textPart = {
        text: prompt,
    };

    try {
        // FIX: Use ai.models.generateContent for multimodal input.
        const response = await ai.models.generateContent({
            // FIX: Use 'gemini-2.5-flash' which is vision-capable.
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        ingredients: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        },
                    },
                    required: ['ingredients'],
                }
            }
        });

        // FIX: Access response text directly and parse it.
        const text = response.text;
        const result = JSON.parse(text);
        return result.ingredients || [];
    } catch (error) {
        console.error("Error identifying ingredients from image:", error);
        return [];
    }
};
