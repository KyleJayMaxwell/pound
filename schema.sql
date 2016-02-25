DROP DATABASE IF EXISTS pound;
CREATE DATABASE pound;

\connect pound;

CREATE TABLE puppies (
  id serial PRIMARY KEY,
  name varchar(70) NOT NULL,
  breed varchar(70) NOT NULL,
  age int NOT NULL CHECK (age >= 0 AND age <= 25),
  sex varchar(20) NOT NULL,
  alive boolean
);

INSERT INTO puppies (name, breed, age, sex, alive) VALUES ('Tyler', 'Shih-tzu', 3, 'F', false);