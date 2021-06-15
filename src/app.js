'use strict';
const DELAY = 3000;
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

const createDeck = (board) => {
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
  board.deck = deck;
};

//////////////////////////////////////////////////////
//// * GAME STATUS 🐸
//////////////////////////////////////////////////////

const game = {
  players: ['user', 'pc1', 'pc2'],
  currPlayer: 'user',
  currIndex: 0,
  nextPlayer: null,
  nextIndex: 1,
  currCard: null, //FIXME
  isPCturn: true,
  isSkipped: false,
};

const playerHands = {
  user: [],
  pc1: [],
  pc2: [],
};

const board = {
  deck: [],
  drawPile: [],
  discardPile: [],
};

///////////////////////////////////////////////////////////////
// * GAME PLAYER FLOW 🦄
///////////////////////////////////////////////////////////////
const getRandomNum = (limit) => Math.floor(Math.random() * limit);
const getCurrIndex = (game) => {
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
  const nextPlayer = game.players[getNextIndex(game)];
  const nextIndex = getNextIndex(game);
  //console.log('Before Change nextPlayer', nextPlayer);

  // Changing
  game.currPlayer = nextPlayer;
  game.currIndex = nextIndex;

  //console.log('After Change currPlayer', game.currPlayer);
  // After Change
  game.nextIndex = getNextIndex(game);
  game.nextPlayer = game.players[game.nextIndex];
  //console.log('After Change nextPlayer', game.nextPlayer);
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

const toggleCurrPlayerSkipClass = (game) => {
  $('.hand').removeClass('skip');
  $(`.${game.currPlayer}Hand`).toggleClass('skip');
};

const renderDrawAndDiscard = () => {
  renderDrawPile(board);
  renderDiscardPile(game);
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
};
// TODO
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

// TODO
const getNewColor = (e) => {
  $('.changeColorPage').addClass('none');
  const $chosenColor = $(e.target).css('background-color').replace(/\s/g, '');
  game.currCard.color = $chosenColor;
  //! render userHand and discardPile 🎨

  renderRefresh(game);
  changePlayer(game);
  return gameFlow(game);
};

const $colorChangeModalReset = (colors) => {
  $('#red').css('background-color', colors.red);
  $('#yellow').css('background-color', colors.yellow);
  $('#green').css('background-color', colors.green);
  $('#blue').css('background-color', colors.blue);
};

const showColorChangeModal = (game) => {
  console.log('change color');
  //! show modal and re-assure the modal colors
  $('.changeColorPage').removeClass('none');
  $colorChangeModalReset(colors);

  return $('.colorBox').on('click', getNewColor);
};

const renderRefresh = (game) => {
  renderDiscardPile(game);
  renderDrawAndDiscard(game);

  for (const player in playerHands) {
    renderHand(player);
  }
};

/////////////////////////////////////////////////////////////////
// * SPECIAL CARDS!! 🐥
/////////////////////////////////////////////////////////////////
const repeat = (num, what, arg) => {
  for (let i = 0; i < num; i++) {
    what(arg);
  }
};

const specialCardsMethod = {
  skip(game) {
    changePlayer(game);
    // turn on
    toggleCurrPlayerSkipClass(game);

    game.isSkipped = true;
    console.log(`❌ ${game.currPlayer} skipped!`);
  },
  draw2(game) {
    const nextPlayer = game.players[getNextIndex(game)];
    repeat(2, drawOneCard, nextPlayer);
  },
  reverse(game) {
    const reversedPlayers = game.players.reverse();
    game.players = reversedPlayers;
    getCurrIndex(game);
  },
  wild(game) {
    if (game.currPlayer !== 'user') {
      // pc1, pc2
      const colorArr = Object.keys(colors);
      const newColor = colors[colorArr[getRandomNum(colorArr.length)]];

      game.currCard.color = newColor;
      renderRefresh(game);
      changePlayer(game);
      return gameFlow(game);
    }
    if (game.currPlayer === 'user') {
      return showColorChangeModal(game);
    }
  },
  wildDraw4(game) {
    const nextPlayer = game.players[getNextIndex(game)];
    if (game.currPlayer !== 'user') {
      // pc1, pc2
      const colorArr = Object.keys(colors);
      const newColor = colors[colorArr[getRandomNum(colorArr.length)]];

      game.currCard.color = newColor;
      repeat(4, drawOneCard, nextPlayer);
      renderRefresh(game);
      changePlayer(game);
      return gameFlow(game);
    }
    if (game.currPlayer === 'user') {
      return showColorChangeModal(game);
    }
  },
};

const activateSpecialCards = (game) => {
  // SKIP, DRAW2, WILD4   HAS CHANGEPLAYER
  // REVERSE, WILD        NO  CHANGEPLAYER, no gameflow
  const cardValue = game.currCard.value;

  if (cardValue !== 'wild' && cardValue !== 'wildDraw4') {
    if (cardValue !== 'skip') {
      if (cardValue === 'draw2') {
        specialCardsMethod.draw2(game);
      }
      if (cardValue === 'reverse') {
        specialCardsMethod.reverse(game);
      }
      renderRefresh(game);
      changePlayer(game);
      return gameFlow(game);
    } else {
      specialCardsMethod.skip(game);
      renderRefresh(game);
      return gameFlow(game);
    }
  }
  if (cardValue === 'wild') {
    specialCardsMethod.wild(game);
  }
  if (cardValue === 'wildDraw4') {
    specialCardsMethod.wildDraw4(game);
  }
};
/////////////////////////////////////////////////////////////////
// * GAME FLOW - PC1 / PC2 !! 🦊
/////////////////////////////////////////////////////////////////

const pcTurn = () => {
  if (game.currPlayer === 'user') return;
  renderCurrPlayerTurnClass(game);
  console.log('💻');
  const currPlayer = game.currPlayer;
  const matchingResult = checkPcHand(currPlayer);

  //! WHEN PC HAS A CARD 🅾️
  //* when there are results or is a result
  if (matchingResult.length >= 1) {
    let chosenCard;
    if (matchingResult.length === 1) {
      chosenCard = matchingResult[0];
    } else if (matchingResult.length > 1) {
      const randomIndex = getRandomNum(matchingResult.length);
      chosenCard = matchingResult[randomIndex];
    }
    // change the current card
    game.currCard = chosenCard;

    //! remove chosencard from hand & move to discardpile
    const cardIndexInHand = playerHands[currPlayer].indexOf(chosenCard);
    const card = playerHands[currPlayer].splice(cardIndexInHand, 1);
    board.discardPile.push(card);
    console.log(game.currPlayer, ' GOT ', game.currCard.value);
    console.log('------------------------');

    activateSpecialCards(game);
  } else {
    //! WHEN PC DOESN'T HAVE A CARD ❌
    drawOneCard(currPlayer);

    console.log(' 💻 PC Draw new card ', game.currCard.value);
    console.log('------------------------');
    renderRefresh(game);
    changePlayer(game);
    return gameFlow(game);
  }
};

/////////////////////////////////////////////////////////////////
// * GAME FLOW - USER !! 🦊
/////////////////////////////////////////////////////////////////
const handlerUserCardClick = (e) => {
  const $chosenCard = $(e.currentTarget);
  if (!$chosenCard.hasClass('userCard')) return;
  const $cardIndex = $chosenCard.parent().children().index($chosenCard);
  const chosenCard = playerHands.user[$cardIndex];

  // if card is invalid , do nothing.
  if (
    chosenCard.value !== game.currCard.value &&
    chosenCard.color !== game.currCard.color
  )
    return;

  // if card is valid
  // change the curr card
  game.currCard = chosenCard;
  // take the chosen card from userhand and move to discardPile.
  const splicedCard = playerHands.user.splice($cardIndex, 1);
  board.discardPile.push(splicedCard);

  console.log('USER GOT: ', game.currCard.value, game.currCard.color);
  console.log('------------');

  activateSpecialCards(game);
};

const handlerDrawBtnClick = (e) => {
  console.log(e.target);
  console.log(e.currentTarget);
  console.log('USER DRAW CARD: ');

  // draw one card
  drawOneCard('user');
  renderRefresh(game);
  changePlayer(game);

  console.log('next player after user draw: ', game.currPlayer);
  console.log('------------------------');
  return gameFlow(game);
};

const userTurn = () => {
  if (game.currPlayer !== 'user') return;
  console.log('🧝‍♀️ ');
  $('.userCard').on('click', handlerUserCardClick);
  $('.draw__btn').off().on('click', handlerDrawBtnClick);
  //$('main').on('click', mainClick);
};

/////////////////////////////////////////////////////////////////
// * GAME FLOW!! 🦊
/////////////////////////////////////////////////////////////////
const gameFlow = (game) => {
  // TODO 6월 15일
  //* game end
  for (const hand in playerHands) {
    if (playerHands[hand].length === 0) {
      console.log('GAME OVER', hand, 'won!');
      return;
    }
  }

  console.log('🌿 NEXT: ', game.currPlayer);
  console.log('CUR CARD IS ', game.currCard.value, game.currCard.color);
  console.log('-----------------');

  if (game.isSkipped) {
    game.isSkipped = false;
    changePlayer(game);
    console.log(`After skip: next is : ${game.currPlayer}`);

    return setTimeout(() => {
      if (!game.isSkipped) {
        $('.hand').removeClass('skip');
      }
      gameFlow(game);
    }, DELAY);
  }
  //! render 'turn'class to show whoes turn is now.
  renderCurrPlayerTurnClass(game);

  if (game.currPlayer === 'user') {
    return userTurn();
  }
  if (game.currPlayer !== 'user') {
    // pcTurn();
    return setTimeout(() => {
      pcTurn();
    }, DELAY);
  }
};

/////////////////////////////////////////////////////////////////
// * GAME START!! 🦊
/////////////////////////////////////////////////////////////////

const checkBeginningCard = () => {
  if (typeof game.currCard.value !== 'number') {
    const specialCard = game.currCard.value;

    if (specialCard === 'skip') {
      console.log(`❌ ${game.currPlayer} skipped!`);
      game.isSkipped = true;
      toggleCurrPlayerSkipClass(game);
      changePlayer(game);
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
  // renderCurrPlayerTurnClass(game);

  //* Check beginning card!
  checkBeginningCard();
  //! render currplayer hand 🎨
  renderHand(game.currPlayer);

  setTimeout(() => {
    gameFlow(game);
  }, 2000);
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
  getCurrIndex(game);
  game.nextIndex = getNextIndex(game);

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
  createDeck(board);
  //$('.chooseTurn__btn').on('click', chooseTurn);
  startGame();
};

$(main);
