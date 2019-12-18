from flask import Flask, render_template, url_for, request, redirect
from util import json_response, hash_password

import data_handler

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1

@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route("/create-new-board", methods=['POST'])
@json_response
def create_new_board():
    """
    Create new board
    """
    if request.method == 'POST':
        title = request.json
        return data_handler.create_new_board(title)


@app.route("/create-new-card", methods=['POST'])
@json_response
def create_new_card():
    """
    Create new board
    """
    if request.method == 'POST':
        card_attributes = request.json
        return data_handler.create_new_card(card_attributes)


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_by_board_id(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_by_board_id(board_id)


@app.route("/delete/board/<int:board_id>")
@json_response
def remove_board(board_id: int):
    return data_handler.remove_board(board_id)


@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.json
        data['password'] = hash_password(data['password'])
        return data_handler.register_user(data)


@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.json
        print(data)
    pass

def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
