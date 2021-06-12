'use strict';

const game = {
  players: ['user', 'pc1', 'pc2'],
  currPlayer: null,
  currIndex: null,
  nextIndex: null,
  currCard: null,
  currColor: null,
  currValue: null,
};

const getNextIndex = () => {
  const nextIndex =
    game.currIndex === game.players.length - 1 ? 0 : game.currIndex + 1;
  return nextIndex;
};

const changePlayer = () => {
  // Before Change
  game.nextPlayer = game.players[getNextIndex()];

  // Changing
  game.currPlayer = game.nextPlayer;
  game.currIndex = game.nextIndex;

  // After Change
  game.nextIndex = game.getNextIndex();
};

const card = {
  value: [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    'skip',
    'reverse',
    'draw2',
    'wild',
    'wildDraw4',
  ],
  suit: 8,
  face: [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    'skip',
    'reverse',
    'draw2',
    'wild',
    'wildDraw4',
  ],
  faceUp: false,
  color: ['red', 'yellow', 'green', 'blue'],
  red: 'rgb(230,0,0)',
  yellow: 'rgb(255,255,91)',
  green: 'rgb(7,170,56)',
  blue: 'rgb(0,35,230)',
};

const board = {};

const playerHands = {
  userHand: [],
  pc1Hand: [],
  pc2Hand: [],
};

/////////////////////////////////////////////////////////////////////////////////////////////
//// * GAME
/////////////////////////////////////////////////////////////////////////////////////////////

const chooseTurn = () => {};

/////////////////////////////////////////////////////////////////////////////////////////////
//// * MAIN
/////////////////////////////////////////////////////////////////////////////////////////////

const main = () => {
  $('.chooseTurn__btn').on('click', chooseTurn);
};

$(main);
