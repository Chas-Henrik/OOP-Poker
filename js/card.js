export const SUITES = ['Spade', 'Heart', 'Diamond', 'Club'];

export class Card {
    constructor(id, suit, value) {
        this.Id = id;
        this.Suit = suit;
        this.Value = value;
    }

    clone() {
        return new Card(this.Suit, this.Value);
    }

    print() {
        console.log(`Suit: ${this.Suit}, Value: ${this.Value}`)
        console.log('');
    }
}