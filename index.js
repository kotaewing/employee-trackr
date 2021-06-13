const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
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
        db.query(`SELECT role.id, role.title, role.salary, department.name AS "department name" 
                  FROM role 
                  INNER JOIN department 
                  ON role.department_id = department.id
                  `, (err, rows) => {
                        console.table(rows);
                        this.action();
        }) 
    }

    selectEmployees() {
        db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title
                  FROM employee
                  INNER JOIN role 
                  ON employee.role_id = role.id
                  `, (err, rows) => {
                      console.log(err)
                      console.table(rows);
                  })
    }

    exit() {
        process.exit();
    }
}


new Startup().actions();


