CREATE TABLE puppies (
  id serial PRIMARY KEY,
  name varchar(70) NOT NULL,
  breed varchar(70) NOT NULL,
  age int NOT NULL CHECK (age <= 0 AND age >= 25),
  sex varchar(20) NOT NULL
);