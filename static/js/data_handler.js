// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            body: JSON.stringify(Object.fromEntries(data)),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
        // it is not called from outside
        // sends the data to the API, and calls callback function
    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
        this._api_get('/get-board/' + `${boardId}`, (response) => {
            this._data = response;
            callback(response);
        });
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    removeBoard: function(boardId, callback) {
        this._api_get('/delete/board/' + `${boardId}`, (response) => {
            this._data = response;
            callback(response);
        });
    },
    editCard: function(cardID, cardTitle, cardBoardId, callback) {
        this._api_post('/edit/card/' + `${cardBoardId}` + '-' + `${cardID}`, cardTitle, (response) => {
            this._data = response;
            response = [response];
            callback(response);
        });
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get('/get-cards/' + `${boardId}`, (response) => {
            this._data = response;
            callback(response);
        });
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
        this._api_post('/create-new-board', boardTitle, (response) => {
            this._data = response;
            callback(response);
        })
    },
    createNewStatus: function(form, callback) {
        this._api_post('/status', form, (response) => {
            callback(response);
        });
    },
    createNewCard: function (cardTitle, boardId, statusId, callback) {
        // creates new card, saves it and calls the callback function with its data
        this._api_post(`/create-new-card-${boardId}-${statusId}`, cardTitle,  (response) => {
            this._data = response;
            response = [response];
            callback(response);
        })
    },
    removeCard: function (cardId, callback) {
        this._api_get('/delete/card/' + `${cardId}`, (response) => {
            this._data = response;
            callback(response);
        });
    },
    registerUser: function(form, callback){
        this._api_post('/register', form, (response) => {
            this._data = response;
            callback(response);
        });
    },
    renameBoard: function (boardTitle, boardID, callback) {
        // rename board, saves it and calls the callback function with its data
        this._api_post('/rename-board/' + `${boardID}`, boardTitle, (response) => {
            this._data = response;
            response = [response];
            callback(response);
        })
    },
    loginUser: function(form, callback){
        this._api_post('/login', form, (response) => {
            this._data = response;
            callback(response);
        });
    },
    moveCard: function (cardId, columnId, boardId, callback) {
        this._api_get('move-card/' + `${boardId}/` + `${columnId}/` + `${cardId}`, (response) =>{
            callback(response);
        } )
    }
    // here comes more features
};
