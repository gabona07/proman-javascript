from flask import Flask, render_template, url_for, request, redirect, session
from util import json_response, hash_password, verify_password

import data_handler

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 1
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html', session=session)


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards(session)


@app.route("/create-new-board", methods=['POST'])
@json_response
def create_new_board():
    """
    Create new board
    """
    if request.method == 'POST':
        title = request.json
        return data_handler.create_new_board(title, session)


@app.route("/create-new-card-<int:board_id>", methods=['POST'])
@json_response
def create_new_card(board_id: int):
    """
    Create new board
    """
    if request.method == 'POST':
        card_attributes = request.json
        card_title = card_attributes['card-title']
        status_id = 0
        return data_handler.create_new_card(card_title, board_id, status_id)


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


@app.route("/delete/card/<int:card_id>")
@json_response
def remove_card(card_id: int):
    return data_handler.remove_card(card_id)


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
        return data_handler.login_user(data, session)


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
