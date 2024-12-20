import { SUITES } from "./card.js";

const SUITE_HTML = ['&spades;', '&hearts;', '&diams;', '&clubs;'];
const SUITE_COLOR_HTML = ['black', 'red', 'red', 'black'];
const VALUE_HTML = ['', '' , '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const playerCollectionContainerElement = document.getElementById("player-collection-container-id");

export class Player {
    constructor(name) {
        this.name = name;
        this.MAX_CARDS = 5;
        this.cardCount = 0;
        this.playerContainerElement = this.#createPlayerContainerElement(playerCollectionContainerElement);
        this.cardContainerElement = this.#createCardContainerElement(this.playerContainerElement, name)
        this.cardHolders = this.#createCardHolderElements(this.cardContainerElement);
    }

    #createPlayerContainerElement(gameBoardElement, name) {
        const playerContainerElement = document.createElement("div");
        playerContainerElement.className = "player-container";
        gameBoardElement.appendChild(playerContainerElement);
        return playerContainerElement;
    }

    #createCardContainerElement(playerContainerElement, name) {
        playerContainerElement.innerHTML = `<div class="card-container"></div><p class="player-name">${name}</p>`;
        return playerContainerElement.querySelector(".card-container");
    }

    #createCardHolderElements(cardContainerElement){
        const cardHolders = [];
        //Create Card Holders
        for(let i=0; i<this.MAX_CARDS; i++) {
            const cardHolderElement = document.createElement('div');
            cardHolderElement.title = "Click to flip card";
            cardHolderElement.className = "card-holder";
            cardHolders.push(cardHolderElement);
            // Attach card holder to DOM
            cardContainerElement.appendChild(cardHolderElement);
        }
        return cardHolders;
    }

    addCard(card, frontUp = true) {
        if(this.cardCount > this.MAX_CARDS-1) {
            console.error(`Player has too many cards`);
            return;
        }

        const cardHolderElement = this.cardHolders[this.cardCount];

        // Create Card sides
        const cardFrontElement = this.#createCardFrontElement(card, frontUp);
        const cardBackElement = this.#createCardBackElement(frontUp);
        
        // Attach Card info to Card Holder
        cardHolderElement.id = `card-${card.id}`;
        cardHolderElement.dataset.id = card.id;
        cardHolderElement.dataset.frontUp = frontUp;
        cardHolderElement.dataset.card = card;
        cardHolderElement.addEventListener("click", (e) => {
            this.#flipCard(e.currentTarget);
        });
        
        // Attach card to card holder
        cardHolderElement.appendChild(cardFrontElement);
        cardHolderElement.appendChild(cardBackElement);

        this.cardCount++;
    }

    replaceCardHolder(cardHolderElement, card) {
        const frontUp = true;
        const oldCard = cardHolderElement.dataset.card;

        // Empty Card Holder
        cardHolderElement.innerHTML = "";

        // Create new Card
        const cardFrontElement = this.#createCardFrontElement(card, frontUp);
        const cardBackElement = this.#createCardBackElement(frontUp);
        
        // Update Card Holder
        cardHolderElement.id = `card-${card.id}`;
        cardHolderElement.dataset.id = card.id;
        cardHolderElement.dataset.frontUp = frontUp;
        cardHolderElement.dataset.card = card;
        
        // Attach card to card holder
        cardHolderElement.appendChild(cardFrontElement);
        cardHolderElement.appendChild(cardBackElement);

        return oldCard;
    }

    getCardHolderRequests() {
        return this.cardHolders.filter((item) => item.dataset.frontUp === "false");
    }

    #createCardFrontElement(card, frontUp) {
        const suitIndex = SUITES.indexOf(card.suit);
        const suitHTML = SUITE_HTML[suitIndex];
        const suitColorHTML = SUITE_COLOR_HTML[suitIndex];
        const valueHTML = VALUE_HTML[card.value];

        const cardFrontElement = document.createElement('div');
        cardFrontElement.className = "card-front " + suitColorHTML;        
        cardFrontElement.innerHTML = `
            <aside class="top"><p class="value">${valueHTML}</p><p class="suit">${suitHTML}</p></aside>
            <p class="center suit">${suitHTML}</p>
            <aside class="bottom"><p class="suit mirror-flip">${suitHTML}</p><p class="value mirror-flip">${valueHTML}</p></aside>
            `
        if(!frontUp)
            cardFrontElement.classList.add("collapsed");

        return cardFrontElement;
    }

    #createCardBackElement(frontUp) {
        const cardBackElement = document.createElement('div');
        cardBackElement.className = "card-back";
        cardBackElement.innerHTML = `
            <img type="img" src="./svg/card-back.svg" alt="Card Back" class="card-back">
            `
        if(frontUp) 
            cardBackElement.classList.add("collapsed");

        return cardBackElement;
    }

    #flipCard(cardHolder) {
        const frontUp = !(cardHolder.dataset.frontUp === 'true');
        const cardFront = cardHolder.querySelector('.card-front');
        const cardBack = cardHolder.querySelector('.card-back');

        cardHolder.dataset.frontUp = frontUp;
        if(frontUp) {
            cardBack.classList.add("collapsed");
            cardFront.classList.remove("collapsed");
        } else {
            cardFront.classList.add("collapsed");
            cardBack.classList.remove("collapsed");
        }
    }

    #removeCardElement(card) {
        const cardElement = this.cardContainerElement.getElementById(`card-${card.id}`);
        this.cardContainerElement.removeChild(cardElement);
    }

    getName() {
        return this.name;
    }

    length() {
        return this.cards.length;
    }

    addCards(cards) {
        cards.forEach((card) => this.addCard(card));
    }

    removeCard(idx) {
        if(idx < this.cards.length) {
            this.#removeCardElement(this.cards[idx]);
            return this.cards.splice(idx, 1);
        }
        else {
            return [];
        }
    }

    removeCards(cnt) {
        if(this.cards.length < cnt) {
            console.error("Not enough cards");
            return [];
        } 
        else {
            for(let i=0; i<cnt; i++) {
                this.#removeCardElement(this.cards[idx]);
            }
            return this.cards.splice(0, cnt);
        }
    }

    getCards() {
        return [...this.cards];
    }

    sortCards() {
        const validate = new Validate([this]);
        this.cards = validate.sortCardsByValue(this.cards)
    }

    print() {
        console.log('');
        console.log(`***${this.name}'s cards***:`)
        console.log(this.cards);
    }

    printIndex() {
        console.log('');
        console.log(`***${this.name}'s cards***:`)
        for(let i=0; i<this.cards.length; i++) {
            console.log(`${i} : `, this.cards[i]);
        }
    }

    printTotal() {
        const tot = this.cards.reduce((acc, card) => acc + card.Value, 0)
        console.log(`***${this.name}'s total***:`);
        console.log(tot);
    }
}