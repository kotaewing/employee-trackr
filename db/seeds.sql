INSERT INTO department (id, name)
VALUES  
    (1, 'Sales'),
    (2, 'Engineering'),
    (3, 'Legal'),
    (4, 'Accounting');

INSERT INTO role (id, title, salary, department_id)
VALUES 
    (1, 'Sales Lead', 100000, 1),
    (2, 'Salesman', 75000, 1),
    (3, 'Engineering Lead', 125000, 2),
    (4, 'Engineer', 100000, 2),
    (5, 'Legal Team Lead', 150000, 3),
    (6, 'Lawyer', 130000, 3),
    (7, 'Accounting Lead', 120000, 4),
    (8, 'Accountant', 85000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Dakota', 'Ewing', 3, null),
    (2, 'Elise', 'Erwin', 4, 1),
    (3, 'Sammy', 'DeVito', 4, 1),
    (4, 'Loel', 'Johnson', 4, 1),
    (5, 'Ben', 'Coleman', 4, 1),
    (6, 'John', 'Doe', 1, null),
    (8, 'Jane', 'Doe', 2, 6),
    (9, 'Don', 'Levenson', 2, 6),
    (10, 'Jon', 'Bellion', 2, 6),
    (11, 'Sandy', 'Cheeks', 2, 6),
    (12, 'Patrick', 'Tentacles', 2, 6),
    (13, 'Sherlock', 'Holmes', 5, null),
    (14, 'Ralph', 'Wreck', 6, 13),
    (15, 'Zach', 'Felix', 7, null),
    (16, 'Leo', 'DiCaprio', 8, 15),
    (17, 'Morgan', 'Freeman', 8, 15),
    (18, 'Jack', 'Falcon', 8, 15);


