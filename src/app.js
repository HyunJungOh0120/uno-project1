'use strict';

const specialCards = {
  skip: '<i class="far fa-times-circle"></i>',
  reverse: '<i class="fas fa-exchange-alt"></i>',
  draw2: '<i class="fas fa-plus"></i>2',
};

const cardInfo = {
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
    specialCards.skip,
    specialCards.reverse,
    specialCards.draw2,
    'wild',
    'wildDraw4',
  ],
  color: ['red', 'yellow', 'green', 'blue'],
  red: 'rgb(230,0,0)',
  yellow: 'rgb(255,255,91)',
  green: 'rgb(7,170,56)',
  blue: 'rgb(0,35,230)',
};

const create1Set = () => {
  const set = cardInfo.color.map((color) => {
    const cards = [];
    let value = 0;
    cardInfo.face.forEach((face) => {
      const card = {
        color: color,
        faceUp: false,
        value: value,
        face: face,
        color: color,
      };
      value++;
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

const board = {
  deck: createDeck(),
  drawPile: [],
  discardPile: [],
};

///////////////////////////////////////////////////////////////
// * GAME
///////////////////////////////////////////////////////////////
const getRandomNum = (limit) => Math.floor(Math.random() * limit);

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

const getCardTemplate = (card) => {
  let template = '';
  if (card.face !== 'wild' || card.face !== 'wildDraw4') {
    template = `
      <div class="card">
          <p class="card__value card__value--top">${card.face}</p>
          <div class="card__circle"></div>
          <p class="card__value card__value--main">${card.face}</p>
          <p class="card__value card__value--bottom">${card.face}</p>
      </div>`;
  } else if (card.face === 'wild') {
    template = `
      <div class="card">
      <p class="card__value card__value--top">
        <i class="fas fa-border-all"></i>
      </p>
      <div class="card__circle"></div>
      <div class="wild">
        <div style="background-color: rgb(230, 0, 0)"></div>
        <div style="background-color: rgb(255, 221, 27)"></div>
        <div style="background-color: rgb(7, 170, 56)"></div>
        <div style="background-color: rgb(41, 66, 207)"></div>
      </div>
      <p class="card__value card__value--bottom">
        <i class="fas fa-border-all"></i>
      </p>
    </div>
        `;
  } else if (card.face === 'wildDraw4') {
    template = `
      <div class="card">
      <p class="card__value card__value--top">
        <i class="fas fa-plus"></i>4
      </p>
      <div class="card__circle"></div>
      <div class="wild">
        <div style="background-color: rgb(230, 0, 0)"></div>
        <div style="background-color: rgb(255, 221, 27)"></div>
        <div style="background-color: rgb(7, 170, 56)"></div>
        <div style="background-color: rgb(41, 66, 207)"></div>
      </div>
      <p class="card__value card__value--bottom">
        <i class="fas fa-plus"></i>4
      </p>
    </div>
        
        `;
  }
  return template;
};

const chooseTurn = () => {
  const checkingArray = [];
  const user = board.deck[getRandomNum(board.deck.length)];
  const pc1 = board.deck[getRandomNum(board.deck.length)];
  const pc2 = board.deck[getRandomNum(board.deck.length)];

  checkingArray.push(user);
  checkingArray.push(pc1);
  checkingArray.push(pc2);

  const highest = checkingArray.sort()[0];

  // how to render?  discard__card  class

  console.log('highest', highest);
};

chooseTurn();

/////////////////////////////////////////////////////////////////
// * MAIN
/////////////////////////////////////////////////////////////////
//console.log(board.deck);
console.log(game);

const main = () => {
  $('.chooseTurn__btn').on('click', chooseTurn);
};

$(main);
