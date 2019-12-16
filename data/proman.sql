DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS statuses;


CREATE TABLE boards (
    id serial,
    title text
);

CREATE TABLE cards (
    id serial,
    title text,
    board_id serial,
    status_id serial,
    card_order serial
);

CREATE TABLE statuses (
    id serial,
    title text
);
