const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

function init() {
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
                'Update An Employee Role'
            ]
        }
    )
}

init();
