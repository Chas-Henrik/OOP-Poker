import { SUITES } from "./card.js";

const SUITE_HTML = ['&spades;', '&hearts;', '&diams;', '&clubs;'];
const SUITE_COLOR_HTML = ['black', 'red', 'red', 'black'];
const VALUE_HTML = ['', '' , '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const playersContainerElement = document.getElementById("players-container-id");

export class Player {
    constructor(name) {
        this.Name = name;
        this.Cards = [];
        this.#createPlayerElement(playersContainerElement, name);
    }

    #createPlayerElement(parentElement, name) {
        this.playerElement = document.createElement("div");
        this.playerElement.className = "player";
        this.playerElement.innerHTML = `<div class="card-container"></div><p class="player-name">${name}</p>`
        this.cardContainerElement = this.playerElement.querySelector(".card-container");
        parentElement.appendChild(this.playerElement);
    }

    #createCardElement(card, frontUp = true) {
        const suitIndex = SUITES.indexOf(card.Suit);
        const suitHTML = SUITE_HTML[suitIndex];
        const suitColorHTML = SUITE_COLOR_HTML[suitIndex];
        const valueHTML = VALUE_HTML[card.Value];

        //Card Container
        const cardElement = document.createElement('div');
        cardElement.title="Click to flip card";
        cardElement.id = `card-${card.Id}`;
        cardElement.dataset.id = card.Id;
        cardElement.dataset.frontUp = frontUp;
        cardElement.className = "card";
        cardElement.addEventListener("click", (e) => {
            this.#flipCard(e.currentTarget);
        });

        //Card Front
        const cardFrontElement = document.createElement('div');
        cardFrontElement.className = "card-front " + suitColorHTML;        
        cardFrontElement.innerHTML = `
            <aside class="top"><p class="value">${valueHTML}</p><p class="suit">${suitHTML}</p></aside>
            <p class="center suit">${suitHTML}</p>
            <aside class="bottom"><p class="suit mirror-flip">${suitHTML}</p><p class="value mirror-flip">${valueHTML}</p></aside>
            `
        if(!frontUp)
            cardBackElement.classList.add("collapsed");
        
        //Card Back
        const cardBackElement = document.createElement('div');
        cardBackElement.className = "card-back";
        cardBackElement.innerHTML = `
            <img type="img" src="./svg/card-back.svg" alt="Card Back" class="card-back">
            `
        if(frontUp) 
            cardBackElement.classList.add("collapsed");
        
        // Attach cards to DOM
        this.cardContainerElement.appendChild(cardElement);
        cardElement.appendChild(cardFrontElement);
        cardElement.appendChild(cardBackElement);
        }

    #flipCard(cardContainer) {
        const frontUp = !(cardContainer.dataset.frontUp === 'true');
        const cardFront = cardContainer.querySelector('.card-front');
        const cardBack = cardContainer.querySelector('.card-back');

        cardContainer.dataset.frontUp = frontUp;
        if(frontUp) {
            cardBack.classList.add("collapsed");
            cardFront.classList.remove("collapsed");
        } else {
            cardFront.classList.add("collapsed");
            cardBack.classList.remove("collapsed");
        }
    }

    #removeCardElement(card) {
        const cardElement = this.cardContainerElement.getElementById(`card-${card.Id}`);
        this.cardContainerElement.removeChild(cardElement);
    }

    getName() {
        return this.Name;
    }

    length() {
        return this.Cards.length;
    }

    addCard(card) {
        this.Cards.push(card);
        this.#createCardElement(card);
    }

    addCards(cards) {
        cards.forEach((card) => {
            this.Cards.push(card);
            this.#createCardElement(card);
        });
    }

    removeCard(idx) {
        if(idx < this.Cards.length) {
            this.#removeCardElement(this.Cards[idx]);
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
            for(let i=0; i<cnt; i++) {
                this.#removeCardElement(this.Cards[idx]);
            }
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