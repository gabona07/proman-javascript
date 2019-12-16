ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS boards_pkey CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS cards_pkey CASCADE;
ALTER TABLE IF EXISTS ONLY public.statuses DROP CONSTRAINT IF EXISTS statuses_pkey CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_status_id CASCADE;


DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS statuses;


CREATE TABLE boards (
    id serial PRIMARY KEY,
    title text
);

CREATE TABLE cards (
    id serial PRIMARY KEY,
    title text,
    board_id serial,
    status_id serial,
    card_order serial
);

CREATE TABLE statuses (
    id serial PRIMARY KEY,
    title text
);


ALTER TABLE cards
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id)
          REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE cards
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id)
          REFERENCES statuses(id) ON DELETE CASCADE;