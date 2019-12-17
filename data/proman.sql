ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS boards_pkey CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS cards_pkey CASCADE;
ALTER TABLE IF EXISTS ONLY public.statuses DROP CONSTRAINT IF EXISTS statuses_pkey CASCADE;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey CASCADE;
ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS fk_user_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_status_id CASCADE;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS statuses;


CREATE TABLE boards (
    id serial PRIMARY KEY,
    title text,
    user_id integer
);

CREATE TABLE cards (
    id serial PRIMARY KEY,
    board_id serial,
    title text,
    status_id serial,
    card_order serial
);

CREATE TABLE statuses (
    id serial PRIMARY KEY,
    title text
);


CREATE TABLE users (
    id serial PRIMARY KEY,
    username text,
    password text
);

ALTER TABLE cards
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id)
          REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE cards
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id)
          REFERENCES statuses(id) ON DELETE CASCADE;

ALTER TABLE boards
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id)
          REFERENCES users(id) ON DELETE CASCADE;


INSERT INTO boards VALUES (1,'Board 1');
INSERT INTO boards VALUES (2,'Board 2');

INSERT INTO statuses VALUES (0, 'new');
INSERT INTO statuses VALUES (1, 'in progress');
INSERT INTO statuses VALUES (2, 'testing');
INSERT INTO statuses VALUES (3, 'done');

INSERT INTO cards VALUES (1,1,'new card 1',0,0);
INSERT INTO cards VALUES (2,1,'new card 2',0,1);
INSERT INTO cards VALUES (3,1,'in progress card',1,0);
INSERT INTO cards VALUES (4,1,'planning',2,0);
INSERT INTO cards VALUES (5,1,'done card 1',3,0);
INSERT INTO cards VALUES (6,1,'done card 1',3,1);
INSERT INTO cards VALUES (7,2,'new card 1',0,0);
INSERT INTO cards VALUES (8,2,'new card 2',0,1);
INSERT INTO cards VALUES (9,2,'in progress card',1,0);
INSERT INTO cards VALUES (10,2,'planning',2,0);
INSERT INTO cards VALUES (11,2,'done card 1',3,0);
INSERT INTO cards VALUES (12,2,'done card 1',3,1);




