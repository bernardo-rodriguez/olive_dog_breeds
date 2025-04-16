import { DogBreed, DogsApiResponse } from '../types/dogs';
import { fallbackDogs } from '../data/fallbackDogs';

const API_URL = '/api/dogs';
const MAX_RETRIES = 3;
const TIMEOUT_MS = 2000;
const INITIAL_BACKOFF_MS = 300;

export async function fetchDogBreeds(page: number = 1): Promise<{ 
  dogBreeds: DogBreed[], 
  error: boolean,
  hasNextPage: boolean,
  currentPage: number
}> {
  // Start with fallback data initially
  let result = { 
    dogBreeds: fallbackDogs, 
    error: true,
    hasNextPage: false,
    currentPage: 1
  };

  // Try to fetch the actual data with retries
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Calculate backoff time with exponential increase (correctly applying exponential backoff)
      const backoffTime = attempt > 0 ? INITIAL_BACKOFF_MS * Math.pow(2, attempt) : 0;
      
      if (backoffTime > 0) {
        console.log(`Backing off for ${backoffTime}ms before retry ${attempt + 1}`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
      
      const url = `${API_URL}?page=${page}`;
      console.log(`Attempting to fetch: ${url} (attempt ${attempt + 1}/${MAX_RETRIES})`);
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      
      const response = await fetch(url, { 
        signal: controller.signal
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      console.log('Raw response:', response);
      
      // Try to parse the JSON regardless of response status code
      let data: DogsApiResponse;
      try {
        data = await response.json();
        console.log('Response data:', data);
        
        // If we successfully got data with breeds, consider it a success
        // even if the status code is not ok
        if (Array.isArray(data) && data.length > 0) {
          // Handle the case where the API returns an array directly
          data = { breeds: data, page: page, totalPages: 10 };
        } else if (!Array.isArray(data) && !data.breeds && Array.isArray(data.error)) {
          // Handle the case where the API returns { error: [...] }
          data = { breeds: data.error, page: page, totalPages: 10 };
        } else if (!response.ok && (!data.breeds || data.error)) {
          throw new Error(`API request failed with status ${response.status}`);
        }
      } catch (jsonError) {
        console.error('Failed to parse response as JSON:', jsonError);
        throw new Error(`API returned invalid JSON with status ${response.status}`);
      }
      
      // Check for error in response if it's defined and not an array (arrays are now handled above)
      if (data.error !== undefined && !Array.isArray(data.error)) {
        console.error('API returned error response:', data);
        throw new Error(`API returned error: ${data.error}`);
      }
      
      const breeds = data.breeds || [];
      
      // Update result with successful response
      result = { 
        dogBreeds: breeds, 
        error: false,
        hasNextPage: breeds.length === 15, // Assume there's a next page if we have a full page of breeds (15)
        currentPage: data.page || page
      };
      
      // Successfully got data, exit retry loop
      break;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error fetching dog breeds (attempt ${attempt + 1}/${MAX_RETRIES}):`, {
        error,
        message: errorMessage,
        timestamp: new Date().toISOString()
      });
      
      // If it's the last attempt, we'll return the fallback data (already set in result)
      if (attempt === MAX_RETRIES - 1) {
        console.warn('All retry attempts failed. Using fallback data.');
      }
    }
  }
  
  return result;
}
