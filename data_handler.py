import persistence


def get_card_title(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if str(status['id']) == str(status_id)), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards(force=True)


def create_new_board(title):
    """
    Create new board
    :return: OK/NOT OK TODO
    """
    title_name = title['boardname']
    return persistence.create_new_board(title_name)


def create_new_card(card_attributes):
    card_title = card_attributes['card-title']
    board_id = 1
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
