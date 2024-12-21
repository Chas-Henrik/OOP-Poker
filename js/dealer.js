
import { Deck } from "./deck.js";

export class Dealer {
    constructor() {
        this.deck = new Deck();
        this.deck.shuffle();
    }

    newDeck() {
        this.deck = new Deck();
        this.deck.shuffle();
    }

    deal(cards, ...players) {
        for(let i=0; i<cards; i++) {
            players.forEach((player) => player.addCard(this.deck.removeCard()));
        }
    }

    replace(cardHolders, player) {
        cardHolders.forEach((cardHolder) => player.replaceCardHolder(cardHolder, this.deck.removeCard()));
    }

}
