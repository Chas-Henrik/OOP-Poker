const prompt = require('prompt-sync')();

// Use 'English alphabetical order' to rank suite (see https://en.wikipedia.org/wiki/High_card_by_suit)
const SUITES = ['Spade', 'Heart', 'Diamond', 'Club']; 
const NAMES = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];

class Card {
    constructor(suit, name, value) {
        this.suit = suit;
        this.name = name;
        this.value = value;
    }

    clone() {
        return new Card(this.suit, this.name, this.value);
    }

    print() {
        process.stdout.write(`${this.suit} ${this.name} ${this.value}, `)
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
        this.name = name;
        this.cards = [];
    }

    getName() {
        return this.name;
    }

    addCard(card) {
        this.cards.push(card);
    }

    removeCards(cnt) {
        if(this.cards.length < cnt) {
            console.error("Not enough cards");
            return null;
        } 
        else {
            return this.cards.splice(0, cnt);
        }
    }

    getCards() {
        return [...this.cards];
    }

    print() {
        console.log('');
        console.log(`***${this.name}'s cards***:`)
        console.log(this.cards);
    }

    printTotal() {
        const tot = this.cards.reduce((acc, card) => acc + card.value, 0)
        console.log(`***${this.name}'s total***:`);
        console.log(tot);
    }
}

class Validate {
    constructor(players) {
        this.playerStats = [];
        players.forEach((player) => {
            const playerCards = player.getCards();
            const playerCardsSorted = playerCards.sort((a,b) => this.sortCards(a,b));
            const playerTotal =  playerCardsSorted.reduce((acc, card) => acc + card.value, 0);
            this.playerStats.push({Name: player.getName(), Hand: playerCardsSorted, Total: playerTotal})
        });
    }

    sortCards(a,b) {
        const diffValue = b.value - a.value;
        // Sort by suit if value is same
        if(diffValue === 0){
            const suitA = a.suit.toUpperCase(); // ignore upper and lowercase
            const suitB = b.suit.toUpperCase(); // ignore upper and lowercase
            return (suitB < suitA)? -1: 1;
        }
        else {
            return diffValue;
        }
    }

    printPlayerStats() {
        this.playerStats.forEach((playerStats) => {
            console.log('Name : ', playerStats.Name);
            console.log('Hand : ', playerStats.Hand);
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

        const winner = playerStats.reduce((acc, player) => (player.Total > acc.Total) ? player: acc, playerStats[0]);
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
    }

    addPlayers() {
        let playerCnt = 0;

        while(playerCnt < 2) {
            playerCnt = prompt("Please enter the number of players (minimum 2)? ");
        }

        for(let i=0; i<playerCnt; i++) {
            const playerName = prompt(`Please enter Player ${i} name? `);
            const player = new Player(playerName);
            this.players.push(player);
        }
    }

    startGame() {
        if(this.players.length < 2) {
            console.error('You need to add players first!');
            return;
        }

        this.dealer.deal(5, ...this.players);
        this.validate = new Validate(this.players);
        this.validate.printPlayerStats();
        this.validate.printWinner();

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
