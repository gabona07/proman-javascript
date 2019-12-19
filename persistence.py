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


@connection.connection_handler
def _read_table_by_id(cursor, id_, table_name):
    """
    Reads content of a table
    :param table_name: table's name in the database
    :return: OrderedDict
    """
    id_data = int(id_)
    cursor.execute(sql.SQL("SELECT * FROM {} WHERE id = (%s)").format(sql.Identifier(table_name)), [id_data])
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
def create_new_board(cursor, title_data, userid):
    """
    Adds new table
    """
    cursor.execute(sql.SQL("INSERT INTO {} (title, user_id) VALUES (%s, %s) RETURNING id, title, user_id").format(
        sql.Identifier('boards')), [title_data, userid])
    data_return = cursor.fetchone()
    return data_return


@connection.connection_handler
def rename_board(cursor, title_data, id_):
    """
    Rename board
    """
    cursor.execute(sql.SQL("UPDATE {} SET title = %s WHERE id=%s").format(sql.Identifier('boards')), (title_data, id_))
    return id_


@connection.connection_handler
def remove_board(cursor, id_data):
    cursor.execute(sql.SQL("DELETE FROM {} WHERE id = (%s)").format(sql.Identifier('boards')), [id_data])
    cursor.execute(sql.SQL("DELETE FROM {} WHERE board_id = (%s)").format(sql.Identifier('cards')), [id_data])
    status = "{'status': 'dummy'}"
    return status


@connection.connection_handler
def create_new_card(cursor, title_data, board_id_data, status_id):
    """
    Adds new card
    """
    cursor.execute(
        sql.SQL("INSERT INTO {} (title, board_id, status_id) VALUES (%s, %s, %s) RETURNING id, title").format(
            sql.Identifier('cards')), [title_data, board_id_data, status_id])
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


@connection.connection_handler
def insert_user(cursor, data):
    cursor.execute("""
                    INSERT INTO users (username, password)
                    VALUES (%(user_name)s, %(pw)s)
                    RETURNING id""",
                   {
                       'user_name': data['username'],
                       'pw': data['password']
                   })
    return cursor.fetchone()


@connection.connection_handler
def get_user_id(cursor, username):
    cursor.execute("""
                    SELECT * FROM users
                    WHERE username = %(uname)s
                    """,
                   {
                       'uname': username
                   })
    return cursor.fetchone()


@connection.connection_handler
def get_user_data(cursor):
    cursor.execute("""
                    SELECT id, username, password FROM users
                    """)
    return cursor.fetchall()


@connection.connection_handler
def remove_card(cursor, card_id):
    cursor.execute(sql.SQL("DELETE FROM {} WHERE id = (%s)").format(sql.Identifier('cards')), [card_id])
