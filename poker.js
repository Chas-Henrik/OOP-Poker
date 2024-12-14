
const COLORS = ['Heart', 'Spade', 'Diamond', 'Club'];
const NAMES = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];

class Card {
    constructor(color, name, value) {
        this.color = color;
        this.name = name;
        this.value = value;
    }

    clone() {
        return new Card(this.color, this.name, this.value);
    }

    print() {
        console.log('Color : ', this.color);
        console.log('Name  : ', this.name);
        console.log('Value : ', this.value);
        console.log('');
    }
}

class Deck {
    constructor() {
        this.deck = [];
        for(let i=0; i<4; i++) {
            for(let j=2; j<15; j++) {
                const card = new Card(COLORS[i%2], NAMES[j-2], j);
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

    getCard() {
        return (this.deck.length > 0)? this.deck.splice(0,1)[0] : null;
    }

    print() {
        this.deck.forEach((card) => card.print());
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    print() {
        console.log('');
        console.log(`***${this.name}'s cards***:`)
        this.cards.forEach((card) => card.print());
    }

    printTotal() {
        const tot = this.cards.reduce((acc, card) => acc + card.value, 0)
        console.log(`***${this.name}'s total***:`);
        console.log(tot);
    }
}


function deal(deck, cards, ...players) {
    const noPlayers = players.length;
    const dealCards = Math.min(cards, deck.length());
    for(let i=0; i<dealCards; i++) {
        players[i%noPlayers].addCard(deck.getCard());
    }
}

//Del 1
console.log("Poker");
const deck = new Deck();
deck.shuffle();
deck.print();

//Del 2
const slim = new Player('Slim');
const luke = new Player('Luke');
deal(deck, 10, slim, luke);

deck.print();
slim.print();
slim.printTotal();
luke.print();
luke.printTotal();

