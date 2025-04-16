export interface DogBreed {
  breed: string;
  image: string;
}

export interface DogsApiResponse {
  breeds: DogBreed[];
  page: number;
  totalPages: number;
  error?: string;
}
