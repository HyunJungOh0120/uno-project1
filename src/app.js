'use strict';

const cardInfo = {
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
  color: ['red', 'yellow', 'green', 'blue'],
  red: 'rgb(230,0,0)',
  yellow: 'rgb(255,255,91)',
  green: 'rgb(7,170,56)',
  blue: 'rgb(0,35,230)',
};

/////////////////////////////////////////////////////////////////////////////////////////////
//// * GAME STATUS
/////////////////////////////////////////////////////////////////////////////////////////////

const game = {
  players: ['user', 'pc1', 'pc2'],
  currPlayer: null,
  currIndex: null,
  nextIndex: null,
  currCard: null,
  currColor: null,
  currValue: null,
};

const playerHands = {
  userHand: [],
  pc1Hand: [],
  pc2Hand: [],
};

const create1Set = () => {
  const set = cardInfo.color.map((color) => {
    const cards = [];
    cardInfo.value.forEach((val) => {
      const card = {
        color: color,
        faceUp: false,
        value: val,
        face: val,
        color: color,
      };
      cards.push(card);
    });
    return cards;
  });
  return set;
};

const createDeck = () => {
  const deck = [];
  const set1 = create1Set().map((row) => row.slice(0, -1)); // Remove wildDraw 4 from set 1
  const set2 = create1Set()
    .map((row) => row.slice(1))
    .map((row) => {
      row.splice(-2, 1);
      return row;
    }); // Remove wild and blank 0 cards.
  set1.forEach((row) => row.forEach((card) => deck.push(card)));
  set2.forEach((row) => row.forEach((card) => deck.push(card)));
  // Total 108 cards
  return deck;
};

const deck = createDeck();

/////////////////////////////////////////////////////////////////////////////////////////////
//// * GAME
/////////////////////////////////////////////////////////////////////////////////////////////
const randomNum = (limit) => Math.floor(Math.random() * limit);

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

const chooseTurn = () => {
  randomNum();
};

/////////////////////////////////////////////////////////////////////////////////////////////
//// * MAIN
/////////////////////////////////////////////////////////////////////////////////////////////

const main = () => {
  $('.chooseTurn__btn').on('click', chooseTurn);
};

$(main);
