class Game {
  constructor() {
    this.players = ['user', 'pc1', 'pc2'];
    this.currPlayer = 'user';
    this.currIndex = this.players.indexOf(this.currPlayer);
    this.nextIndex = this.getNextIndex();
  }
  getNextIndex() {
    const nextIndex = this.currIndex === 2 ? 0 : this.currIndex + 1;
    return nextIndex;
  }
  changePlayer() {
    //? Before Change
    this.nextPlayer = this.players[this.nextIndex];

    //? Changing
    this.currPlayer = this.nextPlayer;
    this.currIndex = this.nextIndex;

    //? After Change
    this.nextIndex = this.getNextIndex();
  }
}

class Board {
  constructor() {}
}

const game = new Game();

console.log(game.currPlayer, game.currIndex);

//! How to change player?
/*
Game flow should be 0 - 1 - 2 - 0 - 1 - 2
if currIndex is 0 , next one must be 1 =>  nextIndex = currIndex + 1
if currIndex is 2 , next one must be 0 => if add 1, then it will be 3 
So,
* nextIndex = currIndex === 2 ? 0 : currIndex + 1     => getNextIndex()

So, I got the index. Then how can I really change with this index?
changeToNextPlayer()

1.  first, take all info of next player  and assign it to current player
Start small. just index

? Before change
nextPlayer = players[nextIndex]

? Changing
currentPlyaer = nextPlayer
currIndex = nextIndex

? After change
nextIndex = currIndex === 2 ? 0 : currIndex + 1 => getNextIndex()

! Repeated! 
getNextIndex = ()=> {
  const nextIndex = currIndex === 2 ? 0 : currIndex + 1;
  return nextIndex;
}



! How to connect each player's hand and player?


1. Create board with 108 cards ✅

  value  | 0~9, "skip", "reverse", "draw2", 'wild', 'wildDraw4'
  suit   | 1 - 8
  face   | 0~9, "skip", "reverse", "draw2", 'wild', 'wildDraw4'
  faceUp | false
  color  | 'red', 'yellow', 'green', 'blue'

  remove four blank card 
  
  it's a deck

2. shuffle ✅
  forloop shuffle
  
  

3. each player draws a card ✅
  checkingArray = []  
  deck. shift() - user 
  deck. shift() -pc1 
  deck. shift() - pc2
  ! changed to choose cards random

  select the highest number  -> highest number will be currPlayer



4. put it back to board and shuffle again
  for card in checkingArry . push to main board
  shuffle card ✅


5. deal 7 cards each to player ✅

112 cards : 1 -> user / 1 -> pc1 / 1 -> pc2   * 7 
  deck. shift() - user 
  deck. shift() - pc1 
  deck. shift() - pc2

  deck = 108 - 7 * 3 => 87 cards

  userHand = [ 7 cards ]
  pc1Hand = [ 7 cards ]
  pc2Hand = [ 7 cards ]



6. remaining card to draw pile ✅
  lets say card was in board => move whole thing to draw pile
  manipulate ? or just copy?

  deck = [] ; empty

  drawPile =  [...deck]  or deck.splice(all)



-----------------------------------------------------------------game start---

7. gamestart shows up -> if gamestartbtn clicked, gamestartbtn disappear.
  => TODO maybe animation? game start! sentence fly fast

  < 2 seconds later >

<auto>
8. turn over the top card of drawpile ✅
  topcard = drawPile.shift()
  ! css... the last card if drawn last so its on top! 

  ⓵ if topcard is "wild" or "wildDraw4",  return it to deck
  ex)
  deck = ['wild']
  drawPile = [...]

  ⓶ else, move top card to discard pile. 

  discardPile = []
  discardPile.unshift(topcard)
  
  ? let = currCard will be changed to the card which any player drew. 
  let currCard = discardPile[0]
  
  Check CurrCard!!

9. currPlayer
  !!! ⓵ IF THE TOP CARD IS A REVERSE CARD !!!



  !!! ⓶ IF THE TOP CARD IS NOT A REVERSE CARD !!! 

  * if currPlayer is pc1 or pc2 

  checkTheHand (whoesHand) {
    const matchedArray = []
    if currCard.color or value (but must be number)

    Should be find to check without checking if value is number or not
    parseInt(<string>) => NaN

    ⓵ if has, return filled matchedArray
      => if only 1 
      => if many
      To cover both situation, return array will be better. 

    ⓶ if not, return empty matchedArray
  }
  ///////
    ⓵ checkTheHand is truthy?
    if matchedArray lenth is 1 => chosen card = matched[0]
    if many => make a randomNum  => chosed card = matched[randomNum]
    

    ⓶ else,   false?
    Draw one card from drawPile to currPlayer (unshift)


    Put the chosen card 
    discardPile.unshift()

    And 🔥 currCard = chosen card  (!!!!!!)🂦
    or 🔥 currCard = discardPile[0]
    !! need to save currCard color , value!

    if currCard is in ['skip', 'reverse', 'wild', 'wildDraw4] => isSpecialValid = true


  🎨 render discardPile
  🎨 render currPlayer hand === pc1/2 hand

  🌿 changeToNextPlayer()

  * if currPlayer is user

  checkTheHand as well. this will return filled[]  or empty[]

  🧝‍♀️ if user click the card, I must get the card info. or... 
  🎨 In userhand, cards will be rendered by order. Left -> Right (display: flex)
  ex)
  [card1, card2, card3, card4, card5, card6, card7]
  clickedcard index in userhand
  ex) card2, then index will be 1 in HTML
    clicked card = userHand[1]

    ?⓵ if clickedCard is in checkTheHand() => valid card
      Take this clickedCard out of userhand and discardPile.unshift();
      🔥 currCard = discardPile[0]
      if currCard is in ['skip', 'reverse', 'wild', 'wildDraw4] => isSpecialValid = true

      🎨 render discardPile
      🎨 render userHand

      🌿 changeToNextPlayer()

    ?⓶ if not in checkTheHand() => invalid card
      I dont know...
  
  🧝‍♀️ if user click draw
Draw one card from drawPile to currPlayer (unshift)

🎨 render drawPile
🎨 render currPlayer hand === user hand

🌿 changeToNextPlayer()

////////////////////////////////////////////////////////////////////////////////////
!!! How to connect both two???... ✅
! currPlayer : user
! userHand = []

class Game {
  players = [user, pc1, pc2]
  currPlayer = user
  currIndex = 0
  nextIndex = 1
  isSpecialValid = false

  getNextIndex()   => I need to use 'this'
  changePlayer()
}

class Board {
  create deck() =>  generate all the cards and put them to deck
  deck = []
  drawPile = []
  discardPile = []
  userHand = []
  pc1Hand = []
  pc2Hand = []
}

when rendering,  renderCurrPlayer()
Inside, ⓵ if currPlayer = user,  board.userHand
        ⓶ if currPlayer = pc1, board.pc1Hand
        ③ if currPlayer = pc2, board.pc2Hand

/////////////////////////////////////////////////////////////////////////////////////
! After changePlayer()

* currCard
* if isSpecialValid = true

⓵ if currCard === 'skip' ✅
  skip player
  [0, 1, 2]
  if curr is pc1
  changePlayer() * 2
  Then, curr = user

  play.

  Again.

  if(currPlayer is pc1pc2) do sth
  if(currPlayer is user) do sth

⓵ if currCard === 'reverse' ✅
[user, pc1, pc2]
  -0
        -1
             -2   REVERSE!
        -1

        next player should be pc1 , index 1, and then user, index 0
  .reverse() => [pc2, pc1, user]   but not curr() index was 2... 
  ! player.indexOf(currPlayer) => currIndex
  
  changePlayer()  => pc1
  changePlayer()  => user


  play.

  Again.

  if(currPlayer is pc1pc2) do sth
  if(currPlayer is user) do sth

TODO
⓵ if currCard === 'wild' ✅


⓵ if currCard === 'wildDraw4' ✅





  

















*/
