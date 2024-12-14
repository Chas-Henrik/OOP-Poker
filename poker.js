
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

    addCards(...cards) {
        cards.forEach((card) => this.deck.push(card));
    }

    getCard() {
        return (this.deck.length > 0)? this.deck.pop() : null;
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
        const noPlayers = players.length;
        const dealCards = Math.min(cards, this.deck.length());
        for(let i=0; i<dealCards; i++) {
            players[i%noPlayers].addCard(this.deck.getCard());
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

    removeCard() {
        return (this.cards.length > 0)? this.cards.pop() : null;
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
            return b.suit < a.suit;
        }
        else {
            return diffValue;
        }
    }

    printPlayerStats() {
        this.playerStats.forEach((playerStats) => {
            console.log('Name :', playerStats.Name);
            console.log('Hand :', playerStats.Hand);
            console.log('Total Value :', playerStats.Total);
            console.log('');
        })
    }
}

class Pile {
    constructor() {
        this.pile = [];
    }

    addCard(card) {
        this.pile.push(card);
    }

    getPile() {
        return this.pile.splice(0, this.pile.length);
    }

    print() {
        console.log('Pile:')
        console.log(this.pile);
    }
}


function deal(deck, cards, ...players) {
    const noPlayers = players.length;
    const dealCards = Math.min(cards, deck.length());
    for(let i=0; i<dealCards; i++) {
        players[i%noPlayers].addCard(deck.getCard());
    }
}

function throwCards(pile, player, cnt) {
    for(let i=0; i<cnt; i++) {
        pile.addCard(player.removeCard());
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
deal(deck, 10, slim, luke);

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
throwCards(pile, slim, 2);
throwCards(pile, luke, 2);
deal(deck, 4, slim, luke);

deck.print();
slim.print();
slim.printTotal();
luke.print();
luke.printTotal();

//Del 4
console.log('')
console.log('***DEL 4***:')
console.log('')
throwCards(pile, slim, 5);
throwCards(pile, luke, 5);
slim.printTotal();
luke.printTotal();
deck.addCards(...pile.getPile());
deck.shuffle();
deck.print();
deck.printTotal();

//Del 5
console.log('')
console.log('***DEL 5***:')
console.log('')

const dealer = new Dealer();

dealer.deal(10, slim, luke);
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