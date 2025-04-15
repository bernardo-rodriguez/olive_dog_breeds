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
    const breeds = data.breeds || [];
    
    // Check if there might be a next page by making a request for the next page
    let hasNextPage = false;
    if (breeds.length > 0) {
      const nextPageResponse = await fetch(`${API_URL}?page=${page + 1}&limit=${BREEDS_PER_PAGE}`);
      if (nextPageResponse.ok) {
        const nextPageData: DogsApiResponse = await nextPageResponse.json();
        hasNextPage = nextPageData.breeds && nextPageData.breeds.length > 0;
      }
    }
    
    return { 
      dogBreeds: breeds, 
      error: false,
      hasNextPage,
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
