import { SUITES } from "./card.js";

export const HANDS = ['Straight flush', 'Four of a kind', 'Full house', 'Flush', 'Straight', 'Three of a kind', 'Two pair', 'One pair', 'High card']

export class Validate {
    constructor(players) {
        this.playerStats = [];
        players.forEach((player) => {
            const playerCards = player.getCards();
            const playerCardsSortedByValue = Validate.sortCardsByValue(playerCards);
            const playerHand = Validate.getHand(playerCardsSortedByValue);
            const playerTotal =  playerCardsSortedByValue.reduce((acc, card) => acc + card.value, 0);
            this.playerStats.push({Name: player.getName(), Hand: playerHand, Cards: playerCardsSortedByValue, Total: playerTotal});
        });
    }

    static getHand(playerCards) {
        const playerCardsSortedByValue = Validate.sortCardsByValue(playerCards);
        if(playerCards.length>=5) {
            for(let i=0; i<HANDS.length; i++) {
                const hand = Validate.#matchHand(HANDS[i], playerCardsSortedByValue)
                if(hand.length>0)
                    return {HandIdx: i, Cards: hand};
            }
        }
        return {HandIdx: HANDS.length-1, Cards: playerCardsSortedByValue};
    }

    static #matchHand(hand, cardsSortedByValue) {
        switch(hand) {
            case 'Straight flush':
                return Validate.#matchStraightFlush(cardsSortedByValue);
            case 'Four of a kind':
                return Validate.#matchFourOfAKind(cardsSortedByValue);
            case 'Full house':
                return Validate.#matchFullHouse(cardsSortedByValue);
            case 'Flush':
                return Validate.#matchFlush(cardsSortedByValue);
            case 'Straight':
                return Validate.#matchStraight(cardsSortedByValue);
            case 'Three of a kind':
                return Validate.#matchThreeOfAKind(cardsSortedByValue);
            case 'Two pair':
                return Validate.#matchTwoPairs(cardsSortedByValue);
            case 'One pair':
                return Validate.#matchOnePair(cardsSortedByValue);
            default:
                return cardsSortedByValue;
        }
    }

    static #matchStraightFlush(cards) {
        const straight = Validate.#matchStraight(cards);
        const flush = Validate.#matchFlush(cards);
        return (straight.length > 0) && (flush.length > 0) ? cards : [];
    }

    static #matchFourOfAKind(cards) {
        for(let i=0; i<cards.length-3; i++) {
            if(cards[i].value === cards[i+1].value && cards[i+1].value === cards[i+2].value && 
                cards[i+2].value === cards[i+3].value) {
                    return [cards[i], cards[i+1], cards[i+2], cards[i+3]];
                }
        }
        return [];
    }

    static #matchFullHouse(cards) {
        let pair = false;
        let pairArr = [];
        let threeOfAKind = false;
        let threeOfAKindArr = [];
        for(let i=0; i<cards.length-1; i++) {
            if(i<cards.length-2 && cards[i].value === cards[i+1].value && cards[i+1].value === cards[i+2].value) {
                threeOfAKind = true;
                threeOfAKindArr = [cards[i], cards[i+1], cards[i+2]];
                i += 2;
            }
            else if(cards[i].value === cards[i+1].value) {
                pair = true;
                pairArr = [cards[i], cards[i+1]];
                i += 1;
            }
        }
        return (threeOfAKind && pair) ? [...threeOfAKindArr, ...pairArr] : [];
    }

    static #matchFlush(cards) {
        const startSuit = cards[0].suit
        return cards.every((card) => card.suit === startSuit) ? cards : [];
    }

    static #matchStraight(cards) {
        const startVal = cards[0].value;
        for(let i=1; i<cards.length; i++) {
            if(cards[i].value !== startVal - i) {
                return [];
            }
        }
        return cards;
    }

    static #matchThreeOfAKind(cards) {
        for(let i=0; i<cards.length-2; i++) {
            if(cards[i].value === cards[i+1].value && cards[i+1].value === cards[i+2].value) {
                return [cards[i], cards[i+1], cards[i+2]];
            }
        }
        return [];
    }

    static #matchTwoPairs(cards) {
        let twoPair = [];
        let pairs = 0;
        for(let i=0; i<cards.length-1; i++) {
            if(cards[i].value === cards[i+1].value) {
                twoPair.push(cards[i]);
                twoPair.push(cards[i+1]);
                pairs++;
                i += 1;
            }
        }
        return pairs === 2 ? twoPair: [];
    }

    static #matchOnePair(cards) {
        for(let i=0; i<cards.length-1; i++) {
            if(cards[i].value === cards[i+1].value) 
                return [cards[i], cards[i+1]];
        }
        return [];
    }

    static sortCardsByValue(cards) {
        return cards.sort((a,b) => Validate.#sortByValue(a,b));
    }

    static #sortByValue(a,b) {
        const diffValue = b.value - a.value;
        // Sort by Suit if Value is same
        if(diffValue === 0){
            const suitA = a.suit.toUpperCase(); // ignore upper and lowercase
            const suitB = b.suit.toUpperCase(); // ignore upper and lowercase
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
            if(player1.Hand.Cards[i].value === player2.Hand.Cards[i].value)
                continue;
            else if(player1.Hand.Cards[i].value > player2.Hand.Cards[i].value) {
                return player1;
            } 
            else {
                return player2;
            }
        }

        // Resolve tie by Suit
        for(let i=0; i<player1.Hand.Cards.length; i++) {
            if(SUITES.indexOf(player1.Hand.Cards[i].suit) < SUITES.indexOf(player2.Hand.Cards[i].suit)) {
                return player1;
            } 
            else {
                return player2;
            }
        }
    }
}
