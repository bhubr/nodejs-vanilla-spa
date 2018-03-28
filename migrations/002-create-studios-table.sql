-- Up
CREATE TABLE studios (
  id INTEGER PRIMARY KEY,
  name VARCHAR(60),
  slug VARCHAR(60),
  address VARCHAR(255),
  city VARCHAR(60),
  latitude DOUBLE,
  longitude DOUBLE,
  description TEXT,
  image VARCHAR(255)
);

-- Down
DROP TABLE studios;