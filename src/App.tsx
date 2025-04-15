import React, { useEffect, useState } from 'react';
import './App.css';
import { fetchDogBreeds } from './services/dogApi';
import { DogBreed } from './types/dogs';

function App() {
  const [dogBreeds, setDogBreeds] = useState<DogBreed[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  useEffect(() => {
    const loadDogBreeds = async () => {
      setIsLoading(true);
      const { dogBreeds, error, hasNextPage, currentPage: apiPage } = await fetchDogBreeds(currentPage);
      setDogBreeds(dogBreeds);
      setIsError(error);
      setHasNextPage(hasNextPage);
      setCurrentPage(apiPage);
      setIsLoading(false);
    };

    loadDogBreeds();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = 'none';
    event.currentTarget.parentElement?.classList.add('image-unavailable');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dog Breeds Gallery</h1>
      </header>
      <main>
        {isLoading ? (
          <p>Loading dog breeds...</p>
        ) : (
          <>
            {isError && (
              <p>Error loading from Server. Showing fallback data.</p>
            )}
            <div className="dog-breeds-container">
              {dogBreeds.map((dog, index) => (
                <div key={`${dog.breed}-${index}`} className="dog-card">
                  <div className="image-container">
                    <img 
                      src={dog.image} 
                      alt={dog.breed} 
                      onError={handleImageError}
                    />
                  </div>
                  <h3>{dog.breed}</h3>
                </div>
              ))}
            </div>
            
            {!isError && (
              <div className="pagination-controls">
                {currentPage > 1 && (
                  <button 
                    className="pagination-button prev" 
                    onClick={handlePrevPage}
                    disabled={isLoading}
                  >
                    ← Previous
                  </button>
                )}
                
                <span className="page-indicator">Page {currentPage}</span>
                
                {hasNextPage && (
                  <button 
                    className="pagination-button next" 
                    onClick={handleNextPage}
                    disabled={isLoading}
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
