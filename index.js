//*** Set Up Requirements ***//
//Inquirer is used for question prompts
const inquirer = require("inquirer");
const generateMarkdown = require("./utils/generateMarkdown");

//If time to figure out: Axios to call github and pull the user"s profile picture and email
//const axios = require("axios");

//Dotenv is a DEV tool used to simulate environment variables that will eventually live on prod
//const dotenv = require("dotenv").config();

//FS for writing and saving the markdown file 
const fs = require("fs");

//Require generateMarkdown file
const generateMarkdown = require("./utils/generateMarkdown.js");

//Questions Array
const questions = () => {
    inquirer.prompt([
            {
                type: "input",
                name: "username",
                message: "Please enter your GitHub username."
            },
            {
                type: "input",
                name: "title",
                message: "What is the title of your project?"
            },
            {
                type: "input",
                name: "description",
                message: "Please enter a clear, concise description of your project."
            },
            {
                type: "input",
                name: "installation",
                message: "Please enter the steps required for installation. Separate items that should appear on new lines with a \\ symbol."
            },
            {
                type: "input",
                name: "usage",
                message: "Please explain how your project should be used. Separate items that should appear on new lines with a \\ symbol."
            },
            {
                type: "rawlist",
                name: "license",
                message: "What type of license would you like to apply to your project?",
                choices:[
                    "MIT: A short, permissive software license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source.",
                    "GNU GPLv3: You may copy, distribute and modify the software as long as you track changes/dates in source files. ",
                    "None"
                ]
            },
            {
                type: "input",
                name: "contributing",
                message: "How can users contribute to your project? Separate items that should appear on new lines with a \\ symbol."
            },
            {
                type: "confirm",
                name: "contributingBadge",
                message: "Would you like to add a \"Contributions Welcome\" badge to your README file?"
            },
            {
                type: "input",
                name: "tests",
                message: "Please list any tests that may be associated with your project. Separate items that should appear on separate lines with a \\ symbol."
            },
            {
                type: "confirm",
                name: "includePic",
                message: "Would you like to include your GitHub profile picture?"
            },
            {
                type: "input",
                name: "profilePic",
                message: "Please provide the URL for our GitHub profile picture.",
                when: function(answers){
                    return answers.includePic;
                }
            },
            {
                type: "confirm",
                name: "includeEmail",
                message: "Would you like to include your GitHub email?"
            },
            {
                type: "input",
                name: "email",
                message: "Please enter your GitHub email address.",
                when: function(answers){
                    return answers.includeEmail;
                }
            }
        ]).then(function(answers){
            //const legibleAnswers = JSON.stringify(answers);
            //console.log(`The answers are: ${legibleAnswers}`);

            //Use returned answers to generate the variables to be plugged into generateMarkdown.js
            //Declare variables that need to be modified:
            let selectedLicense = "";
            let contributeBadgeChoice = "";
            let picture = "";
            let addEmail = "";
            
            const selectedLicenseFunction = function(){
                const a = "MIT: A short, permissive software license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source.";
                const b = "GNU GPLv3: You may copy, distribute and modify the software as long as you track changes/dates in source files. ";
                if(answers.license == a){
                    selectedLicense = "[MIT](https://tldrlegal.com/license/mit-license)";
                    return selectedLicense;
                }else if(answers.license == b){
                    selectedLicense = "[GNU GPLv3](https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3))";
                    return selectedLicense;
                }else{
                    selectedLicense = `&copy;${answers.username} - Not not offering any license at this time.`;
                    return selectedLicense;
                }
            };
            selectedLicenseFunction(answers);

            console.log(`selectedLicense = ${selectedLicense}`)

            const contributeBadgeChoiceFunction = function(){
                if(answers.contributingBadge == true){
                    contributeBadgeChoice = "[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)";
                    return contributeBadgeChoice;
                }else{
                    contributeBadgeChoice = "";
                    return contributeBadgeChoice;
                }
            };
            contributeBadgeChoiceFunction(answers);

            console.log(`contributeBadgeChoice = ${contributeBadgeChoice}`)

            const pictureFunction = function(){
                if(answers.includePic == true){
                    picture = `<div align="center"><img src="${answers.profilePic}" align="right" alt="${answers.username} profile picture" width="120"></div>`
                    return picture;
                }else{
                    picture = "";
                    return picture;
                }
            };
            pictureFunction(answers);

            const addEmailFunction = function(){
                if(answers.includeEmail == true){
                    addEmail = `<div align="center">**Email:** ${answers.email}</div>`;
                    return addEmail;
                }else{
                    addEmail = "";
                    return addEmail;
                }
            };
            addEmailFunction(answers);

            const data = {
                username: answers.username,
                title: answers.title,
                description: answers.description,
                installation: answers.installation,
                usage: answers.usage,
                license: selectedLicense,
                contributing: answers.contributing,
                contributingBadge: contributeBadgeChoice,
                tests: answers.tests,
                profilePic: picture,
                email: addEmail
            };

            const legibleData = JSON.stringify(data);
            console.log(`Data = ${legibleData}`);
        });   
};


// function writeToFile(fileName, data) {

// }

function init() {

    questions();
    // generateMarkdown(data);
    // writeToFile();
    }  

init();
