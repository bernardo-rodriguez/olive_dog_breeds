import { DogBreed, DogsApiResponse } from '../types/dogs';
import { fallbackDogs } from '../data/fallbackDogs';

const API_URL = 'https://interview-api-olive.vercel.app/api/dogs';
const BREEDS_PER_PAGE = 15;

export async function fetchDogBreeds(page: number = 1): Promise<{ 
  dogBreeds: DogBreed[], 
  error: boolean,
  hasNextPage: boolean,
  currentPage: number
}> {
  try {
    const response = await fetch(`${API_URL}?page=${page}&limit=${BREEDS_PER_PAGE}`);
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data: DogsApiResponse = await response.json();
    
    return { 
      dogBreeds: data.breeds || [], 
      error: false,
      hasNextPage: data.next_page || false,
      currentPage: data.page || page
    };
  } catch (error) {
    console.error('Error fetching dog breeds:', error);
    // Fall back to hardcoded data
    return { 
      dogBreeds: fallbackDogs, 
      error: true,
      hasNextPage: false,
      currentPage: 1
    };
  }
}
