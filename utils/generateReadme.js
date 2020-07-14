const generateMarkdown = processedAnswers => {
    return `
${processedAnswers.selectedBadges}

# ${processedAnswers.userTitle}

## Description
${processedAnswers.userDescription}

#### Table of Contents

[Installation](#installation)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Usage](#usage)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[License](#license)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Contributing](#contributing)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Tests](#tests)

---

## Installation
${processedAnswers.userInstallation}


## Usage
${processedAnswers.userUsage}


## License
${processedAnswers.selectedLicense}


## Contributing
${processedAnswers.userContributing}

## Tests
${processedAnswers.userTests}


## Here's Who Made This
${processedAnswers.profileInfo}
`;
}

module.exports = generateMarkdown;