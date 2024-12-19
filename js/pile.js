export class Pile {
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

