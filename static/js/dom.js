// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        document.querySelector('#register').addEventListener('click', this.registerModal);
        document.querySelector('#login').addEventListener('click', this.loginModal);
        document.querySelector('#newBoard').addEventListener('click', this.createBoardModal);
        // This function should run once, when the page is loaded.
    },
    removeBoards: function(boardID) {
        let divID = "board-container-"+boardID;
        document.getElementById(divID).remove();
        dataHandler.removeBoard(boardID, function(){});
    },
    removeCard: function(cardId) {
        let cardDiv = "card-container-" + cardId;
        document.getElementById(cardDiv).remove();
        dataHandler.removeCard(cardId, function () {})
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        document.querySelector('#boards').innerHTML = "";
        dataHandler.getBoards(function(boards){
            dom.showBoards  (boards);
            for (let board of boards) {
                dom.loadCards(board.id);
            }
        });
    },
    showBoard: function (board) {
        let boardNode =
            `<div class="board mb-3" id="board-container-${board.id}">
                    <div class="row" id="board-header">
                        <h3 class="text-left" id="board-title">${board.title}</h3>
                        <button class="btn btn-secondary text-left btn-lg" data-boardid="${board.id}" id="add-new-card">+ New Card</button>
                        <button class="btn btn-secondary ml-auto btn-lg"><div id="removelink" data-boardid="${board.id}">Delete Board</div></button>
                        <button class="btn btn-secondary ml-auto btn-lg" data-boardid="${board.id}" id="show-hide-data">Show / Hide</button>
                    </div>
                    <div class="board-data-container" id="board-data-${board.id}">
                        <div class="row">
                            <div class="col status" id="board-column-0-${board.id}">New</div>
                            <div class="col status" id="board-column-1-${board.id}">In progress</div>
                            <div class="col status" id="board-column-2-${board.id}">Testing</div>
                            <div class="col status" id="board-column-3-${board.id}">Done</div>
                        </div>
                    </div>
                </div>
            `;
        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", boardNode);
        const actionButtons = document.querySelectorAll('#boards > div:last-child > div > button');

        let newCardButton = actionButtons[0];
        newCardButton.setAttribute('data-toggle', 'modal');
        newCardButton.setAttribute('data-target', '#staticBackdrop');
        newCardButton.setAttribute('data-boardid', `${board.id}`);

        newCardButton.addEventListener('click', function() {
            dom.createCardModal(board.id)
        });
        let removeLink = actionButtons[1];
        removeLink.addEventListener('click', function() {
            dom.removeBoards(board.id);
        });

        let showHideButton = actionButtons[2];
        let boardId = board['id'];
        let boardDataContainer = document.querySelector(`#board-data-${boardId}`);
        boardDataContainer.style.display = 'none';
        showHideButton.addEventListener('click', function () {
            if (boardDataContainer.style.display === 'none') {
                boardDataContainer.style.display = 'block';
            } else {
                boardDataContainer.style.display = 'none';
            }
        })
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        for(let board of boards) {
            this.showBoard(board);
        }
    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);
        });
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for(let card of cards){
            // Create card container div element
            const cardContainer = document.createElement('div');
            cardContainer.textContent = `${card.title}`;
            cardContainer.setAttribute('class', 'card');
            cardContainer.setAttribute('id', `card-container-${card.id}`);

            // Create trash icon
            let trashBinIcon = document.createElement('img');
            trashBinIcon.setAttribute('src', '../static/css/images/Trash-icon.png');
            trashBinIcon.setAttribute('width', '36');
            trashBinIcon.setAttribute('height', '36');

            // Create trash button
            let trashButton = document.createElement('button');
            trashButton.style.border = 'none';
            trashButton.style.backgroundColor = '#f7f7f7';
            trashButton.appendChild(trashBinIcon);
            trashButton.addEventListener('click', function () {
                dom.removeCard(card.id);
            });

            // Get the corresponding board and column for each card
            const cardBoardId = card.board_id;
            const cardStatusId = card.status_id;
            const cardColumn = document.querySelector(`#board-column-${cardStatusId}-${cardBoardId}`);
            cardColumn.appendChild(cardContainer);
            cardContainer.appendChild(trashButton)
        }
    },
    createCardModal: function(boardId) {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = '';
        document.querySelector('#modalTitle').textContent = 'Add New Card';
        const form = document.createElement('form');
        form.setAttribute('id','createCardForm');
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'card-title');
        input.setAttribute('name', 'card-title');
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('required', 'required');
        form.appendChild(input);
        const addButton = document.createElement('a');
        addButton.setAttribute('type', 'submit');
        addButton.setAttribute('id','addCardButton');
        addButton.setAttribute('data-dismiss','modal');
        addButton.classList.add('btn', 'btn-primary');
        addButton.textContent = 'Add Card';
        form.appendChild(addButton);
        modalBody.appendChild(form);
        document.querySelector('#addCardButton').addEventListener('click',
    function() {
                let cardForm = document.getElementById('createCardForm');
                let formData = new FormData(cardForm);
                dataHandler.createNewCard(formData, boardId, function () {
                    // dom.showBoards(board) => show boards needs a board parameter as an iterable array TODO
                    window.location.reload();
                })
            }
        )
    },
    createBoardModal: function() {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = '';
        document.querySelector('#modalTitle').textContent = 'Create new board';
        const form = document.createElement('form');
        form.setAttribute('id','createBoardForm');
        const boardName = document.createElement('input');
        boardName.setAttribute('type', 'text');
        boardName.setAttribute('placeholder', 'Board Name');
        boardName.setAttribute('name', 'boardname');
        boardName.setAttribute('autocomplete', 'off');
        boardName.setAttribute('required', 'required');
        form.appendChild(boardName);
        const addButton = document.createElement('a');
        addButton.setAttribute('type', 'button');
        addButton.setAttribute('id','addButton');
        addButton.setAttribute('data-dismiss','modal');
        addButton.classList.add('btn', 'btn-primary');
        addButton.textContent = 'Submit';
        form.appendChild(addButton);
        modalBody.appendChild(form);

        document.querySelector('#addButton').addEventListener('click',
            function() {
                        let boardForm = document.getElementById('createBoardForm');
                        let formData = new FormData(boardForm);
                        dataHandler.createNewBoard(formData, function(addedBoard) {
                            dom.showBoard(addedBoard);
                        });
                    }
        )
    },
    registerModal: function(){
            document.querySelector('.alert').style.display = 'none';
            const modalBody = document.querySelector('.modal-body');
            const form = document.createElement('form');
            form.setAttribute('id', 'registerForm');
            modalBody.innerHTML = '';
            document.querySelector('#modalTitle').textContent = 'Registration';
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('placeholder', 'Username');
            input.setAttribute('name', 'username');
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('required', 'required');
            const passwInput = document.createElement('input');
            passwInput.setAttribute('type', 'password');
            passwInput.setAttribute('placeholder', 'Password');
            passwInput.setAttribute('name', 'password');
            passwInput.setAttribute('required', 'required');
            form.appendChild(input);
            form.appendChild(passwInput);
            const submitButton = document.createElement('button');
            submitButton.setAttribute('type', 'button');
            submitButton.setAttribute('id', 'registerButton');
            submitButton.classList.add('btn', 'btn-secondary');
            submitButton.textContent = ' Submit';

            form.appendChild(submitButton);
            submitButton.addEventListener('click', function(){
                dataHandler.registerUser(new FormData(form))
            });
            modalBody.appendChild(form)
    },
    loginModal: () => {
            document.querySelector('.alert').style.display = 'none';
            const modalBody = document.querySelector('.modal-body');
            const form = document.createElement('form');
            form.setAttribute('id', 'registerForm');
            modalBody.innerHTML = '';
            document.querySelector('#modalTitle').textContent = 'Login';
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('placeholder', 'Username');
            input.setAttribute('name', 'username');
            input.setAttribute('autocomplete', 'off');
            input.setAttribute('required', 'required');
            const passwInput = document.createElement('input');
            passwInput.setAttribute('type', 'password');
            passwInput.setAttribute('placeholder', 'Password');
            passwInput.setAttribute('name', 'password');
            passwInput.setAttribute('required', 'required');
            form.appendChild(input);
            form.appendChild(passwInput);
            const submitButton = document.createElement('button');
            submitButton.setAttribute('type', 'button');
            submitButton.setAttribute('id', 'registerButton');
            submitButton.classList.add('btn', 'btn-secondary');
            submitButton.textContent = ' Submit';
            form.appendChild(submitButton);
            submitButton.addEventListener('click', function(){
                dataHandler.loginUser(new FormData(form), function(serverResponse){
                    if(serverResponse.username){
                        $('.modal').modal('hide');
                        document.querySelector('#login').textContent = 'Logged in as ' + serverResponse.username;
                        document.querySelector('#logout').textContent = 'Logout';
                        dom.loadBoards();
                    } else {
                        // alert('Wrong username or password');
                        document.querySelector('.alert').style.display = 'flex';
                        // $('.alert').alert()
                    }

                        })
            });
            modalBody.appendChild(form)

    },
    logout: function(){

    }
    // here comes more features
};
