CREATE TABLE post (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    author_id BIGINT NOT NULL,
    text VARCHAR(280) NOT NULL,
    number_of_likes int DEFAULT 0,
    created_date TIMESTAMP DEFAULT Now()
);
CREATE TABLE likes (
    user_id BIGINT NOT NULL, 
    post_id BIGINT NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES users (id),                                                                                                                                                     FOREIGN KEY (user_id) REFERENCES users (id),                                                                      FOREIGN KEY (following_id) REFERENCES users (id)                                                                                                                                                      following_id BIGINT NOT NULL,                                                                                FOREIGN KEY (user_id) REFERENCES users (id),                                                                      FOREIGN KEY (following_id) REFERENCES users (id)                                                                  
    FOREIGN KEY (post_id) REFERENCES post (id)
);
CREATE TABLE images (
    image VARCHAR(500) NOT NULL, 
    post_id BIGINT NOT NULL, 
    FOREIGN KEY (post_id) REFERENCES post (id)
);