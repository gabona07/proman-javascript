// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        document.querySelector('#register').addEventListener('click', this.registerModal)
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
            for (let board of boards) { //TODO need to insert cards into the specific board
                dom.loadCards(board.id);//TODO loadCards function needs a proper board id
            }
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
            boardList += `
                <li>${board.title}</li>
            `;
        }

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);
        });
    },
    showCards: function (cards) { //TODO need columns for different statuses
        // shows the cards of a board
        // it adds necessary event listeners also
        let cardList = '';

        for(let card of cards){
            cardList += `
                <div class="card">${card.title}<div id="card-actions">Delete</div></div>       
            `;
        }
        const outerHtml = `${cardList}`;
        let cardsContainer = document.querySelector('#cards');
        cardsContainer.insertAdjacentHTML("beforeend", outerHtml);
    },
    registerModal: function(){
            const modalBody = document.querySelector('.modal-body');
            modalBody.innerHTML = '';
            document.querySelector('#modalTitle').textContent = 'Registration';
            const form = document.createElement('form');
            form.setAttribute('method', 'POST');
            form.setAttribute('action',"/register");
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('placeholder', 'Username');
            input.setAttribute('name', 'username');
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('required', 'required');
            // input.classList.add('form-control')
            const passwInput = document.createElement('input');
            passwInput.setAttribute('type', 'password');
            passwInput.setAttribute('placeholder', 'Password');
            passwInput.setAttribute('name', 'password');
            passwInput.setAttribute('required', 'required');
            // passwInput.classList.add('form-control')
            form.appendChild(input);
            form.appendChild(passwInput);
            const submitButton = document.createElement('button');
            submitButton.setAttribute('type', 'submit');
            submitButton.classList.add('btn', 'btn-secondary');
            submitButton.textContent = ' Submit';
            form.appendChild(submitButton);
            modalBody.appendChild(form);
    }
    // here comes more features
};
