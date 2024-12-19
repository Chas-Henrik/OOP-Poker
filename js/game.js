import { Pile } from "./pile.js";
import { Dealer } from "./dealer.js";
import { Player } from "./player.js"
import { Validate } from "./validate.js"

const playerDialog = document.getElementById("player-dialog-id");
const playerDialogCountFieldset = document.getElementById("player-dialog-fieldset-id");
const playerDialogNameContainerElement = document.getElementById("player-dialog-name-container-id");
const playerDialogOkBtn = document.getElementById("player-dialog-ok-btn-id");
const dealBtn = document.getElementById("deal-button-id"); 

export class Game {
    constructor() {
        this.dealer = new Dealer();
        this.players = [];
        this.pile = new Pile();
        playerDialog.showModal();
        playerDialog.classList.toggle("collapsed");
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