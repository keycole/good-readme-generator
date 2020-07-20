const inquirer = require('inquirer');
const axios = require('axios');
const fs = require('fs');
const generateMarkdown = require('./generateReadme.js');
//Make the answers returned from the inquirer prompt available outside the functions
let returnedAnswers = {};
//Set up processedAnswers so that they are available outside the functions
let processedAnswers = {
    selectedBadges: '',
    userPic: '',
    githubName: '',
    userTitle: '',
    userDescription: '',
    userInstallation: '',
    userUsage: '',
    selectedLicense: '',
    userContributing: '',
    userTests: '',
    userQuestions: '',
    email: '',
    profileInfo: ''
};
//The questions array for the inquirer prompt
const readmeQuestions = [
    {
        type: 'input',
        name: 'username',
        message: 'What is your GitHub username?'
    },
    {
        type: 'input',
        name: 'title',
        message: 'What is the title of your project?'
    },
    {
        type: 'input',
        name: 'description',
        message: 'Please enter a clear, concise description of your project. Separate items that should appear on new lines with a | symbol.'
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
        type: 'input',
        name: 'questions',
        message: 'Please specify how users can contact you with questions. Separate items that should appear on separate lines with a | symbol.'
    },
    {
        type: 'confirm',
        name: 'includePic',
        message: 'Would you like to include your GitHub profile picture?'
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
];
////////////** Functions to be used within the processAnswers function **////////////
//Selected license markdown creation invoked by processReadmeAnswers function
const selectedLicenseFunction = returnedAnswers => {
    const a = 'MIT: A short, permissive software license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source.';
    const b = 'GNU GPLv3: You may copy, distribute and modify the software as long as you track changes/dates in source files. ';
    if (returnedAnswers.license == a) {
        processedAnswers.selectedLicense = '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)';
        return processedAnswers.selectedLicense;
    } else if (returnedAnswers.license == b) {
        processedAnswers.selectedLicense = '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)';
        return processedAnswers.selectedLicense;
    } else {
        processedAnswers.selectedLicense = `&copy; &nbsp; ${processedAnswers.githubName} - Not offering any license at this time.`;
        return processedAnswers.selectedLicense;
    }
};
//Selected badges invoked by processReadmeAnswers function
const badgeChoiceFunction = returnedAnswers => {
    let array = returnedAnswers.badges;
    let a = 'Contributions Welcome';
    let b = 'Ask Me Anything (To include, you must provide your email address when prompted later on.)';
    if (array.includes(a) && array.includes(b)) {
        processedAnswers.selectedBadges = `[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-green.svg)](https://github.com/keycole)&nbsp;&nbsp;&nbsp;[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](mailto:${processedAnswers.email})`;
        return processedAnswers.selectedBadges;
    } else if (array.includes(a)) {
        processedAnswers.selectedBadges = '[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-green.svg)](https://github.com/keycole)';
        return processedAnswers.selectedBadges;
    } else if (array.includes(b)) {
        processedAnswers.selectedBadges = `![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](mailto:${answers.email})`;
        return processedAnswers.selectedBadges;
    } else {
        processedAnswers.selectedBadges = '';
        return processedAnswers.selectedBadges;
    }
};
//Selected profile information invoked by processReadmeAnswers function
const profileInfoFunction = returnedAnswers => {
    if (returnedAnswers.includePic == true && returnedAnswers.includeEmail == true) {
        processedAnswers.profileInfo = `<div><img src='${processedAnswers.userPic}' alt='${processedAnswers.githubName} profile picture' width='120'><div><p><b>Repo Owner:</b> ${processedAnswers.githubName}</p></div><div><p><b>Email:</b> ${processedAnswers.email}</p></div></div>`
        return processedAnswers.profileInfo;
    } else if (returnedAnswers.includePic == true) {
        processedAnswers.profileInfo = `<div><img src='${processedAnswers.userPic}' alt='${processedAnswers.githubName} profile picture' width='120'><div><p><b>Repo Owner:</b> ${processedAnswers.githubName}</p></div></div>`;
        return processedAnswers.profileInfo;
    } else if (returnedAnswers.includeEmail == true) {
        processedAnswers.profileInfo = `<div style='align:center'><div><b>Repo Owner:</b> ${processedAnswers.githubName}</div><div><p><b>Email:</b> ${processedAnswers.email}</p></div></div>`
    } else {
        return processedAnswers.profileInfo;
    }
};
////////////** Inquirer and Axios Functions **////////////
//Initial inquirer questions that will be used for axios call
const userQuestions = () => {
    inquirer.prompt(
        readmeQuestions
    ).then(answers => {
        returnedAnswers = answers;
        userURL = `https://api.github.com/users/${returnedAnswers.username}`;
        axiosCallUser(userURL);
        return returnedAnswers, userURL;
    }).catch(err => {
        if (err) {
            throw err;
        }
    });
};

//Axios call to retrieve the user's GitHub user image and name - called by inquirer response function
const axiosCallUser = () => {
    axios.get(userURL)
        .then(response => {
            //Establish all values for the processedAnswers object using inquirer and axios returned data:
            processedAnswers.userTitle = returnedAnswers.title;
            processedAnswers.userDescription = returnedAnswers.description.split('|').join('<br>');
            processedAnswers.userInstallation = returnedAnswers.installation.split('|').join('<br>');
            processedAnswers.userUsage = returnedAnswers.usage.split('|').join('<br>');
            processedAnswers.userContributing = returnedAnswers.contributing.split('|').join('<br>');
            processedAnswers.userTests = returnedAnswers.tests.split('|').join('<br>');
            processedAnswers.userQuestions = returnedAnswers.questions.split('|').join('<br>');
            processedAnswers.email = returnedAnswers.email;
            processedAnswers.includePic = returnedAnswers.includePic;
            processedAnswers.userPic = response.data.avatar_url;
            processedAnswers.githubName = response.data.name;
            processedAnswers.selectedLicense = selectedLicenseFunction(returnedAnswers);
            processedAnswers.selectedBadges = badgeChoiceFunction(returnedAnswers);
            processedAnswers.profileInfo = profileInfoFunction(returnedAnswers);
            return processedAnswers.userPic, processedAnswers.githubName, processedAnswers.selectedLicense, processedAnswers.selectedBadges, processedAnswers.profileInfo, processedAnswers.userTitle, processedAnswers.userDescription, processedAnswers.userInstallation, processedAnswers.userUsage, processedAnswers.userContributing, processedAnswers.userTests;
        }).then(() => {
            //Used the processed answers to generate the README file.
            const fileToSave = generateMarkdown(processedAnswers);
            generateMarkdown(processedAnswers);
            return fileToSave;
        }).then(fileToSave => {
            fs.writeFile('README.md', fileToSave, function (err) {
                if (err) {
                    return console.log(err);
                } else {
                    console.log('Success! Your README file has been generated.');
                }
            });
        })
};

module.exports = userQuestions;