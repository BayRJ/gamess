'use client'
import './hangman.css'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  blockchainWordList,
  cryptocurrencyWordList,
  nftWordList,
} from './wordList'
export default function Home() {
  const [hint, setHint] = useState('')
  const [currentWord, setCurrentWord] = useState('a')
  const [category, setCategory] = useState('blockchain')
  const [wrongGuessCount, setWrongGuessCount] = useState(0)
  const [maxGuesses, setMaxGuesses] = useState(6)
  const [revealedLetters, setRevealedLetters] = useState([])
  const [correctLetters, setCorrectLetters] = useState([])
  const [disabledButtons, setDisabledButtons] = useState([])
  const [isPickingCategory, setIsPickingCategory] = useState(true)
  const [tries, setTries] = useState(3)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const lettersDisplayed = 'abcdefghijklmnopqrstuvwxyz'.split('')

  const playAgain = () => {
    setDisabledButtons([])
    setHint('')
    setCurrentWord('a')
    setWrongGuessCount(0)
    setMaxGuesses(6)
    setRevealedLetters([])
    setCorrectLetters([])
    getRandomWord()
  }

  const getRandomWord = () => {
    let currentCategory = blockchainWordList

    if (category === 'blockchain') currentCategory = blockchainWordList
    if (category === 'cryptocurrency') currentCategory = cryptocurrencyWordList
    if (category === 'nft') currentCategory = nftWordList
    console.log('current category: ', currentCategory)

    const { word, hint } =
      currentCategory[Math.floor(Math.random() * blockchainWordList.length)]
    setHint(hint)
    setCurrentWord(word)
    console.log('The word: ', word)
    const wordyWord = word
      .split('') // Split the word into individual characters
      .map((char, index) => <li key={index} className="letter"></li>)
    setRevealedLetters(Array(wordyWord.length).fill(''))
  }

  const handleButtonClick = (clickedLetter) => {
    console.log('Clicked Letter: ', clickedLetter)
    console.log('Current Word: ', currentWord)
    if (currentWord.includes(clickedLetter)) {
      // Update the revealed letters state
      let cpyCorrectLetters = [...correctLetters]
      console.log('This line is executer')
      const updatedRevealedLetters = revealedLetters.map((char, index) => {
        const currentCorrectLetter =
          currentWord[index] === clickedLetter && clickedLetter
        if (currentCorrectLetter) {
          setCorrectLetters((prevCorrectLetters) => {
            const updatedCorrectLetters = [
              ...prevCorrectLetters,
              currentCorrectLetter,
            ]
            return updatedCorrectLetters
          })
        }
        return currentWord[index] === clickedLetter ? clickedLetter : char
      })

      setRevealedLetters(updatedRevealedLetters)
    } else {
      setWrongGuessCount((prevCount) => {
        return prevCount + 1
      })
    }
    setDisabledButtons([...disabledButtons, clickedLetter])
  }

  if (wrongGuessCount === maxGuesses && !gameOver) {
    setRevealedLetters(currentWord.split(''))
    setGameOver(true)
    if (tries - 1 === 0) {
      setTimeout(() => {
        setTries(tries - 1)
      }, 2000)
    } else {
      setTries(tries - 1)
    }

    setTimeout(() => {
      setWrongGuessCount(0)
      setGameOver(false)
      playAgain()
    }, 2000)
  }
  if (correctLetters.length === currentWord.length) {
    setGameOver(true)
    setIsCorrect(true)
    setScore(score + 10)
    setCorrectLetters([])
    setTimeout(() => {
      setIsCorrect(false)
      setGameOver(false)
      playAgain()
    }, 2000)
  }

  useEffect(() => {
    playAgain()
    getRandomWord()
  }, [category])

  return (
    <div
      className={`${category === 'blockchain' ? 'bg-blue-900' : ''} 
      ${
        category === 'nft' && wrongGuessCount !== maxGuesses && !isCorrect
          ? 'bg-purple-900'
          : ''
      } 
      ${
        category === 'cryptocurrency' &&
        wrongGuessCount !== maxGuesses &&
        !isCorrect
          ? 'bg-yellow-900'
          : ''
      }  
      ${wrongGuessCount === maxGuesses ? 'bg-red-900' : ''} 
      ${isCorrect ? 'bg-green-900' : ''}
      flex items-center justify-center min-h-screen h-screen w-screen`}
    >
      {isPickingCategory ? (
        <div className=" picking-bg fixed bg-opacity-60 bg-black left-0 top-40 w-[100%] h-[110%]  flex items-center justify-center -mt-40 z-10 pointer-events-auto">
          <div className="game-modal content bg-white max-w-[1100px] w-full max-h-[570px] h-full text-center rounded-lg p-8 mb-24 flex flex-col justify-center items-center">
            <h4 className="text-5xl font-bold text-white">Choose category: </h4>
            <div className="title-buttons flex flex-col justify-around items-center">
              <div className="flex flex-col justify-between items-center gap-4 h-[250px] mt-10">
                <button
                  className="category-btn bg-blue-900 text-white w-[180%] text-4xl h-16 hover:bg-blue-300 hover:text-blue-900"
                  onClick={() => {
                    setCategory('blockchain')
                    setIsPickingCategory(false)
                  }}
                >
                  Blockchain
                </button>
                <button
                  className="category-btn bg-purple-700 text-white w-[180%] text-4xl h-16 hover:bg-purple-300 hover:text-purple-900"
                  onClick={() => {
                    setCategory('nft')
                    setIsPickingCategory(false)
                  }}
                >
                  NFT
                </button>
                <button
                  className="category-btn bg-yellow-700 text-white w-[180%] text-4xl h-16 hover:bg-yellow-300 hover:text-yellow-900"
                  onClick={() => {
                    setCategory('cryptocurrency')
                    setIsPickingCategory(false)
                  }}
                >
                  Cryptocurrency
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}

      {tries === 0 ? (
        <div className="picking-bg fixed bg-opacity-60 bg-black left-0 top-44 w-[100%] h-[110%]  flex items-center justify-center -mt-44 z-10 pointer-events-auto">
          <div className="game-modal content bg-white max-w-[1150px] w-full max-h-[570px] h-full text-center rounded-lg p-8 mb-24 flex flex-col justify-center items-center gap-10">
            <h4 className="text-4xl font-bold text-white">
              Total Score: {score}{' '}
            </h4>
            <h4 className="text-4xl font-bold text-white">
              Number of unscrambled words: {score / 10 < 0 ? 0 : score / 10}
            </h4>
            <button
              className="category-btn bg-black  text-white w-[50%] text-4xl h-16 hover:bg-white hover:text-black"
              onClick={() => {
                setTries(3)
                setScore(0)
                setIsPickingCategory(true)
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      ) : (
        ''
      )}

      {isCorrect || wrongGuessCount === maxGuesses ? (
        <div
          className={`fixed left-50 top-0  flex  justify-center mt-20 z-09 pointer-events-auto p-1`}
        >
          <div
            className={`content ${
              wrongGuessCount === maxGuesses ? 'bg-red-600' : ''
            } ${
              isCorrect ? 'bg-green-600' : ''
            } max-w-[400px] w-full max-h-[100px] h-full text-center rounded-lg p-8 mb-24 flex  justify-center items-center gap-10`}
          >
            <h4 className="text-4xl font-bold text-white">
              {wrongGuessCount === maxGuesses ? 'No more guesses' : ''}
              {isCorrect ? 'Correct Word' : ''}
            </h4>
          </div>
        </div>
      ) : (
        ''
      )}

      <div className="w-[1100px] bg-white flex flex-col py-14 px-10 rounded-xl items-end">
        <div className="flex justify-around gap-5 mr-4 -mt-8 items-center">
          <img
            src={`images/lives${tries}.png`}
            alt="lives-img"
            className=" w-40 max-h-32 h-16"
          />
          <h2 className="text-3xl mr-3">Score: {score}</h2>
        </div>
        <div className="flex gap-16">
          <div className="w-[300px] flex flex-col justify-center items-center">
            <img
              src={`images/BalloonMan${wrongGuessCount}.png`}
              alt="hangman-img"
              className="max-w-72 max-h-80"
            />
            <h1 className="text-2xl mt-5 text-center uppercase font-extrabold">
              Don't FALL
            </h1>
            {/* <h2>Tries: {tries}</h2>
          <h2>Score: {score}</h2> */}
          </div>
          <div className="game-box mt-24">
            <ul className="word-display flex list-none gap-3 items-center justify-center">
              {revealedLetters.map((char, index) => (
                <li key={index} className={`letter ${char ? 'guessed' : ''}`}>
                  {char || ''}
                </li>
              ))}
            </ul>
            <h4 className="hint-text text-2xl">
              Hint:
              <b className="text-xl"> {hint}</b>
            </h4>
            <h4 className="guesses-text text-red-600 text-xl">
              Incorrect guesses:
              <b>
                {wrongGuessCount}/{maxGuesses}
              </b>
            </h4>
            <div className="keyboard flex gap-1 flex-wrap justify-center mt-10">
              {lettersDisplayed.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleButtonClick(letter)}
                  disabled={
                    disabledButtons.includes(letter) ||
                    maxGuesses === wrongGuessCount ||
                    gameOver
                  }
                >
                  {letter.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
//
