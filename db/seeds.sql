-- the purpose of this file is to fill the database with information

INSERT INTO department (name)
VALUES  
    ('Sales'),
    ('Engineering'),
    ('Legal'),
    ('Accounting');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Sales Lead', 100000, 1),
    ('Salesman', 75000, 1),
    ('Engineering Lead', 125000, 2),
    ('Engineer', 100000, 2),
    ('Legal Team Lead', 150000, 3),
    ('Lawyer', 130000, 3),
    ('Accounting Lead', 120000, 4),
    ('Accountant', 85000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Dakota', 'Ewing', 3, null),
    ('Elise', 'Erwin', 4, 1),
    ('Sammy', 'DeVito', 4, 1),
    ('Loel', 'Johnson', 4, 1),
    ('Ben', 'Coleman', 4, 1),
    ('John', 'Doe', 1, null),
    ('Jane', 'Doe', 2, 6),
    ('Don', 'Levenson', 2, 6),
    ('Jon', 'Bellion', 2, 6),
    ('Sandy', 'Cheeks', 2, 6),
    ('Patrick', 'Tentacles', 2, 6),
    ('Sherlock', 'Holmes', 5, null),
    ('Ralph', 'Wreck', 6, 13),
    ('Zach', 'Felix', 7, null),
    ('Leo', 'DiCaprio', 8, 15),
    ('Morgan', 'Freeman', 8, 15),
    ('Jack', 'Falcon', 8, 15);


