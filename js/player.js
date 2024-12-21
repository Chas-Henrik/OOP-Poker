import { SUITES } from "./card.js";
import { Validate, HANDS } from "./validate.js"

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
        this.playerContainerElement.innerHTML = `<p class="player-hand"></p><div class="player-card-container"></div><p class="player-name">${name}</p>`;
        this.playerHandElement = this.playerContainerElement.querySelector(".player-hand");
        this.playerCardContainerElement = this.playerContainerElement.querySelector(".player-card-container");
        this.playerNameElement = this.playerContainerElement.querySelector(".player-name");
        this.cardHolders = this.#createCardHolderElements(this.playerCardContainerElement);
    }

    static deletePlayers() {
        playerCollectionContainerElement.innerHTML = '';
    }

    #createPlayerContainerElement(gameBoardElement, name) {
        const playerContainerElement = document.createElement("div");
        playerContainerElement.className = "player-container";
        gameBoardElement.appendChild(playerContainerElement);
        return playerContainerElement;
    }

    #createCardHolderElements(playerCardContainerElement){
        const cardHolders = [];
        //Create Card Holders
        for(let i=0; i<this.MAX_CARDS; i++) {
            const cardHolderElement = document.createElement('div');
            cardHolderElement.title = "Click to flip card";
            cardHolderElement.className = "card-holder";
            cardHolders.push(cardHolderElement);
            // Attach card holder to DOM
            playerCardContainerElement.appendChild(cardHolderElement);

            // Add event listener
            cardHolderElement.addEventListener("click", (e) => {
                this.#flipCard(e.currentTarget);
            });
        }
        return cardHolders;
    }

    addCard(card, frontUp = true) {
        if(this.cardCount > this.MAX_CARDS-1) {
            console.error(`Player has too many cards`);
            return;
        }

        const cardHolderElement = this.cardHolders[this.cardCount];

        this.addCardToCardHolder(cardHolderElement, card, frontUp);

        // Update Hand info
        this.#updateHandInfo();
    }

    replaceCardHolder(cardHolderElement, card) {
        const frontUp = true;
        this.removeCard(cardHolderElement);

        this.addCardToCardHolder(cardHolderElement, card, frontUp);

        // Update Hand info
        this.#updateHandInfo();
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

        if(cardFront === null || cardBack === null)
            return;

        cardHolder.dataset.frontUp = frontUp;
        if(frontUp) {
            cardBack.classList.add("collapsed");
            cardFront.classList.remove("collapsed");
        } else {
            cardFront.classList.add("collapsed");
            cardBack.classList.remove("collapsed");
        }
    }

    #updateHandInfo() {
        const hand = Validate.getHand(this.getCards());
        this.playerHandElement.textContent = HANDS[hand.handIdx];
    }

    getCards() {
        return this.cardHolders.reduce((acc, cardHolder) => (cardHolder.dataset.card !== undefined) ? [...acc,  JSON.parse(cardHolder.dataset.card)] : acc, []);
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

    addCardToCardHolder(cardHolderElement, card, frontUp) {
        // Create new Card
        const cardFrontElement = this.#createCardFrontElement(card, frontUp);
        const cardBackElement = this.#createCardBackElement(frontUp);
        
        // Update Card Holder
        cardHolderElement.dataset.frontUp = frontUp;
        cardHolderElement.dataset.card = JSON.stringify(card);
        
        // Attach card to card holder
        cardHolderElement.appendChild(cardFrontElement);
        cardHolderElement.appendChild(cardBackElement);

        this.cardCount++;
    }

    removeCard(cardHolderElement) {
        if(cardHolderElement.dataset.card !== undefined) {
            const removedCard = JSON.parse(cardHolderElement.dataset.card);
            delete cardHolderElement.dataset.card;
            this.cardCount--;
            // Empty Card Holder
            cardHolderElement.innerHTML = "";


            return removedCard;
        }
    }

    removeCards() {
        return this.cardHolders.map((cardHolderElement) => this.removeCard(cardHolderElement));
    }

    resetWinner() {
        this.playerNameElement.textContent = this.name;
        this.playerNameElement.classList.remove('winner');
        this.playerHandElement.classList.remove('winner');
    }

    setWinner() {
        this.playerNameElement.textContent = this.name + ' wins!';
        this.playerNameElement.classList.add('winner');
        this.playerHandElement.classList.add('winner');
    }
}