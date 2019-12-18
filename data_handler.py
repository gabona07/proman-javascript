import persistence


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(force=True)


def create_new_board(title):
    """
    Create new board
    """
    title_name = title['boardname']
    return persistence.create_new_board(title_name)

def remove_board(board_id):
    """
    Remove board
    """
    return persistence.remove_board(board_id)


def get_cards_by_board_id(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if str(card['board_id']) == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


def get_cards_for_board():
    cards_for_board = []
    boards = get_boards()
    for board in boards:
        board_id = board['id']
        cards_for_board.append(get_cards_by_board_id(board_id))
    return cards_for_board


def register_user(data):
    if not username_is_in(data['username']):
        return {'userid': persistence.insert_user(data)['id']}
    else:
        return {'userid': None}


def username_is_in(username):
    return persistence.get_user_id(username)
