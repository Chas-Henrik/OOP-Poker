const playersContainerElement = document.getElementById("players-container-id");
const playerDialog = document.getElementById("player-dialog-id");
const playerDialogCountFieldset = document.getElementById("player-dialog-fieldset-id");
const playerDialogNameContainerElement = document.getElementById("player-dialog-name-container-id");
const playerDialogOkBtn = document.getElementById("player-dialog-ok-btn-id");
const dealBtn = document.getElementById("deal-button-id"); 

// To be considered: https://deckofcardsapi.com/static/img/6H.svg

// The following rules have been applied: https://en.wikipedia.org/wiki/List_of_poker_hands#cite_note-:5-13
const HANDS = ['Straight flush', 'Four of a kind', 'Full house', 'Flush', 'Straight', 'Three of a kind', 'Two pair', 'One pair', 'High card']
// Use 'English alphabetical order' to rank Suit (see https://en.wikipedia.org/wiki/High_card_by_suit)
const SUITES = ['Spade', 'Heart', 'Diamond', 'Club'];
const SUITE_HTML = ['&spades;', '&hearts;', '&diams;', '&clubs;'];
const SUITE_COLOR_HTML = ['black', 'red', 'red', 'black'];
const VALUE_HTML = ['', '' , '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

class Card {
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

class Deck {
    constructor() {
        this.deck = [];
        let id = 0;
        for(let i=0; i<4; i++) {
            for(let j=2; j<15; j++) {
                const card = new Card(id++, SUITES[i], j);
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

    removeCards(cnt) {
        if(this.deck.length < cnt) {
            console.error("Not enough cards in deck");
            return [];
        }
        else {
            return this.deck.splice(0, cnt);
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

class Validate {
    constructor(players) {
        this.playerStats = [];
        players.forEach((player) => {
            const playerCards = player.getCards();
            const playerCardsSortedByValue = this.sortCardsByValue(playerCards);
            const playerHand = this.getHand(playerCardsSortedByValue);
            const playerTotal =  playerCardsSortedByValue.reduce((acc, card) => acc + card.Value, 0);
            this.playerStats.push({Name: player.getName(), Hand: playerHand, Cards: playerCardsSortedByValue, Total: playerTotal})
        });
    }

    getHand(cardsSortedByValue) {
        for(let i=0; i<HANDS.length; i++) {
            const hand = this.#matchHand(HANDS[i], cardsSortedByValue)
            if(hand.length>0)
                return {HandIdx: i, Cards: hand};
        }
        return {HandIdx: HANDS.length-1, Cards: cardsSortedByValue};
    }

    #matchHand(hand, cardsSortedByValue) {
        switch(hand) {
            case 'Straight flush':
                return this.#matchStraightFlush(cardsSortedByValue);
            case 'Four of a kind':
                return this.#matchFourOfAKind(cardsSortedByValue);
            case 'Full house':
                return this.#matchFullHouse(cardsSortedByValue);
            case 'Flush':
                return this.#matchFlush(cardsSortedByValue);
            case 'Straight':
                return this.#matchStraight(cardsSortedByValue);
            case 'Three of a kind':
                return this.#matchThreeOfAKind(cardsSortedByValue);
            case 'Two pair':
                return this.#matchTwoPairs(cardsSortedByValue);
            case 'One pair':
                return this.#matchOnePair(cardsSortedByValue);
            default:
                return cardsSortedByValue;
        }
    }

    #matchStraightFlush(cards) {
        const straight = this.#matchStraight(cards);
        const flush = this.#matchFlush(cards);
        return (straight.length > 0) && (flush.length > 0) ? cards : [];
    }

    #matchFourOfAKind(cards) {
        for(let i=0; i<cards.length-3; i++) {
            if(cards[i].Value === cards[i+1].Value && cards[i+1].Value === cards[i+2].Value && 
                cards[i+2].Value === cards[i+3].Value) {
                    return [cards[i], cards[i+1], cards[i+2], cards[i+3]];
                }
        }
        return [];
    }

    #matchFullHouse(cards) {
        let pair = false;
        let pairArr = [];
        let threeOfAKind = false;
        let threeOfAKindArr = [];
        for(let i=0; i<cards.length-1; i++) {
            if(i<cards.length-2 && cards[i].Value === cards[i+1].Value && cards[i+1].Value === cards[i+2].Value) {
                threeOfAKind = true;
                threeOfAKindArr = [cards[i], cards[i+1], cards[i+2]];
                i += 2;
            }
            else if(cards[i].Value === cards[i+1].Value) {
                pair = true;
                pairArr = [cards[i], cards[i+1]];
                i += 1;
            }
        }
        return (threeOfAKind && pair) ? [...threeOfAKindArr, ...pairArr] : [];
    }

    #matchFlush(cards) {
        const startSuit = cards[0].Suit
        return cards.every((card) => card.Suit === startSuit) ? cards : [];
    }

    #matchStraight(cards) {
        const startVal = cards[0].Value;
        for(let i=1; i<cards.length; i++) {
            if(cards[i].Value !== startVal - i) {
                return [];
            }
        }
        return cards;
    }

    #matchThreeOfAKind(cards) {
        for(let i=0; i<cards.length-2; i++) {
            if(cards[i].Value === cards[i+1].Value && cards[i+1].Value === cards[i+2].Value) {
                return [cards[i], cards[i+1], cards[i+2]];
            }
        }
        return [];
    }

    #matchTwoPairs(cards) {
        let twoPair = [];
        let pairs = 0;
        for(let i=0; i<cards.length-1; i++) {
            if(cards[i].Value === cards[i+1].Value) {
                twoPair.push(cards[i]);
                twoPair.push(cards[i+1]);
                pairs++;
                i += 1;
            }
        }
        return pairs === 2 ? twoPair: [];
    }

    #matchOnePair(cards) {
        for(let i=0; i<cards.length-1; i++) {
            if(cards[i].Value === cards[i+1].Value) 
                return [cards[i], cards[i+1]];
        }
        return [];
    }

    sortCardsByValue(cards) {
        return cards.sort((a,b) => this.#sortByValue(a,b));
    }

    #sortByValue(a,b) {
        const diffValue = b.Value - a.Value;
        // Sort by Suit if Value is same
        if(diffValue === 0){
            const suitA = a.Suit.toUpperCase(); // ignore upper and lowercase
            const suitB = b.Suit.toUpperCase(); // ignore upper and lowercase
            return (suitB < suitA)? -1: 1;
        }
        else {
            return diffValue;
        }
    }

    printPlayerStats() {
        this.playerStats.forEach((playerStats) => {
            console.log('Player : ', playerStats.Name);
            console.log('Hand   : ', HANDS[playerStats.Hand.HandIdx]);
            console.log('Cards  : ', playerStats.Cards);
            // console.log('Total Value : ', playerStats.Total);
            console.log('');
        })
    }

    printWinner() {
        const playerStats = [...this.playerStats];
        if(playerStats.length < 1) {
            console.error('Player stats is missing!');
            return;
        }

        const winner = playerStats.reduce((acc, player) => this.#getWinner(acc, player), playerStats[0]);
        console.log('Winner is : ', winner.Name);
    }

    #getWinner(player1, player2) {
        //Get winner by hand
        if(player1.Hand.HandIdx < player2.Hand.HandIdx)
            return player1;
        else if(player1.Hand.HandIdx > player2.Hand.HandIdx)
            return player2;
        else {
            //Resolve tie by checking card Value & Suit
            return this.#resolveTie(player1, player2);
        }
    }

    #resolveTie(player1, player2) {
        // Resolve tie by highest card Value
        for(let i=0; i<player1.Hand.Cards.length; i++) {
            if(player1.Hand.Cards[i].Value === player2.Hand.Cards[i].Value)
                continue;
            else if(player1.Hand.Cards[i].Value > player2.Hand.Cards[i].Value) {
                return player1;
            } 
            else {
                return player2;
            }
        }

        // Resolve tie by Suit
        for(let i=0; i<player1.Hand.Cards.length; i++) {
            if(SUITES.indexOf(player1.Hand.Cards[i].Suit) < SUITES.indexOf(player2.Hand.Cards[i].Suit)) {
                return player1;
            } 
            else {
                return player2;
            }
        }
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
        this.pile = new Pile();
        this.#updatePlayerInputElements(2);
        playerDialogCountFieldset.addEventListener('click', (e) => this.#updatePlayerInputElements(parseInt(e.target.dataset.id)));
        playerDialogOkBtn.addEventListener('click', (e) => {
            this.#createPlayers();
            playerDialog.close();
            playerDialog.classList.toggle("collapsed");
        });
        dealBtn.addEventListener('click', (e) => this.startGame());
    }

    #createPlayers() {
        const inputElements = playerDialogNameContainerElement.querySelectorAll("input");
        for(const inputElement of inputElements){
            const player = new Player(inputElement.value);
            this.players.push(player);
        }
    }

    #updatePlayerInputElements(playerCnt) {
        const currentInputElementCount = playerDialogNameContainerElement.children.length;

        if(playerCnt>currentInputElementCount) {
            // Add input elements
            for(let i=currentInputElementCount; i<playerCnt; i++) {
                const divElement = document.createElement("div");
                divElement.innerHTML = `
                <label for="player${i+1}-id" class="">Player ${i+1}</label>
                <input type="text" id="player${i+1}-id" minlength="1" maxlength="30" size="20">
                `;
                playerDialogNameContainerElement.appendChild(divElement);
            }
        } else if(playerCnt<currentInputElementCount) {
            // Remove input elements
            const cnt = currentInputElementCount - playerCnt;
            for(let i=0; i<cnt; i++) {
                playerDialogNameContainerElement.removeChild(playerDialogNameContainerElement.lastChild);
            }
        }
    }

    startGame() {
        const rounds = 1;
        if(this.players.length < 2) {
            console.error('You need to add players first!');
            return;
        }

        this.dealer.deal(5, ...this.players);

        // Game Loop
        // for(let i=0; i<rounds; i++) {
        //     this.players.forEach((player) => {
        //         player.sortCards();
        //         player.printIndex();
        //         this.#dropCards(player);
        //     });
        // }

        // this.validate = new Validate(this.players);
        // this.validate.printPlayerStats();
        // this.validate.printWinner();
    }

    #dropCards(player) {
        let [ans, ...rest] = prompt(`Do you wish to drop cards (Yes/No)? `);

        if(ans.toUpperCase() === 'Y') {
            const ids = prompt(`Select index's of cards to drop (separate index's with comma): `);
            let idxArr = ids.split(',');
            idxArr = idxArr.map((idx) => parseInt(idx.trim()));
            idxArr.forEach((idx) => {
                const removedCard = player.removeCard(idx);
                if(removedCard.length>0) {
                    this.pile.addCards([removedCard]);
                    this.dealer.deal(1, player);
                }
            });
        }
    }
}

playerDialog.showModal();
playerDialog.classList.toggle("collapsed");
const game = new Game();
