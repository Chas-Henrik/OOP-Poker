const prompt = require('prompt-sync')();

const HANDS = ['Straight flush', 'Four of a kind', 'Full house', 'Flush', 'Straight', 'Three of a kind', 'Two pair', 'One pair', 'High card']
// Use 'English alphabetical order' to rank Suit (see https://en.wikipedia.org/wiki/High_card_by_suit)
const SUITES = ['Spade', 'Heart', 'Diamond', 'Club']; 
const NAMES = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];

class Card {
    constructor(suit, name, value) {
        this.Suit = suit;
        this.Name = name;
        this.Value = value;
    }

    clone() {
        return new Card(this.Suit, this.Name, this.Value);
    }

    print() {
        process.stdout.write(`${this.Suit} ${this.Name} ${this.Value}, `)
        console.log('');
    }
}

class Deck {
    constructor() {
        this.deck = [];
        for(let i=0; i<4; i++) {
            for(let j=2; j<15; j++) {
                const card = new Card(SUITES[i], NAMES[j-2], j);
                this.deck.push(card);
            }
        }
    }

    shuffle() {
        for(let i=0; i<this.deck.length; i++) {
            const randIdx = Math.floor(Math.random()*this.deck.length);
            [this.deck[i], this.deck[randIdx]] = [this.deck[randIdx], this.deck[i]]; // Swap cards using destructuring
        }
    }

    length() {
        return this.deck.length;
    }

    addCards(cards) {
        cards.forEach((card) => this.deck.push(card));
    }

    removeCard() {
        if(this.deck.length <= 0) {
            console.error("Deck is empty");
            return null;
        } 
        else {
            return this.deck.pop();
        }
    }

    removeCards(cnt) {
        if(this.deck.length < cnt) {
            console.error("Not enough cards in deck");
            return [];
        }
        else {
            return this.deck.splice(0, cnt);
        }
    }

    print() {
        console.log('Deck:')
        console.log(this.deck);
    }

    printTotal() {
        const tot = this.deck.reduce((acc, card) => acc + 1, 0)
        console.log(`***Deck's total***:`);
        console.log(tot);
    }
}

class Dealer {
    constructor() {
        this.deck = new Deck();
        this.deck.shuffle();
    }

    deal(cards, ...players) {
        for(let i=0; i<cards; i++) {
            players.forEach((player) => player.addCard(this.deck.removeCard()));
        }
    }
}

class Player {
    constructor(name) {
        this.Name = name;
        this.Cards = [];
    }

    getName() {
        return this.Name;
    }

    length() {
        return this.Cards.length;
    }

    addCard(card) {
        this.Cards.push(card);
    }

    addCards(cards) {
        cards.forEach((card) => this.Cards.push(card));
    }

    removeCard(idx) {
        if(idx < this.Cards.length) {
            return this.Cards.splice(idx, 1);
        }
        else {
            return [];
        }
    }

    removeCards(cnt) {
        if(this.Cards.length < cnt) {
            console.error("Not enough cards");
            return [];
        } 
        else {
            return this.Cards.splice(0, cnt);
        }
    }

    getCards() {
        return [...this.Cards];
    }

    sortCards() {
        const validate = new Validate([this]);
        this.Cards = validate.sortCardsByValue(this.Cards)
    }

    print() {
        console.log('');
        console.log(`***${this.Name}'s cards***:`)
        console.log(this.Cards);
    }

    printIndex() {
        console.log('');
        console.log(`***${this.Name}'s cards***:`)
        for(let i=0; i<this.Cards.length; i++) {
            console.log(`${i} : `, this.Cards[i]);
        }
    }

    printTotal() {
        const tot = this.Cards.reduce((acc, card) => acc + card.Value, 0)
        console.log(`***${this.Name}'s total***:`);
        console.log(tot);
    }
}

class Validate {
    constructor(players) {
        this.playerStats = [];
        players.forEach((player) => {
            const playerCards = player.getCards();
            const playerCardsSortedByValue = this.sortCardsByValue(playerCards);
            const playerHand = this.getHand(playerCardsSortedByValue);
            const playerTotal =  playerCardsSortedByValue.reduce((acc, card) => acc + card.Value, 0);
            this.playerStats.push({Name: player.getName(), Hand: playerHand, Cards: playerCardsSortedByValue, Total: playerTotal})
        });
    }

    getHand(cardsSortedByValue) {
        for(let i=0; i<HANDS.length; i++) {
            if(this.#matchHand(HANDS[i], cardsSortedByValue))
                return i;
        }
        return 'High card';
    }

    #matchHand(hand, cardsSortedByValue) {
        switch(hand) {
            case 'Straight flush':
                return this.#matchStraightFlush(cardsSortedByValue);
            case 'Four of a kind':
                return this.#matchFourOfAKind(cardsSortedByValue);
            case 'Full house':
                return this.#matchFullHouse(cardsSortedByValue);
            case 'Flush':
                return this.#matchFlush(cardsSortedByValue);
            case 'Straight':
                return this.#matchStraight(cardsSortedByValue);
            case 'Three of a kind':
                return this.#matchThreeOfAKind(cardsSortedByValue);
            case 'Two pair':
                return this.#matchTwoPairs(cardsSortedByValue);
            case 'One pair':
                return this.#matchOnePair(cardsSortedByValue);
            default:
                return true;
        }
    }

    #matchStraightFlush(cards) {
        return this.#matchStraight(cards) && this.#matchFlush(cards);
    }

    #matchFourOfAKind(cards) {
        for(let i=0; i<cards.length-3; i++) {
            if(cards[i].Value === cards[i+1].Value && cards[i+1].Value === cards[i+2].Value && 
                cards[i+2].Value === cards[i+3].Value && cards[i+3].Value === cards[i+4].Value) {
                    return true;
                }
        }
        return false;
    }

    #matchFullHouse(cards) {
        let pair = false;
        let threeOfAKind = false;
        for(let i=0; i<cards.length-1; i++) {
            if(i<cards.length-2 && cards[i].Value === cards[i+1].Value && cards[i+1].Value === cards[i+2].Value) {
                threeOfAKind = true;
                i += 2;
            }
            else if(cards[i].Value === cards[i+1].Value) {
                pair = true;
                i += 1;
            }
        }
        return pair && threeOfAKind;
    }

    #matchFlush(cards) {
        const startSuit = cards[0].Suit
        return cards.every((card) => card.Suit === startSuit);
    }

    #matchStraight(cards) {
        const startVal = cards[0].Value;
        for(let i=1; i<cards.length; i++) {
            if(cards[i].Value !== startVal - i) {
                return false;
            }
        }
        return true;
    }

    #matchThreeOfAKind(cards) {
        for(let i=0; i<cards.length-2; i++) {
            if(cards[i].Value === cards[i+1].Value && cards[i+1].Value === cards[i+2].Value) {
                return true;
            }
        }
        return false;
    }

    #matchTwoPairs(cards) {
        let pairs = 0;
        for(let i=0; i<cards.length-1; i++) {
            if(cards[i].Value === cards[i+1].Value) {
                pairs++;
                i += 1;
            }
        }
        return pairs === 2;
    }

    #matchOnePair(cards) {
        for(let i=0; i<cards.length-1; i++) {
            if(cards[i].Value === cards[i+1].Value) 
                return true;
        }
        return false;
    }

    sortCardsByValue(cards) {
        return cards.sort((a,b) => this.#sortByValue(a,b));
    }

    #sortByValue(a,b) {
        const diffValue = b.Value - a.Value;
        // Sort by Suit if Value is same
        if(diffValue === 0){
            const suitA = a.Suit.toUpperCase(); // ignore upper and lowercase
            const suitB = b.Suit.toUpperCase(); // ignore upper and lowercase
            return (suitB < suitA)? -1: 1;
        }
        else {
            return diffValue;
        }
    }

    printPlayerStats() {
        this.playerStats.forEach((playerStats) => {
            console.log('Player : ', playerStats.Name);
            console.log('Hand   : ', HANDS[playerStats.Hand]);
            console.log('Cards  : ', playerStats.Cards);
            console.log('Total Value : ', playerStats.Total);
            console.log('');
        })
    }

    printWinner() {
        const playerStats = [...this.playerStats];
        if(playerStats.length < 1) {
            console.error('Player stats is missing!');
            return;
        }

        const winner = playerStats.reduce((acc, player) => (player.Hand < acc.Hand) ? player: acc, playerStats[0]);
        console.log('Winner is : ', winner.Name);
    }
}

class Pile {
    constructor() {
        this.pile = [];
    }

    addCards(cards) {
        cards.forEach((card) => this.pile.push(card));
    }

    removePile() {
        return this.pile.splice(0, this.pile.length);
    }

    print() {
        console.log('Pile:')
        console.log(this.pile);
    }
}

class Game {
    constructor() {
        this.dealer = new Dealer();
        this.players = [];
        this.pile = new Pile();
    }

    addPlayers() {
        let playerCnt = 0;

        while(playerCnt < 2) {
            playerCnt = prompt("Please enter the number of players (minimum 2)? ");
        }

        for(let i=0; i<playerCnt; i++) {
            const playerName = prompt(`Please enter Player ${i+1} name? `);
            const player = new Player(playerName);
            this.players.push(player);
        }
    }

    startGame() {
        const rounds = 1;
        if(this.players.length < 2) {
            console.error('You need to add players first!');
            return;
        }

        this.dealer.deal(5, ...this.players);

        // Game Loop
        for(let i=0; i<rounds; i++) {
            this.players.forEach((player) => {
                player.sortCards();
                player.printIndex();
                this.#dropCards(player);
            });
        }

        this.validate = new Validate(this.players);
        this.validate.printPlayerStats();
        this.validate.printWinner();
    }

    #dropCards(player) {
        let [ans, ...rest] = prompt(`Do you wish to drop cards (Yes/No)? `);

        if(ans.toUpperCase() === 'Y') {
            const ids = prompt(`Select index's of cards to drop (separate index's with comma): `);
            let idxArr = ids.split(',');
            idxArr = idxArr.map((idx) => parseInt(idx.trim()));
            idxArr.forEach((idx) => {
                const removedCard = player.removeCard(idx);
                if(removedCard.length>0) {
                    this.pile.addCards([removedCard]);
                    player.addCard(deck.removeCard());
                }
            });
        }
    }
}

function deal(deck, cards, ...players) {
    for(let i=0; i<cards; i++) {
        players.forEach((player) => player.addCard(deck.removeCard()));
    }
}


//Del 1
console.log('')
console.log('***DEL 1***:')
console.log('')
const deck = new Deck();
deck.shuffle();
deck.print();

//Del 2
console.log('')
console.log('***DEL 2***:')
console.log('')
const slim = new Player('Slim');
const luke = new Player('Luke');
deal(deck, 5, slim, luke);

deck.print();
slim.print();
slim.printTotal();
luke.print();
luke.printTotal();


//Del 3
console.log('')
console.log('***DEL 3***:')
console.log('')
const pile = new Pile();
pile.addCards(slim.removeCards(2));
pile.addCards(luke.removeCards(2));
deal(deck, 2, slim, luke);

deck.print();
slim.print();
slim.printTotal();
luke.print();
luke.printTotal();

//Del 4
console.log('')
console.log('***DEL 4***:')
console.log('')
pile.addCards(slim.removeCards(5));
pile.addCards(luke.removeCards(5));
slim.printTotal();
luke.printTotal();
deck.addCards(pile.removePile());
deck.shuffle();
deck.print();
deck.printTotal();

//Del 5
console.log('')
console.log('***DEL 5***:')
console.log('')

const dealer = new Dealer();

dealer.deal(5, slim, luke);
slim.print();
slim.printTotal();
luke.print();
luke.printTotal();


//Del 6
console.log('')
console.log('***DEL 6***:')
console.log('')

const validate = new Validate([slim, luke]);
validate.printPlayerStats();

//Del 7
console.log('')
console.log('***DEL 7***:')
console.log('')

const game = new Game();
game.addPlayers();
game.startGame();
