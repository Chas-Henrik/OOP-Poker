export const SUITES = ['Spade', 'Heart', 'Diamond', 'Club'];

export class Card {
    constructor(id, suit, value) {
        this.id = id;
        this.suit = suit;
        this.value = value;
    }

    clone() {
        return new Card(this.suit, this.value);
    }

    print() {
        console.log(`Suit: ${this.suit}, Value: ${this.value}`)
        console.log('');
    }
}