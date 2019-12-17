import connection
from psycopg2 import sql

_cache = {}  # We store cached data in this dict to avoid multiple file readings


@connection.connection_handler
def _read_table(cursor, table_name):
    """
    Reads content of a table
    :param table_name: table's name in the database
    :return: OrderedDict
    """
    cursor.execute(sql.SQL("SELECT * FROM {}").format(sql.Identifier(table_name)))
    table_data = cursor.fetchall()
    return table_data


def _get_data(data_type, table_name, force):
    """
    Reads defined type of data from file or cache
    :param data_type: key where the data is stored in cache
    :param table_name: table's name in the database
    :param force: if set to True, cache will be ignored
    :return: OrderedDict
    """
    if force or data_type not in _cache:
        _cache[data_type] = _read_table(table_name)
    return _cache[data_type]


@connection.connection_handler
def create_new_board(cursor, title_data):
    """
    Adds new table
    """
    cursor.execute(sql.SQL("INSERT INTO {} (title) VALUES (%s) RETURNING id").format(sql.Identifier('boards')), [title_data])
    id_return = cursor.fetchone()
    return id_return


def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses(force=False):
    return _get_data('statuses', 'statuses', force)


def get_boards(force=False):
    return _get_data('boards', 'boards', force)


def get_cards(force=False):
    return _get_data('cards', 'cards', force)
