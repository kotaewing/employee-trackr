const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const { text } = require('express');
require('dotenv').config()

// Connect to database
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    },
    console.log('Connected to the Employee Trackr database.')
);

class Startup {
    constructor() {}

    actions() {
        console.log('Welcome to Employee Trakr')
        inquirer.prompt(
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments', 
                    'View All Roles',
                    'View All Employees',
                    'Add A Department',
                    'Add A Role',
                    'Add An Employee',
                    'Update An Employee Role',
                    'Exit Application'
                ]
            }
        )
        .then((answer) => {
            if (answer.action === 'View All Departments') {
                this.selectDepartments();
            }
            if (answer.action === 'View All Roles') {
                this.selectRoles();
            }
            if (answer.action === 'View All Employees') {
                this.selectEmployees();
            }
            if (answer.action === 'Add A Department') {
                inquirer.prompt(
                    {
                        type: 'input',
                        name: 'department',
                        message: "What is the new department's name?"
                    }
                )
                .then(answer => {
                    this.addDepartment(answer.department);
                })
            }
            


            if (answer.action === 'Exit Application') {
                this.exit();
            }
        })
    }

    selectDepartments() {
        db.query(`SELECT * FROM department`, (err, rows) => {
            console.table(rows);
            this.actions();
        })
    }

    selectRoles() {
        db.query(`SELECT role.id, role.title, role.salary, department.name AS department
                  FROM role 
                  INNER JOIN department 
                  ON role.department_id = department.id
                  `, (err, rows) => {
                        console.table(rows);
                        this.actions();
        }) 
    }

    selectEmployees() {
        db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, CONCAT(manager.first_name, '', manager.last_name) AS manager
                  FROM employee
                  LEFT JOIN employee manager 
                  ON manager.id = employee.manager_id
                  LEFT JOIN role
                  ON employee.role_id = role.id
                  LEFT JOIN department
                  ON department.id = role.department_id
                  `, (err, rows) => {
                      console.table(rows);
                      this.actions();
                  })
    }

    addDepartment(department) {
        db.query(`INSERT INTO department (name)
                  VALUES (?)
        `, [department]);
        this.actions();
    }

    exit() {
        console.log('Goodbye')
        process.exit();
    }
}


new Startup().actions();


