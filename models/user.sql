CREATE TABLE users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio VARCHAR(280),
    avatar VARCHAR(500),
    location VARCHAR(500),
    website VARCHAR(255),
    created_date TIMESTAMP DEFAULT Now(),
    date_of_birth DATE,
    email VARCHAR(150) NOT NULL, UNIQUE(email),
    is_admin boolean

);
CREATE TABLE following (
    user_id BIGINT NOT NULL, 
    following_id BIGINT NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES users (id),                                                                                                                                                     FOREIGN KEY (user_id) REFERENCES users (id),                                                                      FOREIGN KEY (following_id) REFERENCES users (id)                                                                                                                                                      following_id BIGINT NOT NULL,                                                                                FOREIGN KEY (user_id) REFERENCES users (id),                                                                      FOREIGN KEY (following_id) REFERENCES users (id)                                                                  
    FOREIGN KEY (following_id) REFERENCES users (id)                                                                  
);
CREATE TABLE follower (
    user_id BIGINT NOT NULL, 
    follower_id BIGINT NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES users (id),                                                                                                                                                     FOREIGN KEY (user_id) REFERENCES users (id),                                                                      FOREIGN KEY (following_id) REFERENCES users (id)                                                                                                                                                      following_id BIGINT NOT NULL,                                                                                FOREIGN KEY (user_id) REFERENCES users (id),                                                                      FOREIGN KEY (following_id) REFERENCES users (id)                                                                  
    FOREIGN KEY (follower_id) REFERENCES users (id)                                                                  
);