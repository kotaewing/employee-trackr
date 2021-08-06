-- checks if database exists already and deletes it if true
DROP DATABASE IF EXISTS employee_trackr_db;

-- creates the database
CREATE DATABASE employee_trackr_db;

-- sets mysql to use the newly created database
USE employee_trackr_db;