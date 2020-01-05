# Bedrock.js Contribution Guidelines

Hello, we're glad to see you're considering contributing to the project! To ensure that work on Bedrock.js goes as smoothly as possible, we have some guidelines which all external contributors are required to follow. These are a set of basic rules which attempt to ensure that everyone is on the same page. 

## Pull Request Steps
The follow steps should be followed (in order) when creating a pull request:
1. Fork the repo to your account
2. Clone your forked repo to your device (ignore this step if you plan to make changes directly on GitHub)
3. Open the project (`cd Bedrock.js`) and install dependencies (`yarn` or `npm i`, see below)
4. Make the neccessary changes to the codebase
5. `commit` and `push` your changes to your repo (again, ignore if you're making changes on GitHub)
6. Create a pull request from your repo into the [official Bedrock.js repo](https://github.com/BradW/Bedrock.js)

After following these steps correctly, your pull request will be reviewed and, if all goes according to plan, merged into `master`.

## Packages
All external packages for this project are loaded from [NPM](https://npmjs.com). While it is not a requirement, we strongly recommend using `yarn` to install packages rather than the default `npm`.
The reason for this is simple; `yarn` is not only quite a lot faster than `npm` most of the time (thanks to lot's of caching), but it is just generally nicer to use.
