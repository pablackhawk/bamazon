DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products
(
  item_id INT NOT NULL
  AUTO_INCREMENT,
  product_name VARCHAR
  (45) NOT NULL,
  department VARCHAR
  (45),
  price DECIMAL
  (13,2) NOT NULL,
  stock_quantity DECIMAL,
  PRIMARY KEY
  (item_id)
);