// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        document.querySelector('#register').addEventListener('click', this.registerModal);
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
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
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    registerModal: function(){
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
    // here comes more features
};
