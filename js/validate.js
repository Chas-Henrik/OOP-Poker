import { SUITES } from "./card.js";


export class Validate {
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
