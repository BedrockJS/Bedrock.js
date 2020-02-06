# Bedrock.js Contribution Guidelines

Hello, we're glad to see you're considering contributing to the project! To ensure that work on Bedrock.js goes as smoothly as possible, we have some guidelines which all external contributors are required to follow. These are a set of basic rules which attempt to ensure that everyone is on the same page. 

## Pull Request Steps
The follow steps should be followed (in order) when creating a pull request:
1. Fork the repo to your account
2. Clone your forked repo to your device (ignore this step if you plan to make changes directly on GitHub)
3. Open the project (`cd Bedrock.js`) and install dependencies (`yarn` or `npm i`, see below)
4. Make the neccessary changes to the codebase
5. `commit` and `push` your changes to your repo (again, ignore if you're making changes on GitHub)
6. Create a pull request from your repo into the [Bedrock.js repo](https://github.com/BedrockJS/Bedrock.js)

After following these steps correctly, your pull request will be reviewed and, if all goes according to plan, merged into `master`.

## Packages
All external packages for this project are loaded from [NPM](https://npmjs.com). While it is not a requirement, we strongly recommend using `yarn` to install packages rather than the default `npm`.
The reason for this is simple; `yarn` is not only quite a lot faster than `npm` most of the time (thanks to lot's of caching), but it is just generally nicer to use.

## Rules for Code contributions
1. Your pull request must follow api design of Bedrock.js (or be similar to it), any design copy or "port" of another software to Bedrock.js will not be accepted.
2. The code must be yours, if it isn't, you **must** include the original source.
3. The code you're contributing must follow the following [format](#syntax):
 - 4 line **tab** spacing.
 - Single qoute enclosed strings.
 - Reasonable naming conventions.
 - CamelCase variable conventions.

### Syntax
Below is an example on how to properly format your PR if it is a code contribution
```ts

class MyClass {
    private plugins: Array<Plugin>;
    private logger: Logger;

    constructor () {
        this.logger = new Logger('MyClass');
        this.logger.info('Plugins coming soon!');
    }
}

export default MyClass;
```