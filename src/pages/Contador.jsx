import React, { useState } from 'react';
import './Contador.css'; // Ajusta los estilos según necesites

const Contador = () => {
  // Nombres de jugadores
  const [player1Name, setPlayer1Name] = useState("Jugador 1");
  const [player2Name, setPlayer2Name] = useState("Jugador 2");
  // Puntajes del set actual
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  // Número del set actual (1, 2 o 3)
  const [currentSet, setCurrentSet] = useState(1);
  // Resultados de cada set (arreglo de objetos)
  const [setResults, setSetResults] = useState([]);
  // Ganador del partido (si se determina)
  const [matchWinner, setMatchWinner] = useState(null);

  // Función para determinar si se ganó el set
  const checkSetWinner = (s1, s2) => {
    // Si ambos alcanzan o superan 10, se activa el modo de deuce (ventaja de 2 puntos)
    if (s1 >= 10 && s2 >= 10) {
      if (s1 - s2 >= 2) {
        recordSetResult(player1Name, s1, s2);
      } else if (s2 - s1 >= 2) {
        recordSetResult(player2Name, s1, s2);
      }
    } else {
      // Sin deuce: el primer en llegar a 11 gana el set
      if (s1 >= 11) {
        recordSetResult(player1Name, s1, s2);
      } else if (s2 >= 11) {
        recordSetResult(player2Name, s1, s2);
      }
    }
  };

  // Registra el resultado del set y, de ser necesario, determina el ganador del partido
  const recordSetResult = (winner, s1, s2) => {
    const result = { 
      set: currentSet, 
      player1Score: s1, 
      player2Score: s2, 
      winner 
    };
    const updatedResults = [...setResults, result];
    setSetResults(updatedResults);

    // Contamos la cantidad de sets ganados por cada jugador
    const player1Wins = updatedResults.filter(r => r.winner === player1Name).length;
    const player2Wins = updatedResults.filter(r => r.winner === player2Name).length;

    // En un partido de mejor de 3, el primer en ganar 2 sets es el ganador
    if (player1Wins === 2) {
      setMatchWinner(player1Name);
    } else if (player2Wins === 2) {
      setMatchWinner(player2Name);
    }

    // Si aún no se ha terminado el partido y quedan sets, se reinician los puntajes y se avanza al siguiente set
    if (currentSet < 3 && !matchWinner) {
      setCurrentSet(prev => prev + 1);
      setScore1(0);
      setScore2(0);
    }
  };

  // Funciones para incrementar puntos
  const incrementPlayer1 = () => {
    if (matchWinner) return;
    const newScore = score1 + 1;
    setScore1(newScore);
    checkSetWinner(newScore, score2);
  };

  const incrementPlayer2 = () => {
    if (matchWinner) return;
    const newScore = score2 + 1;
    setScore2(newScore);
    checkSetWinner(score1, newScore);
  };

  // Funciones para restar puntos (sin bajar de 0)
  const decrementPlayer1 = () => {
    if (matchWinner) return;
    setScore1(prev => Math.max(prev - 1, 0));
  };

  const decrementPlayer2 = () => {
    if (matchWinner) return;
    setScore2(prev => Math.max(prev - 1, 0));
  };

  // Reinicia todo para comenzar un nuevo partido
  const resetMatch = () => {
    setScore1(0);
    setScore2(0);
    setCurrentSet(1);
    setSetResults([]);
    setMatchWinner(null);
  };

  return (
    <div className="main-container-contador">
    <div className="tournament-container">
      <div className="logo-container">
        <a href="/">
          <img src="logoMK.png" alt="Logo Merkahorro" />
        </a>
      </div>
      <h1>Torneo de Ping Pong</h1>
      
      {/* Ingreso de nombres */}
      <div className="names-container">
        <input 
          type="text"
          value={player1Name}
          onChange={e => setPlayer1Name(e.target.value)}
          placeholder="Nombre Jugador 1"
          className="name-input"
        />
        <input 
          type="text"
          value={player2Name}
          onChange={e => setPlayer2Name(e.target.value)}
          placeholder="Nombre Jugador 2"
          className="name-input"
        />
      </div>

      {/* Set actual y puntajes */}
      <div className="current-set">
        <h3>Set {currentSet}</h3>
        <div className="scores-container">
          <div className="score-section">
            {score1 === 10 && score2 < 10 && (
              <div className="alert">¡{player1Name}, un punto más para ganar!</div>
            )}
            <h4>{player1Name}</h4>
            <p className="score">{score1}</p>
            <div className="buttons">
              <button onClick={incrementPlayer1} className="score-btn">+1</button>
              <button onClick={decrementPlayer1} className="score-btn">-1</button>
            </div>
          </div>
          <div className="score-section">
            {score2 === 10 && score1 < 10 && (
              <div className="alert">¡{player2Name}, un punto más para ganar!</div>
            )}
            <h4>{player2Name}</h4>
            <p className="score">{score2}</p>
            <div className="buttons">
              <button onClick={incrementPlayer2} className="score-btn">+1</button>
              <button onClick={decrementPlayer2} className="score-btn">-1</button>
            </div>
          </div>
        </div>
        {score1 === 10 && score2 === 10 && (
          <div className="deuce-alert">
            ¡Deuce! El próximo punto debe llevar una ventaja de 2 para ganar.
          </div>
        )}
      </div>

      {/* Resultados de sets */}
      <div className="sets-results">
        <h3>Resultados de Sets</h3>
        {setResults.length === 0 ? (
          <p>No se han jugado sets.</p>
        ) : (
          <ul>
            {setResults.map(result => (
              <li key={result.set}>
                Set {result.set}: {player1Name} {result.player1Score} - {result.player2Score} {player2Name}. Ganador: {result.winner}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ganador del partido */}
      {matchWinner && (
        <div className="match-winner">
          <h2>¡Ganador del Partido: {matchWinner}!</h2>
          <button onClick={resetMatch} className="reset-btn">Reiniciar Partido</button>
        </div>
      )}
    </div>
    </div>
  );
};

export { Contador };
