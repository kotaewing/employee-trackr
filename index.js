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


async function actions() {
    console.log('Welcome to Employee Trakr')
    const { actionList } = await inquirer.prompt(
        {
            type: 'list',
            name: 'actionList',
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
    );

    switch (actionList) {
        case 'View All Departments':
            selectDepartments();
            break;
        case 'View All Roles':
            selectRoles();
            break;
        case 'View All Employees':
            selectEmployees();
            break;
        case 'Add A Department':
            addDepartment();
            break;
        case 'Add A Role':
            addRole();
            break;
        case 'Add An Employee':
            addEmployee();
            break;
        case 'Update An Employee Role':
            updateEmployee();
            break;
        case 'Exit Application':
            exit();
            break;
    }
}

async function selectDepartments() {
    const departments = await db.promise().query(`SELECT * FROM department`)
    console.table(departments[0]);
    actions();
}

async function selectRoles() {
    const roles = await db.promise().query(`SELECT role.id, role.title, role.salary, department.name AS department
                  FROM role 
                  INNER JOIN department 
                  ON role.department_id = department.id
                  `)

    console.table(roles[0]);
    actions();
}

async function selectEmployees() {
    const employees = await db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary, CONCAT(manager.first_name, '', manager.last_name) AS manager
                  FROM employee
                  LEFT JOIN employee manager 
                  ON manager.id = employee.manager_id
                  LEFT JOIN role
                  ON employee.role_id = role.id
                  LEFT JOIN department
                  ON department.id = role.department_id
                  `)
    console.table(employees[0]);
    actions();
}

async function addDepartment(department) {
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
        .catch(err => {
            console.log(err)
        })
    db.query(`INSERT INTO department (name)
                  VALUES (?)
        `, [department]);
    this.actions();
}

async function addRole(role) {
    const departments = db.query(`SELECT name FROM department`)
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: "What is the new role's title?"
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the new role's salary?"
        },
        {
            type: 'list',
            name: 'department',
            message: "What is the new role's department?",
            choices: departments
        }
    ])
    const departId = db.query(`SELECT id FROM department WHERE name = ?`, [role.department]);
    db.query(`INSERT INTO role (title, salary, department_id)
                  VALUES (?,?,?)
        `, [role.title, role.salary, departId]);
    this.actions();
}

async function addEmployee(employee) {

}

function exit() {
    console.log('Goodbye')
    process.exit();
}

actions();


