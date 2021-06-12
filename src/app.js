'use strict';

class Game {
  constructor() {
    this.players = ['user', 'pc1', 'pc2'];
    this.currPlayer = 'user';
    this.currIndex = this.players.indexOf(this.currPlayer);
    this.nextIndex = this.getNextIndex();
    this.currCard;
    this.currColor;
    this.currValue;
  }
  getNextIndex() {
    const nextIndex =
      this.currIndex === this.players.length - 1 ? 0 : this.currIndex + 1;
    return nextIndex;
  }
  changePlayer() {
    // Before Change
    this.nextPlayer = this.players[this.nextIndex];

    // Changing
    this.currPlayer = this.nextPlayer;
    this.currIndex = this.nextIndex;

    // After Change
    this.nextIndex = this.getNextIndex();
  }
}

class Board {
  constructor() {
    this.deck = this.createDeck();
    this.drawPile = [];
    this.discardPile = [];
  }
  createDeck() {}
}

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
