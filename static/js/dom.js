// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        document.querySelector('#register').addEventListener('click', this.registerModal);
        document.querySelector('#login').addEventListener('click', this.loginModal);
        document.querySelector('#newBoard').addEventListener('click', this.createBoardModal);
        document.querySelector('#refresh').addEventListener('click', this.loadBoards);
        setTimeout(this.loadBoards, 60000);
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
    loadBoardByID: function (boardID) {
        // retrieves a boards and makes showBoards called
        dataHandler.getBoard(boardID, function(boardID){
            dom.showBoards(boardID);
            dom.loadCards(boardID);
        });
    },
    showBoard: function (board) {
        let boardNode =
            `<div class="board mb-3" id="board-container-${board.id}">
                    <div class="row" id="board-header">
                        <h3 class="text-left" id="board-title">${board.title}</h3>
                        <button class="btn btn-secondary text-left btn-lg renameButton" data-toggle="modal" data-target="#staticBackdrop" id="renamelink" data-boardid="${board.id}">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="btn btn-secondary text-left btn-lg" data-boardid="${board.id}" id="add-new-card">+ New Card</button>
                        <button class="btn btn-secondary text-left btn-lg" data-toggle="modal" data-target="#staticBackdrop">+ New Column</button>
                        <button class="btn btn-secondary ml-auto btn-lg"><div id="removelink" data-boardid="${board.id}">Delete Board</div></button>
                        <button class="btn btn-secondary ml-auto btn-lg" data-boardid="${board.id}" id="show-hide-data">Show / Hide</button>
                    </div>
                    <div class="board-data-container" id="board-data-${board.id}">
                        <div class="row"></div>
                    </div>
                </div>
            `;
        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", boardNode);

        const statusContainerNode = boardsContainer.querySelector(`#board-data-${board.id} > div.row`);
        for (let i = 0; i < board.statuses.length; i++) {
            const statusNode = document.createElement('div');
            statusNode.classList.add('col', 'status', 'dropzone');
            statusNode.setAttribute('id', `board-column-${i}-${board.id}`);
            statusNode.setAttribute('data-column-id', `${board.statuses[i].id}`);
            statusNode.setAttribute('data-board-id', `${board.id}`);
            statusNode.innerText = board.statuses[i].title;
            statusContainerNode.appendChild(statusNode);
        }

        const actionButtons = document.querySelectorAll('#boards > div:last-child > div > button');

        const renameLink = actionButtons[0];
        renameLink.addEventListener('click', function() {
            dom.renameBoardModal(board.id)
        });

        let newCardButton = actionButtons[1];
        newCardButton.setAttribute('data-toggle', 'modal');
        newCardButton.setAttribute('data-target', '#staticBackdrop');
        newCardButton.setAttribute('data-boardid', `${board.id}`);
        newCardButton.addEventListener('click', function() {
            dom.createCardModal(board.id)
        });

        const newStatusButton = actionButtons[2];
        newStatusButton.addEventListener('click', function() {
            dom.createStatusModal(board.id)
        });

        let removeLink = actionButtons[3];
        removeLink.addEventListener('click', function() {
            dom.removeBoards(board.id);
        });

        let showHideButton = actionButtons[4];
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
    createStatusModal: function(boardId) {
        document.querySelector('.alert').style.display = 'none';
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = '';
        document.querySelector('#modalTitle').textContent = 'Add New Column';
        const form = document.createElement('form');
        const boardIdNode = document.createElement('input');
        boardIdNode.setAttribute('type', 'hidden');
        boardIdNode.setAttribute('name', 'board_id');
        boardIdNode.setAttribute('value', boardId);
        form.appendChild(boardIdNode);
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Column name');
        input.setAttribute('name', 'title');
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('required', 'required');
        form.appendChild(input);
        const addButton = document.createElement('a');
        addButton.setAttribute('type', 'submit');
        addButton.setAttribute('data-dismiss','modal');
        addButton.classList.add('btn', 'btn-secondary');
        addButton.textContent = 'Add Column';
        form.appendChild(addButton);
        modalBody.appendChild(form);
        addButton.addEventListener('click', function() {
            const formData = new FormData(form);
            dataHandler.createNewStatus(formData, function (response) {
                if (response.status === 200) {
                    const boardNode = document.querySelector(`#board-data-${boardId} > div.row`);
                    const statusNode = document.createElement('div');
                    const statusOrder = boardNode.childNodes.length;
                    statusNode.classList.add('col', 'status');
                    statusNode.setAttribute('id', `board-column-${statusOrder}-${boardId}`);
                    statusNode.textContent = response.message;
                    boardNode.appendChild(statusNode);
                }
            });
        });
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
        for(let card of cards) {

            // Create card container div element
            const cardContainer = document.createElement('div');
            cardContainer.textContent = `${card.title}`;
            cardContainer.setAttribute('class', 'card draggable');
            cardContainer.setAttribute('draggable', 'true');
            cardContainer.setAttribute('id', `card-container-${card.id}`);
            cardContainer.setAttribute('data-card-id', `${card.id}`);
            cardContainer.setAttribute('data-column-id', `${card.status_id}`);
            cardContainer.setAttribute('data-board-id', `${card.board_id}`);
            cardContainer.addEventListener('dragstart', () => handleDragAndDrop(cardContainer));

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
            const cardColumn = document.querySelector(`#board-column-${card.status_id}-${card.board_id}`);
            cardColumn.appendChild(cardContainer);
            cardContainer.appendChild(trashButton);

            function handleDragAndDrop(draggedCard) {
                draggedCard.classList.add('dragged');
                const dropzones = document.querySelectorAll(".dropzone");
                for (let dropzone of dropzones) {
                    dropzone.addEventListener("dragover", function (evt) {
                        evt.preventDefault();
                    });
                    dropzone.addEventListener("drop", function (evt) {
                        evt.preventDefault();
                        if (evt.target !== draggedCard.parentNode && evt.target !== draggedCard && draggedCard.classList == 'card draggable dragged') {
                            draggedCard.parentNode.removeChild(draggedCard);
                            evt.target.appendChild(draggedCard);
                            draggedCard.classList.remove('dragged');
                            const draggedCardId = draggedCard.dataset.cardId;
                            const parentColumnId = draggedCard.parentNode.dataset.columnId;
                            const parentBoardId = draggedCard.parentNode.dataset.boardId;
                            dataHandler.moveCard(draggedCardId, parentColumnId, parentBoardId, function () {
                            })
                        }
                    });
                }
            }
        }
    },
    createCardModal: function(boardId) {
        document.querySelector('.alert').style.display = 'none';
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
        addButton.classList.add('btn', 'btn-secondary');
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
        document.querySelector('.alert').style.display = 'none';
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
        addButton.setAttribute('class','btn btn-secondary');
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
    renameBoardModal: function(boardID) {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = '';
        document.querySelector('#modalTitle').textContent = 'Rename board';
        const form = document.createElement('form');
        form.setAttribute('id', 'renameBoardForm');
        const boardName = document.createElement('input');
        boardName.setAttribute('type', 'text');
        boardName.setAttribute('placeholder', 'Board Name');
        boardName.setAttribute('name', 'boardname');
        boardName.setAttribute('autocomplete', 'off');
        boardName.setAttribute('required', 'required');
        form.appendChild(boardName);
        const addButton = document.createElement('a');
        addButton.setAttribute('type', 'submit');
        addButton.setAttribute('id', 'addRenameButton');
        addButton.setAttribute('data-dismiss', 'modal');
        addButton.setAttribute('class', 'btn btn-secondary');
        addButton.textContent = 'Submit';
        form.appendChild(addButton);
        modalBody.appendChild(form);
        document.querySelector('#addRenameButton').addEventListener('click',
            function () {
                let boardForm = document.getElementById('renameBoardForm');
                let formData = new FormData(boardForm);
                dataHandler.renameBoard(formData, boardID, function (renamedBoard) {
                    let renamedBoardID = renamedBoard[0];
                    let divID = "board-container-"+renamedBoardID;
                    document.getElementById(divID).remove();
                    dom.loadBoardByID(renamedBoardID)})
            });
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
                dataHandler.registerUser(new FormData(form), function(serverResponse) {
                    if(serverResponse.userid){
                        $('.modal').modal('hide');
                        console.log(serverResponse);
                    } else {
                        document.querySelector('.alert').style.display = 'flex';
                        document.querySelector('.alert').textContent = 'Hey mate! This username has been taken';

                    }

                })
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
                dataHandler.loginUser(new FormData(form), function (serverResponse) {
                    if(serverResponse.username){
                        $('.modal').modal('hide');
                        console.log(serverResponse);
                        document.querySelector('#login').textContent = 'Logged in as ' + serverResponse.username;
                        document.querySelector('#logout').textContent = 'Logout';
                        dom.loadBoards();
                    } else {
                        document.querySelector('.alert').style.display = 'flex';
                        document.querySelector('.alert').textContent = 'Holy guacamole! You should check in on some of those fields above.';
                    }

                })
            });
            modalBody.appendChild(form)
    },
};