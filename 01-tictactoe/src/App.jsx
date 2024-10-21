import { useState } from 'react'
import { Square } from './components/Square.jsx'
import { TURNS } from './constants.jsx'
import { WinnerModal} from './components/WinnerModal.jsx'
import {checkWinner, checkEndGame} from './logic/checkGame.jsx'
import confetti from 'canvas-confetti'
import './App.css'

function App() {

    const [board, setBoard] = useState(() => {
        const boardFromLocalStorage = window.localStorage.getItem('board')
        return boardFromLocalStorage 
        ? JSON.parse(boardFromLocalStorage)
        : Array(9).fill(null)
    })
    const [turn, setTurn] = useState(() => {
        const boardFromLocalStorage = window.localStorage.getItem('turn')
        return boardFromLocalStorage ?? TURNS.X
    })
    const [winner, setWinner] = useState(null)

    const resetAll = () => {
        setBoard(Array(9).fill(null))
        setTurn(TURNS.X)
        setWinner(null)
        window.localStorage.removeItem('board')
        window.localStorage.removeItem('turn')
    }

    const updateBoard = (index) => {
        if (board[index] || winner){
            return
        }
    
        const newBoard = [...board]
        newBoard[index] = turn
        setBoard(newBoard)
    
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
        setTurn(newTurn)

        window.localStorage.setItem('board', JSON.stringify(newBoard))
        window.localStorage.setItem('turn', newTurn)
    
        const newWinner = checkWinner(newBoard)
        if (newWinner) {
            confetti()
            console.log(`Winner: ${newWinner}`)
            setWinner(newWinner)
        }
        else if (checkEndGame(newBoard)){
            console.log("TIE")
            setWinner(false)
        }
    }

    return (
        <main className='board'>
            <h1>Tic Tac Toe</h1>
            <button onClick={resetAll}>RESET GAME</button>
            <section className="game">
                {
                    board.map((_, index) => {
                        return(
                        <Square 
                            key={index}
                            index={index}
                            updateBoard={updateBoard}
                        >
                            {board[index]}
                        </Square>
                        )
                    })
                }
            </section>
            
            <section className="turn">
                <Square isSelected={turn === TURNS.X}>
                    {TURNS.X}
                </Square>
                <Square isSelected={turn === TURNS.O}>
                    {TURNS.O}
                </Square>
            </section>
            <WinnerModal winner={winner} resetAll={resetAll}/>
        </main>
    )
}

export default App
