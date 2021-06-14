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
  nextIndex: null,
  currCard: null, //FIXME
  isPCturn: true,
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

  if (game.currPlayer !== 'user') {
    game.isPCturn = true;
  } else {
    game.isPCturn = false;
  }
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
  $('.hand').removeClass('skip');
  $(`.${game.currPlayer}Hand`).addClass('turn');
};

const renderCurrPlayerSkipClass = (game) => {
  $('.hand').removeClass('skip');
};

const renderDrawAndDiscard = () => {
  renderDrawPile(board);
  renderDiscardPile(game);
};
/////////////////////////////////////////////////////////////////
// * GAME FUNCTIONS 🦊
/////////////////////////////////////////////////////////////////

const syncWait = (ms) => {
  const end = Date.now() + ms;
  while (Date.now() < end) continue;
};

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

  //return drawCard;
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
  renderHand('user');
  renderDrawAndDiscard();
  // change player
  finalChangePlayer(game);

  return setTimeout(() => {
    gameFlow(game);
  }, 4000);
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

  $('.colorBox').on('click', getNewColor);
};

/////////////////////////////////////////////////////////////////
// * SPECIAL CARDS!! 🐥
/////////////////////////////////////////////////////////////////
const repeat = (num, what, arg) => {
  for (let i = 0; i < num; i++) {
    what(arg);
  }
};

//! REVERSE, WILD doesn't have changePlayer option
const specialCardsMethod = {
  skip(game) {
    changePlayer(game);

    console.log(`❌ ${game.currPlayer} skipped!`);
    renderCurrPlayerSkipClass(game);

    setTimeout(() => {
      changePlayer(game);
    }, 3000);
    changePlayer(game);
  },
  draw2(game) {
    const nextIndex = getNextIndex(game);
    const nextPlayer = game.players[nextIndex];

    repeat(2, drawOneCard, nextPlayer);
    renderHand(nextPlayer);

    // TODO
    changePlayer(game);
    console.log(`❌ ${game.currPlayer} skipped!`);
    renderCurrPlayerSkipClass(game);

    setTimeout(() => {
      changePlayer(game);
    }, 3000);
    changePlayer(game);
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
    }

    renderDrawAndDiscard();
  },
  wildDraw4(game) {
    if (game.currPlayer !== 'user') {
      // pc1, pc2
      const colorArr = Object.keys(colors);
      const newColor = colors[colorArr[getRandomNum(colorArr.length)]];

      game.currCard.color = newColor;
    }

    renderDrawAndDiscard();
    changePlayer(game);
    repeat(4, drawOneCard, game.currPlayer);
    renderHand(game.currPlayer);
    console.log(`❌ ${game.currPlayer} skipped!`);
    renderCurrPlayerSkipClass(game);

    setTimeout(() => {
      changePlayer(game);
    }, 3000);
    changePlayer(game);
  },
};

/////////////////////////////////////////////////////////////////
// * GAME FLOW - PC1 / PC2 !! 🦊
/////////////////////////////////////////////////////////////////
const activateSpecialCards = (card) => {
  // SKIP, DRAW2, WILD4   HAS CHANGEPLAYER
  // REVERSE, WILD        NO  CHANGEPLAYER
  const cardValue = card.value;
  if (typeof cardValue === 'number') return;
  if (cardValue === 'skip') {
    specialCardsMethod.skip(game);
  }
  if (cardValue === 'draw2') {
    specialCardsMethod.draw2(game);
  }
  if (cardValue === 'reverse') {
    specialCardsMethod.reverse(game);
    changePlayer(game);
  }
  if (cardValue === 'wild') {
    specialCardsMethod.wild(game);
    changePlayer(game);
  }
  if (cardValue === 'wildDraw4') {
    specialCardsMethod.wildDraw4(game);
  }
};

const finalChangePlayer = (game) => {
  if (typeof game.currCard.value !== 'number') {
    activateSpecialCards(game.currCard);
  } else {
    changePlayer(game);
  }
};

const pcTurn = (currPlayer) => {
  renderCurrPlayerTurnClass(game);
  console.log('💻');
  const matchingResult = checkPcHand(currPlayer);

  //! WHEN PC HAS A CARD 🅾️
  //* when there are results or is a result
  if (matchingResult.length >= 1) {
    let chosenCard;
    if (matchingResult.length === 1) {
      chosenCard = matchingResult[0];
    }
    if (matchingResult.length > 1) {
      const randomIndex = getRandomNum(matchingResult.length);
      chosenCard = matchingResult[randomIndex];
    }

    game.currCard = chosenCard;
    console.log(game.currPlayer, ' GOT ', game.currCard.value);
    console.log('------------------------');
    //! remove chosencard from hand & move to discardpile
    const cardIndexInHand = playerHands[currPlayer].indexOf(chosenCard);
    const card = playerHands[currPlayer].splice(cardIndexInHand, 1);
    board.discardPile.push(card);

    //! render currhand and discardpile🎨

    renderHand(currPlayer);
    //renderDiscardPile(game);
    renderDrawAndDiscard();
    finalChangePlayer(game);
  } else {
    //! WHEN PC DOESN'T HAVE A CARD ❌
    drawOneCard(currPlayer);
    //renderDrawPile(board);
    renderDrawAndDiscard();
    renderHand(currPlayer);
    changePlayer(game);
    console.log('PC Draw new card ', game.currCard.value);
    console.log('------------------------');
  }

  return setTimeout(() => {
    gameFlow(game);
  }, 4000);
};

const handlerUserCardClick = (e) => {
  const $chosenCard = $(e.currentTarget);
  if (!$chosenCard.hasClass('userCard')) return;
  const $cardIndex = $chosenCard.parent().children().index($chosenCard);
  const chosenCard = playerHands.user[$cardIndex];

  if (
    chosenCard.value === game.currCard.value ||
    chosenCard.color === game.currCard.color
  ) {
    // Update the currCard
    // if card is valid, remove it from userHand and put it back to discardPile
    game.currCard = chosenCard;
    const splicedCard = playerHands.user.splice($cardIndex, 1);
    board.discardPile.push(splicedCard);

    //! render userHand and discardPile 🎨
    renderHand('user');
    renderDrawAndDiscard();

    //TODO BUG
    if (game.currCard.value === 'wild' || game.currCard.value === 'wildDraw4') {
      showColorChangeModal(game);
    } else {
      finalChangePlayer(game);

      console.log('USER GOT: ', game.currCard.value);
      console.log('------------');

      return setTimeout(() => {
        gameFlow(game);
      }, 4000);
    }
  } else {
    console.log('INVALID❌');
  }
};

const handlerDrawBtnClick = (e) => {
  console.log('Draw one card for user');
  // draw one card
  drawOneCard('user');
  //! render drawPile, userHand 🎨
  renderHand('user');
  //renderDrawPile(board);
  renderDrawAndDiscard();

  changePlayer(game);

  console.log('USER DRAW CARD: ', game.currCard.value);
  console.log('------------------------');
  return gameFlow(game);
};

const userTurn = () => {
  console.log('🧝‍♀️ ');

  // $('main').on('click', userClick);
  $('.draw__btn').on('click', handlerDrawBtnClick);
  $('.userCard').on('click', handlerUserCardClick);
};

/////////////////////////////////////////////////////////////////
// * GAME FLOW!! 🦊
/////////////////////////////////////////////////////////////////
const gameFlow = (game) => {
  console.log('🌿 NEXT: ', game.currPlayer);

  //! render 'turn'class to show whoes turn is now.
  renderCurrPlayerTurnClass(game);

  if (game.currPlayer === 'user') {
    userTurn();
  }
  if (game.currPlayer !== 'user') {
    pcTurn(game.currPlayer);
  }
};

/////////////////////////////////////////////////////////////////
// * GAME START!! 🦊
/////////////////////////////////////////////////////////////////

const checkBeginningCard = () => {
  if (typeof game.currCard.value !== 'number') {
    const specialCard = game.currCard.value;

    if (specialCard === 'skip') {
      setTimeout(() => {
        console.log(`❌ ${game.currPlayer} skipped!`);
      }, 2000);
      renderCurrPlayerSkipClass(game);
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

  gameFlow(game);
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
