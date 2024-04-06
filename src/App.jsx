import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import { useState } from "react";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import { Link } from 'react-router-dom';

// const WINNING_COMBINATIONS= [
//   //rows
//   [{row:0,col:0},{row:0,col:1},{row:0,col:2}],
//   [{row:1,col:0},{row:1,col:1},{row:1,col:2}],
//   [{row:2,col:0},{row:2,col:1},{row:2,col:2}],
//   //cols
//   [{row:0,col:0},{row:1,col:0},{row:2,col:0}],
//   [{row:0,col:1},{row:1,col:1},{row:2,col:1}],
//   [{row:0,col:2},{row:1,col:2},{row:2,col:2}],
//   //diagonals
//   [{row:0,col:0},{row:1,col:1},{row:2,col:2}],
//   [{row:0,col:2},{row:1,col:1},{row:2,col:0}],
// ];

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2',
}


const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns){
  let activePlayer = 'X';

  if(gameTurns.length > 0 && gameTurns[0].player === 'X'){
    activePlayer = 'O';
  }

  return activePlayer;
}


function deriveWinner(gameBoard, players){

  let winner;


for(const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if(firstSquareSymbol  && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol){
      //setHasWinner(true);
      winner = players[firstSquareSymbol];
      break;
    }
}

return winner;

}

function deriveGameBoard(gameTurns){
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];

  for (const turn of gameTurns) {
      const { square, player } = turn;
      const { row, col } = square;
      gameBoard[row][col] = player;
      //new changes
  }
  
  return gameBoard;
}





function App() {
  // const [players,setPlayers] = useState({
  //   X: 'Player 1',
  //   O: 'Player 2',
  // });

  const [players,setPlayers] = useState(PLAYERS);

  const [gameTurns,setGameTurns] =  useState([]);
  //const [hasWinner,setHasWinner] = useState(false);
 // const [activePlayer,setActivePlayer] = useState('X');

  const activePlayer = deriveActivePlayer(gameTurns);

  // let gameBoard = [...initialGameBoard.map(array => [...array])];

  //   for (const turn of gameTurns) {
  //       const { square, player } = turn;
  //       const { row, col } = square;
  //       gameBoard[row][col] = player;
  //   }

  const gameBoard = deriveGameBoard(gameTurns);

    const winner = deriveWinner(gameBoard,players);

//     function deriveWinner(gameBoard, players){

//     let winner;


//   for(const combination of WINNING_COMBINATIONS){
//       const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
//       const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
//       const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

//       if(firstSquareSymbol  && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol){
//         //setHasWinner(true);
//         winner = players[firstSquareSymbol];
//         break;
//       }
//   }

//   return winner;

// }

  const hasDraw = gameTurns.length === 9  && !winner;


  function handleSelectSquare(rowIndex,colIndex){
   // setActivePlayer((curActivePlayer) => curActivePlayer === 'X' ? 'O':'X');
    setGameTurns(prevTurns => {
      // let currentPlayer = 'X';

      // if(prevTurns.length > 0 && prevTurns[0].player === 'X'){
      //   currentPlayer = 'O';
      // }

      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        {square:{row: rowIndex,col:colIndex},player:currentPlayer},
        ...prevTurns,
      ];

        return updatedTurns;
    });
  }
   
  function handleRestart(){
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol,newName){
   setPlayers(prevPlayers =>{
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
   });
  }



  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
           initialName={PLAYERS.X}
           symbol="X" 
           isActive={activePlayer === 'X'}
            onNameChange={handlePlayerNameChange}
           />
          <Player 
          initialName={PLAYERS.O}
          symbol="O" 
          isActive={activePlayer === 'O'}
          onNameChange={handlePlayerNameChange}
           />
          {/* <li>
            <span className="player-info">
              <span className="player-name">Player 1</span>
              <span className="player-symbol">X</span>
            </span>
            <button>Edit</button>
          </li>
  
          <li>
            <span className="player-info">
              <span className="player-name">Player 2</span>
              <span className="player-symbol">O</span>
            </span>
            <button>Edit</button>
          </li>
  */}
        </ol>
     {/* {winner && <p>You won, {winner}!</p>} */}
      {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare={handleSelectSquare}
        board={gameBoard}
        />
      </div>
     
      

      <Log turns={gameTurns}/>
    </main>
  )
}

export default App
