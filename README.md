# 🃏 UNO Card Game

**Uno Card**, turn based game created with HTML, CSS, javascript, jQuery

[Play here!](https://uno-project1.vercel.app/)

<br/><br/>

## 🌼 Introduction

This is a turn based game with **2 AI** and **1 player**, which automatically changes turns. I chose this because I wanted to be able to add more advanced game features which could only be offered with at least 3 players.

<br/><br/>

## 🚀 Features

- There are 3 players, 2 AI players and you (user).
- The game starts with each player picking up a random card, and the player who has the highest number card will start first.
- Each player will be dealt 7 cards at the beginning, and the player who gets rid of all their cards first is the winner.

- There are 5 special cards
  SPECIAL CARDS | METHODS
  --------------|----------
  skip | Next player forfeits turn
  reverse | Reverses the game direction
  draw 2 | Next player draws 2 cards
  wild | Current player can choose the card's color
  wild draw 4 | Same with wild card but next player also draws 4 cards

<br/><br/>

## 🎨 Visuals

**Game start screen :**

![Uno Choosing Turn Page](src/game_features/uno-choose.gif)

**Game flow :**

![Uno user playing](src/game_features/uno-play.gif)

**Wild card - Changing the current card's color :**

![Uno user playing](src/game_features/uno-wild.gif)

<br/><br/>

## Challenging part

Before wrting codes, I started to write down what to do and planned which methods I needed to use. The first challenge was :

- Setting up the data object
  - In the game, I need three elements : Board, Players, Game status.
  - It was challenging to connect all three parts, so I ended up making Board object, Game status object, Players hands object
- Special Cards Methods
  - There are only 5 special cards, but since there are AI players and user, I had to make 2 different ways (functions) for each methods.
- Game flow

  - I made a function called 'gameFlow' in which there are conditions to check if the current player is user or AI and executes the playing function accordingly, which will return the function itself. This 'gameFlow' function will be recursively called, so that the game is continued and players can take turns.
  - Because of the special cards above 🃏, it was challenging to create the code path clearly for each AI and player, to execute all special functions (e.g. reverse, skip) and then return to 'gameFlow' function. (So many times, the game played by itself, even though I didn't click anything! 👻)
  - I got this idea from 'Quick Sort' Algorithm. This taught me a lot about how to write and use function, instead of using only 'for' loops (e.g. for, for..of, forEach)

    <br></br>

## Future updates

- [x] Show hints : If user hasn't played for 3 seconds, cards will illuminate to prompt the player.
- [ ] Add special card which draws 1 card to each side players (left & right).
- [ ] Add options to let user choose the card color on game start page.
- [ ] Add features to save the game score & data.

<br></br>

## 💻 Technologies

Project is created with:

- HTML
- CSS
- JAVASCRIPT : as Main Coding Language
- JQUERY with DOM

<br/><br/>

## Launch

[🏆 Play here!](https://uno-project1.vercel.app/)

<br></br>

## Author

Hello, I'm Oh Hyun Jung (Agnes) from South Korea 🇰🇷 based in Singapore 🇸🇬.

- [GitHub Profile](https://github.com/HyunJungOh0120)
- [Email](mailto:hyunjung.agnes.oh@gmail.com?subject=Hi% 'Hi!')

<br></br>

## Contribution

Sound effects obtained from <https://www.zapsplat.com>
