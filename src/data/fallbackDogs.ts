import { DogBreed } from '../types/dogs';

// Fallback data in case the API call fails
export const fallbackDogs: DogBreed[] = [
  {
    breed: "Labrador Retriever",
    image: "https://images.dog.ceo/breeds/retriever-golden/n02099601_7303.jpg"
  },
  {
    breed: "German Shepherd",
    image: "https://images.dog.ceo/breeds/germanshepherd/n02106662_27694.jpg"
  },
  {
    breed: "Beagle",
    image: "https://images.dog.ceo/breeds/beagle/n02088364_12720.jpg"
  },
  {
    breed: "Bulldog",
    image: "https://images.dog.ceo/breeds/bulldog-english/jager-1.jpg"
  },
  {
    breed: "Poodle",
    image: "https://images.dog.ceo/breeds/poodle-standard/n02113799_2292.jpg"
  }
];
