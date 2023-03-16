CREATE TABLE object(
    id_object INTEGER NOT NULL CHECK (id_object > 0),
    description_object VARCHAR(30) NOT NULL CHECK (description_object != ''),
    PRIMARY KEY (id_object)
);

CREATE TABLE method(
    id_method INTEGER NOT NULL CHECK (id_method > 0),
    id_object INTEGER NOT NULL CHECK (id_object > 0),
    description_method VARCHAR(30) NOT NULL CHECK (description_method != ''),
    PRIMARY KEY (id_method),
    UNIQUE(id_method, id_object),
    FOREIGN KEY (id_object) REFERENCES object(id_object)
);


CREATE TABLE profile(
    id_profile INTEGER NOT NULL CHECK (id_profile > 0),
    description_project VARCHAR(30) NOT NULL,
    PRIMARY KEY (id_profile)
);

CREATE TABLE users(
    id_user SERIAL NOT NULL CHECK (id_user > 0),
    password VARCHAR(100) NOT NULL,
    email VARCHAR(50) NOT NULL,

    id_profile INTEGER NOT NULL CHECK (id_profile > 0),
    FOREIGN KEY (id_profile) REFERENCES profile (id_profile),
    PRIMARY KEY(id_user)
);

CREATE TABLE user_profile(
    id_user INTEGER NOT NULL CHECK (id_user > 0),
    id_profile INTEGER NOT NULL CHECK (id_profile > 0),
    FOREIGN KEY (id_profile) REFERENCES profile (id_profile),
    FOREIGN KEY (id_user) REFERENCES users (id_user),
    PRIMARY KEY (id_profile, id_user)
);

CREATE TABLE method_permissions(
    id_profile INTEGER NOT NULL CHECK (id_profile > 0),
    id_method INTEGER NOT NULL CHECK (id_method > 0),
    FOREIGN KEY (id_profile) REFERENCES profile (id_profile),
    FOREIGN KEY (id_method) REFERENCES method (id_method),
    PRIMARY KEY (id_profile, id_method)
);

CREATE TABLE object_permissions(
    id_profile INTEGER NOT NULL CHECK (id_profile > 0),
    id_object INTEGER NOT NULL CHECK (id_object > 0),

    FOREIGN KEY (id_profile) REFERENCES profile (id_profile),
    FOREIGN KEY (id_object) REFERENCES object (id_object),
    PRIMARY KEY (id_profile, id_object)
);

INSERT INTO profile (id_profile, description_project) VALUES (1, 'User'), (2, 'Admin');

--Jueguito

CREATE TABLE categories(
    id_category SERIAL NOT NULL CHECK (id_category > 0),
    description_category VARCHAR(30) NOT NULL CHECK (description_category != ''),
    PRIMARY KEY (id_category)
);

INSERT INTO categories (description_category) VALUES ('Nombre'), ('Apellido'), ('Cosa'), ('Color'), ('Lugar'), ('Animal'), ('Comida'), ('Profesion'), ('Deporte') ;


CREATE TABLE games(
    id_game SERIAL NOT NULL CHECK (id_game > 0),
    PRIMARY KEY (id_game)
);

CREATE TABLE games_categories(
    id_game INTEGER NOT NULL CHECK (id_game > 0),
    id_category INTEGER NOT NULL CHECK (id_category > 0),
    FOREIGN KEY (id_game) REFERENCES games (id_game),
    FOREIGN KEY (id_category) REFERENCES categories (id_category),
    PRIMARY KEY (id_game, id_category)
);

CREATE TABLE games_users(
    id_game INTEGER NOT NULL CHECK (id_game > 0),
    id_user INTEGER NOT NULL CHECK (id_user > 0),
    FOREIGN KEY (id_game) REFERENCES games (id_game),
    FOREIGN KEY (id_user) REFERENCES users (id_user),
    PRIMARY KEY (id_game, id_user)
);
