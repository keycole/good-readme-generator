//*** Set Up Requirements ***//
//Inquirer is used for question prompts
const inquirer = require('inquirer');

//If time to figure out: Axios to call github and pull the user's profile picture and email
//const axios = require('axios');

//Dotenv is a DEV tool used to simulate environment variables that will eventually live on prod
//const dotenv = require('dotenv').config();

//FS for writing and saving the markdown file 
const fs = require('fs');

//Require generateMarkdown file
const generateMarkdown = require('./utils/generateMarkdown.js');

//Questions Array
const questions = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: 'Please enter your GitHub username.'
        },
        {
            type: 'input',
            name: 'givenName',
            message: 'Please enter your full name.'
        },
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of your project?'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Please enter a clear, concise description of your project.'
        },
        {
            type: 'input',
            name: 'installation',
            message: 'Please enter the steps required for installation. Separate items that should appear on new lines with a | symbol.'
        },
        {
            type: 'input',
            name: 'usage',
            message: 'Please explain how your project should be used. Separate items that should appear on new lines with a | symbol.'
        },
        {
            type: 'rawlist',
            name: 'license',
            message: 'What type of license would you like to apply to your project?',
            choices: [
                'MIT: A short, permissive software license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source.',
                'GNU GPLv3: You may copy, distribute and modify the software as long as you track changes/dates in source files. ',
                'None'
            ]
        },
        {
            type: 'input',
            name: 'contributing',
            message: 'How can users contribute to your project? Separate items that should appear on new lines with a | symbol.'
        },
        {
            type: 'checkbox',
            name: 'badges',
            message: 'Please select all badges that you would like to add to your README file?',
            choices: [
                'Contributions Welcome',
                'Ask Me Anything (To include, you must provide your email address when prompted later on.)'
            ]
        },
        {
            type: 'input',
            name: 'tests',
            message: 'Please list any tests that may be associated with your project. Separate items that should appear on separate lines with a | symbol.'
        },
        {
            type: 'confirm',
            name: 'includePic',
            message: 'Would you like to include your GitHub profile picture?'
        },
        {
            type: 'input',
            name: 'profilePic',
            message: 'Please provide the URL for our GitHub profile picture.',
            when: function (answers) {
                return answers.includePic;
            }
        },
        {
            type: 'confirm',
            name: 'includeEmail',
            message: 'Would you like to include your GitHub email?'
        },
        {
            type: 'input',
            name: 'email',
            message: 'Please enter your GitHub email address.',
            when: function (answers) {
                return answers.includeEmail;
            }
        }
    ]).then(function (answers) {
        //Use returned answers to generate the variables to be plugged into generateMarkdown.js
        //Declare variables that need to be modified:
        let refactoredInstallation = answers.installation.split('|').join('<br>');
        let refactoredUsage = answers.usage.split('|').join('<br>');
        let refactoredContributing = answers.contributing.split('|').join('<br>');
        let refactoredTests = answers.tests.split('|').join('<br>');
        let selectedLicense = '';
        let contributeBadgeChoice = '';
        let profileInfo = '';

        const selectedLicenseFunction = function () {
            const a = 'MIT: A short, permissive software license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source.';
            const b = 'GNU GPLv3: You may copy, distribute and modify the software as long as you track changes/dates in source files. ';
            if (answers.license == a) {
                selectedLicense = '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)';
                return selectedLicense;
            } else if (answers.license == b) {
                selectedLicense = '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)';
                return selectedLicense;
            } else {
                selectedLicense = `&copy; &nbsp; ${answers.username} - Not offering any license at this time.`;
                return selectedLicense;
            }
        };
        selectedLicenseFunction(answers);

        const contributeBadgeChoiceFunction = function () {
            let array = answers.badges;
            let a = 'Contributions Welcome';
            let b = 'Ask Me Anything (To include, you must provide your email address when prompted later on.)';

            if (array.includes(a) && array.includes(b)) {
                contributeBadgeChoice = `[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-green.svg)](https://shields.io/)&nbsp;&nbsp;&nbsp;[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](mailto:${answers.email})`;
                return contributeBadgeChoice;
            } else if (array.includes(a)) {
                contributeBadgeChoice = '[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-green.svg)](https://shields.io/)';
                return contributeBadgeChoice;
            } else if (array.includes(b)) {
                contributeBadgeChoice = `![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](mailto:${answers.email})`;
                return contributeBadgeChoice;
            } else {
                contributeBadgeChoice = '';
                return contributeBadgeChoice;
            }
        };
        contributeBadgeChoiceFunction(answers);

        const profileInfoFunction = function () {
            if (answers.includePic == true && answers.includeEmail == true) {
                profileInfo = `<div><img src='${answers.profilePic}' alt='${answers.username} profile picture' width='120'><div><p><b>Repo Owner:</b> ${answers.givenName}</p></div><div><p><b>Email:</b> ${answers.email}</p></div></div>`
                return profileInfo;
            } else if (answers.includePic == true) {
                profileInfo = `<div><img src='${answers.profilePic}' alt='${answers.username} profile picture' width='120'><div><p><b>Repo Owner:</b> ${answers.givenName}</p></div></div>`;
                return profileInfo;
            } else if (answers.includeEmail == true) {
                profileInfo = `<div style='align:center'><div><b>Repo Owner:</b> ${answers.givenName}</div><div><p><b>Email:</b> ${answers.email}</p></div></div>`
            } else {
                return profileInfo;
            }
        };
        profileInfoFunction(answers);

        const data = {
            username: answers.username,
            name: answers.givenName,
            title: answers.title,
            description: answers.description,
            installation: refactoredInstallation,
            usage: refactoredUsage,
            license: selectedLicense,
            contributing: refactoredContributing,
            contributingBadge: contributeBadgeChoice,
            tests: refactoredTests,
            profile: profileInfo
        };

        //Call generateMarkdown function
        generateMarkdown(data);

        //Construct writeToFile function
        const writeToFile = (yourReadme) => {
            yourReadme = generateMarkdown(data);
            fs.writeFile('README.md', yourReadme, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
        };

        //Invoke writeToFile function
        writeToFile();

    });
};


function init() {

    //Invoke inquirer questions
    questions();

};

init();
