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
    userid = 0
    """TODO: REPLACE WITH REAL USER ID"""
    return data_handler.get_boards(userid)


@app.route("/create-new-board", methods=['POST'])
@json_response
def create_new_board():
    """
    Create new board
    """
    if request.method == 'POST':
        title = request.json
        return data_handler.create_new_board(title)


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
        db_data = data_handler.get_users()
        for row in db_data:
            if row['username'] == data['username'] and verify_password(data['password'], row['password']):
                session['username'] = data['username']
                session['user_id'] = row['id']
                return {'id': session['user_id'], 'username': data['username']}
        return {'username': None}


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))

def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
