import persistence
from util import verify_password, hash_password


def get_card_title(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if str(status['id']) == str(status_id)), 'Unknown')


def get_user_id(session):
    if(session):
        userid = session['user_id']
    else:
        userid = None
    return userid


def get_boards(session):
    """
    Gather all boards
    :return:
    """
    userid = get_user_id(session)
    boardDatas = persistence.get_boards(force=True)
    newBoardData = []
    for boardData in boardDatas:
        if (boardData['user_id'] is None) or (boardData['user_id'] == userid):
            boardData['statuses'] = persistence.get_board_statuses(boardData['id'])
            newBoardData.append(boardData)
    return newBoardData


def get_board(board_id):
    """
    Find the board by id
    :return:
    """
    return persistence._read_table_by_id(board_id, 'boards')


def create_new_board(title, session):
    """
    Create new board
    """
    title_name = title['boardname']
    userid = get_user_id(session)
    board = persistence.create_new_board(title_name, userid)
    board['statuses'] = persistence.get_board_statuses(board['id'])
    return board


def rename_board(title, id_):
    """
    Rename board
    :return: OK/NOT OK TODO
    """
    return persistence.rename_board(title, id_)


def remove_board(board_id, session):
    """
    Remove board
    """
    userid = get_user_id(session)
    ownerid_data = persistence.get_board_owner(board_id)
    ownerid = ownerid_data['user_id']
    if ((ownerid is None) or (ownerid == userid)):
        return persistence.remove_board(board_id)
    else:
        status = "{'status': 'you are not the owner'}"
        return status


def manage_status(request):
    if request.method == 'POST':
        return _create_new_status(request)


def _create_new_status(request):
    status = request.json
    if 'board_id' not in status or 'title' not in status:
        return _critical_error()
    board = persistence.get_board_by_id(status['board_id'])
    if board:
        persistence.create_new_status(status)
        return _as_json(200, status['title'])
    else:
        return _critical_error()


def create_new_card(data, board_id):
    """
    Add new card to the first column of the given board
    """
    card_title = data['card-title']
    status_id = 0
    return persistence.create_new_card(card_title, board_id, status_id)


def get_cards_by_board_id(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if str(card['board_id']) == str(board_id):
            matching_cards.append(card)
    return matching_cards


def register_user(data):
    data['password'] = hash_password(data['password'])
    if not username_is_in(data['username']):
        return {'userid': persistence.insert_user(data)['id']}
    else:
        return {'userid': None}


def login_user(data, session):
    db_data = get_users()

    for row in db_data:
        if row['username'] == data['username'] and verify_password(data['password'], row['password']):
            session['username'] = data['username']
            session['user_id'] = row['id']
            return {'id': session['user_id'], 'username': data['username']}
    return {'username': None}


def username_is_in(username):
    return persistence.get_user_id(username)


def get_password(username):
    return persistence.get_user_password(username)['password']


def get_users():
    return persistence.get_user_data()


def remove_card(card_id):
    return persistence.remove_card(card_id)


def move_card(card_id, column_id, board_id):
    return persistence.move_card(card_id, column_id, board_id)


def _critical_error():
    return _as_json(400, 'Invalid request! Please refresh your browser!')


def _as_json(status_code, message=''):
    return {"status": status_code, "message": message}
