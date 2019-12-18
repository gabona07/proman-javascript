// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        document.querySelector('#register').addEventListener('click', this.registerModal)
        document.querySelector('#newBoard').addEventListener('click', this.createBoardModal)
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
                <div class="board mb-3" id="board-container-${board.id}">
                <div class="row" id="board-header">
                    <h3 class="text-left" id="board-title">${board.title}</h3>
                    <button class="btn btn-secondary text-left btn-lg">+ New Card</button>
                    <button class="btn btn-secondary ml-auto btn-lg">Show / Hide</button>
                </div>
                <div class="row">
                    <div class="col status" data-board-id="1" data-status-id="1">New</div>
                    <div class="col status" data-board-id="1" data-status-id="2">In progress</div>
                    <div class="col status" data-board-id="1" data-status-id="3">Testing</div>
                    <div class="col status" data-board-id="1" data-status-id="4">Done</div>
                </div>
                <div class="row">
                    <div class="col" id="new"></div>
                    <div class="col" id="in-progress"></div>
                    <div class="col" id="testing"></div>
                    <div class="col" id="done"></div>
                </div>
                </div>
            `;
        }

        const outerHtml = `
            ${boardList}
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
        for(let card of cards){
            let boardId = card.board_id;
            const cardContainer = document.createElement('div');
            cardContainer.setAttribute('class', 'card');
            cardContainer.textContent = `${card.title}`;
            let boardContainer = document.querySelector(`#board-container-${boardId}`);
            boardContainer.appendChild(cardContainer)
        }
    },
    createBoardModal: function() {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = '';
        document.querySelector('#modalTitle').textContent = 'Create new board';
        const form = document.createElement('form');
        form.setAttribute('id','createBoardForm')
        const boardName = document.createElement('input');
        boardName.setAttribute('type', 'text');
        boardName.setAttribute('placeholder', 'Board Name');
        boardName.setAttribute('name', 'boardname');
        boardName.setAttribute('autocomplete', 'off');
        boardName.setAttribute('required', 'required');
        form.appendChild(boardName);
        const addButton = document.createElement('a');
        addButton.setAttribute('type', 'submit');
        addButton.setAttribute('id','addButton');
        addButton.setAttribute('data-dismiss','modal');
        addButton.classList.add('btn', 'btn-primary');
        addButton.textContent = 'Submit';
        form.appendChild(addButton);
        modalBody.appendChild(form);

        document.querySelector('#addButton').addEventListener('click',
            function() {
                        let boardForm = document.getElementById('createBoardForm');
                        var formData = new FormData(boardForm);
                        dataHandler.createNewBoard(formData, function(addedBoard) {
                            dom.showBoards(addedBoard);
                        });
                    }
        )
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
