import React, { useState, useEffect } from 'react';
import axios from 'axios';




const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/games')
      .then((res) => {
        setGames(res.data);
        setLoaded(true);
      })
      .catch((err) => {
        console.log(`Error fetching games: ${err}`);
      });
  }, []);


  // const handleGameClick = (gameId) => {
  //   setActiveGame(gameId);
  // };

  return (
    <div className="accordion" id="accordionExample">
      {loaded &&
        games.map((game, i) => {
          const isGameActive = activeGame === game.id;

          return (
            <div className="accordion-item" key={i}>
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="accordion-button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${i}`}
                  aria-expanded="false"
                  aria-controls={`#collapse${i}`}

                // onClick={() => handleGameClick(game.id)}
                >
                  {game.name}
                </button>
              </h2>
              <div
                id={`collapse${i}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${game.id}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  {game.howToPlay}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default GamesPage;



