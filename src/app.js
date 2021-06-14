'use strict';

const specialCards = {
  skip: `<i class="far fa-times-circle fa-xs"></i>`,
  reverse: `<i class="fas fa-exchange-alt fa-xs"></i>`,
  draw2: `<i class="fas fa-plus fa-xs"></i>2`,
};

const colors = {
  red: 'rgb(230,0,0)',
  yellow: 'rgb(255,208,0)',
  green: 'rgb(7,170,56)',
  blue: 'rgb(0,35,230)',
};

const cardInfo = {
  // color, face, faceUp, value, ! point
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
  color: [colors.red, colors.yellow, colors.green, colors.blue],
};

const create1Set = () => {
  const set = cardInfo.color.map((color) => {
    const cards = [];
    let point = 0;
    cardInfo.face.forEach((face, i) => {
      const card = {
        color: color,
        faceUp: false,
        value: cardInfo.value[i],
        face: face,
        color: color,
        point: point,
      };
      point++;
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

//////////////////////////////////////////////////////
//// * GAME STATUS 🐸
//////////////////////////////////////////////////////

const game = {
  players: ['user', 'pc1', 'pc2'],
  currPlayer: 'pc1',
  currIndex: 1,
  nextIndex: null,
  currCard: null, //FIXME
  isSpecialValid: false,
};

const playerHands = {
  user: [],
  pc1: [],
  pc2: [],
};

const board = {
  deck: createDeck(),
  drawPile: [],
  discardPile: [],
};

///////////////////////////////////////////////////////////////
// * GAME PLAYER FLOW 🦄
///////////////////////////////////////////////////////////////
const getRandomNum = (limit) => Math.floor(Math.random() * limit);
const setCurrIndex = (game) => {
  game.currIndex = game.players.indexOf(game.currPlayer);
};

// In case of skip, reverse, I need to make a function to get NextIndex and  get the index as return.
const getNextIndex = (game) => {
  const nextIndex =
    game.currIndex === game.players.length - 1 ? 0 : game.currIndex + 1;
  return nextIndex;
};

const changePlayer = (game) => {
  // Before Change
  game.nextPlayer = game.players[getNextIndex(game)];

  // Changing
  game.currPlayer = game.nextPlayer;
  game.currIndex = game.nextIndex;

  // After Change
  game.nextIndex = getNextIndex(game);
};

/////////////////////////////////////////////////////////////////
// * CREATE TEMPLATES 🐰
/////////////////////////////////////////////////////////////////
// MUST ADD CLASS IF NEEDED
const getCardTemplate = (card) => {
  let template = '';
  if (card.value !== 'wild' && card.value !== 'wildDraw4') {
    template = `
      <div class="card" style="background-color: ${card.color}">
          <p class="card__value card__value--top">${card.face}</p>
          <div class="card__circle"></div>
          <p class="card__value card__value--main">${card.face}</p>
          <p class="card__value card__value--bottom">${card.face}</p>
      </div>`;
  } else if (card.value === 'wild') {
    template = `
      <div class="card" style="background-color: ${card.color}">
      <p class="card__value card__value--top">
        
      </p>
      <div class="card__circle"></div>
      <div class="wild">
        <div style="background-color: ${colors.red}"></div>
        <div style="background-color:${colors.yellow}"></div>
        <div style="background-color: ${colors.green}"></div>
        <div style="background-color: ${colors.blue}"></div>
      </div>
      <p class="card__value card__value--bottom">
        
      </p>
    </div>
        `;
  } else if (card.value === 'wildDraw4') {
    template = `
      <div class="card" style="background-color: ${card.color}">
      <p class="card__value card__value--top">
        <i class="fas fa-plus"></i>4
      </p>
      <div class="card__circle"></div>
      <div class="wild">
        <div style="background-color: ${colors.red}"></div>
        <div style="background-color: ${colors.yellow}"></div>
        <div style="background-color: ${colors.green}"></div>
        <div style="background-color: ${colors.blue}"></div>
      </div>
      <p class="card__value card__value--bottom">
        <i class="fas fa-plus"></i>4
      </p>
    </div>
        
        `;
  }
  return template;
};

const getPcCardTemplate = () => {
  return `
        <div class="card">
            <div class="card__circle faceDown"></div>
        </div>
    `;
};

const getColorChangeModalTemplate = () => {
  return `
  
    <div class="changeModal">
        <h3>Choose and click a new color</h3>
        <div class="colorBox">
          <div id="red"></div>
          <div id="yellow"></div>
          <div id="green"></div>
          <div id="blue"></div>
        </div>
      </div>
  
  `;
};

/////////////////////////////////////////////////////////////////
// * RENDER CARDS 🎨
/////////////////////////////////////////////////////////////////
const renderChooseTurn = (card) => {
  // render to $(`.choose__user--card`)
  const template = getCardTemplate(card);
  $(`.choose__${card.player}--card`).html(template);

  $('.chooseBox .card').addClass('discard__card');
};

// render ONE player's hand.
const renderHand = (player) => {
  const template = playerHands[player]
    .map((card) =>
      player === 'user' ? getCardTemplate(card) : getPcCardTemplate()
    )
    .join('');
  $(`.${player}Hand`).html(template);

  if (player === 'user') $('.userHand .card').addClass('userCard');
};

const renderDrawPile = (board) => {
  const template = board.drawPile.map((card) => getPcCardTemplate()).join(' ');

  $('.draw__cards').html(template);
  $('.draw__cards .card').addClass('draw__card');
  $('.draw__remain-num').text(board.drawPile.length);
};

const renderDiscardPile = (game) => {
  //currCard one card is enough
  const template = getCardTemplate(game.currCard);
  $('.discard').html(template);
  $('.discard .card').addClass('discard__card');
};

const renderCurrPlayerTurnClass = (game) => {
  $('.hand').removeClass('turn');
  $(`.${game.currPlayer}Hand`).addClass('turn');
};

/////////////////////////////////////////////////////////////////
// * GAME FUNCTIONS 🦊
/////////////////////////////////////////////////////////////////
const shuffleDeck = () => {
  for (let i = 0; i < board.deck.length; i++) {
    const randomIndex = getRandomNum(board.deck.length);
    [board.deck[i], board.deck[randomIndex]] = [
      board.deck[randomIndex],
      board.deck[i],
    ];
  }
};

const deal7CardsToEachPlayers = () => {
  for (let i = 0; i < 7; i++) {
    for (const player in playerHands) {
      const card = board.deck.pop();
      playerHands[player].push(card);
    }
  }
  //! 🎨 render : now i have each players name : user, pc1, pc2
  game.players.forEach((player) => {
    renderHand(player);
  });
};

const remainingCardsToDrawPile = () => {
  // board deck is empty. Move all cards to draw pile
  board.drawPile = board.deck.splice(0);

  //! 🎨 render
  renderDrawPile(board);
};

const drawOneCard = (pushTo) => {
  const drawCard = board.drawPile.pop();

  playerHands[pushTo].push(drawCard);

  //! render drawPile🎨
  renderDrawPile(board);

  return drawCard;
};

const flipOneDrawPileToDiscardPile = () => {
  const flippedCard = board.drawPile.pop();
  board.discardPile.push(flippedCard);

  game.currCard = flippedCard;
  //! render 🎨
  renderDiscardPile(game);

  //TODO;
  //! maybe i can add some css animation here or give timeout.
  //! animation for discard pile  like flip.

  // If flip card is wild or wildDraw4, I will repeat this function until flip card is one of other value card.
  if (flippedCard.value === 'wild' || flippedCard.value === 'wildDraw4') {
    const wildCard = board.discardPile.pop();
    // Return to deck
    board.deck.push(wildCard);
    return flipOneDrawPileToDiscardPile();
  }
};

const checkPcHand = (whoes) => {
  const matchedArray = [];
  const currCard = game.currCard;
  const hand = playerHands[whoes];

  hand.forEach((card) => {
    if (card.color === currCard.color || card.value === currCard.value)
      matchedArray.push(card);
  });

  return matchedArray;
};

const showChangeModal = () => {
  const template = getColorChangeModalTemplate();
  const $colorModal = $('<div>').addClass('changeColorPage none');
  $colorModal.html(template);
  $('body').prepend($colorModal);
};

const getNewColor = (e) => {
  const newColor = e.target.attr('id');
  game.currCard.color = newColor;
};

/////////////////////////////////////////////////////////////////
// * SPECIAL CARDS!! 🐥
/////////////////////////////////////////////////////////////////
//! JUST FOCUS ON SPECIAL CARDS' METHODS

const repeat = (num, what, arg) => {
  for (let i = 0; i < num; i++) {
    what(arg);
  }
};

const specialCardsMethod = {
  skip(game) {
    repeat(2, changePlayer, game);
  },
  draw2(game) {
    const nextIndex = getNextIndex(game);
    const nextPlayer = game.players[nextIndex];
    drawOneCard(nextPlayer);
    repeat(2, changePlayer, game);
  },
  reverse(game) {
    const reversedPlayers = game.players.reverse();
    game.players = reversedPlayers;
    setCurrIndex(game);
  },
  wild(game) {
    if (game.currPlayer === 'user') {
      $('.changeColorPage').removeClass('none');
      $('.colorBox').on('click', getNewColor);
      repeat(2, changePlayer, game);
    } else {
      // pc1, pc2
      const newColor = game.colors[getRandomNum(game.colors.length)];
      game.currCard.color = newColor;
      repeat(2, changePlayer, game);
    }
  },
  wildDraw4(game) {
    // TODO
    let nextPlayer;
    if (game.currPlayer === 'user') {
      $('.changeColorPage').removeClass('none');
      $('.colorBox').on('click', getNewColor);
    } else {
      // pc1, pc2
      const newColor = game.colors[getRandomNum(game.colors.length)];
      const nextIndex = getNextIndex(game);
      nextPlayer = game.players[nextIndex];
      game.currCard.color = newColor;
    }
    repeat(4, drawOneCard, nextPlayer);
    repeat(2, changePlayer, game);
  },
};

//HERE
// TODO - jun 14th
// 1. pc chosen card  is special cards??

// 2. user case
/////////////////////////////////////////////////////////////////
// * GAME FLOW - PC1 / PC2 !! 🦊
/////////////////////////////////////////////////////////////////
// TODO
const activateSpecialCards = () => {
  // If skip => specialCardsMethods  need to evoke that function
};

const pcTurn = (currPlayer) => {
  // check pc hand first if it has matched card with curr card
  const matchingResult = checkPcHand(currPlayer);

  console.log('matchingResult', matchingResult);

  //! WHEN PC HAS A CARD 🅾️
  //* when there are results or is a result
  if (matchingResult) {
    let chosenCard;
    if (matchingResult.length === 1) {
      chosenCard = matchingResult[0];
    }
    if (matchingResult.length > 1) {
      const randomIndex = getRandomNum(matchingResult.length);
      chosenCard = matchingResult[randomIndex];
    }
    console.log('prevCurrCard', game.currCard);
    game.currCard = chosenCard;

    console.log('chosenCard', chosenCard ?? chosenCard);

    // if(chosenCard.value)
    // remove chosencard   to discardpile
    const cardIndexInHand = playerHands[currPlayer].indexOf(chosenCard);
    const card = playerHands[currPlayer].splice(cardIndexInHand, 1);
    board.discardPile.push(card);

    //! render currhand and discardpile🎨
    setTimeout(() => {
      renderHand(currPlayer);
      renderDiscardPile(game);
    }, 2000);

    //! WHEN PC DOESN'T HAVE A CARD ❌
  } else {
    drawOneCard(currPlayer);
    renderDrawPile(board);
  }
  console.log('beforeChangePlayer', game);
  changePlayer(game);
  console.log('afterChangePlayer', game);
};

/////////////////////////////////////////////////////////////////
// * GAME FLOW!! 🦊
/////////////////////////////////////////////////////////////////
const gameFlow = () => {
  // if top card is skip or reverse or draw2, do sth.
  // this will be repeated during whole game session.
  // I need some functions for each special cards.

  // if currPlayer is pc1 or pc2
  const currPlayer = game.currPlayer;

  if (currPlayer !== 'user') {
    renderCurrPlayerTurnClass(game);
    pcTurn(currPlayer);
  }
  // return gameFlow();
};

/////////////////////////////////////////////////////////////////
// * GAME START!! 🦊
/////////////////////////////////////////////////////////////////
const checkBeginningCard = () => {
  if (typeof game.currCard.value !== 'number') {
    const specialCard = game.currCard.value;

    if (specialCard === 'skip') {
      specialCardsMethod.skip(game);
    }
    if (specialCard === 'reverse') {
      specialCardsMethod.reverse(game);
    }
    if (specialCard === 'draw2') {
      drawOneCard(game.currPlayer);
      drawOneCard(game.currPlayer);
    }
  }
};

const startGame = () => {
  console.log('game start!');
  //* Doing all jobs related to Board deck! Cards!
  shuffleDeck();

  deal7CardsToEachPlayers();

  remainingCardsToDrawPile();

  if (!game.currCard) {
    // turn over the top card of drawpile    .pop()
    flipOneDrawPileToDiscardPile();
  }

  //! render turn 🎨
  renderCurrPlayerTurnClass(game);

  //* Check beginning card!
  checkBeginningCard();
  //! render currplayer hand 🎨
  renderHand(game.currPlayer);

  gameFlow();
};

/////////////////////////////////////////////////////////////////
// * CHOOSE TURN 🍻
/////////////////////////////////////////////////////////////////

const chooseTurn = (e) => {
  const userRandomCard = board.deck[getRandomNum(board.deck.length)];
  const pc1RandomCard = board.deck[getRandomNum(board.deck.length)];
  const pc2RandomCard = board.deck[getRandomNum(board.deck.length)];

  userRandomCard.player = 'user';
  pc1RandomCard.player = 'pc1';
  pc2RandomCard.player = 'pc2';

  const randomCards = [userRandomCard, pc1RandomCard, pc2RandomCard];
  const highest = randomCards.sort((a, b) => b.point - a.point)[0];

  //! 🎨 render
  randomCards.forEach((card) => {
    renderChooseTurn(card);
  });
  //! Remove btn
  $(e.target).addClass('none');
  $('.choose__msg').removeClass('none')
    .text(`${highest.player} has the highest value card!  
  ${highest.player} will be the starter!`);

  //! Update the game status.
  game.currPlayer = highest.player;
  setCurrIndex(game);

  //! GAME START!!
  setTimeout(() => {
    $('.choose__page').addClass('none');
    startGame();
  }, 5000);
};

/////////////////////////////////////////////////////////////////
// * MAIN
/////////////////////////////////////////////////////////////////

const main = () => {
  showChangeModal();
  $('.chooseTurn__btn').on('click', chooseTurn);
  startGame();
};

$(main);
