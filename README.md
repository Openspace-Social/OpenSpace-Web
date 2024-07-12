
# Openspace-web

Openspace is coming to the web.

## Table of contents

- [Requirements](#requirements)
- [Project overview](#project-overview)
- [Contributing](#contributing)
    + [Code of Conduct](#code-of-conduct)
    + [License](#license)
    + [Other issues](#other-issues)
    + [Git commit message conventions](#git-commit-message-conventions)
- [Getting started](#getting-started)

## Requirements

* [node](https://nodejs.org/en/) 18.18.2

*You must use node.js 18.18.2. Newer versions break on downloading node_modules*.

## Project overview

The project is a [Nuxt](https://nuxtjs.org/) application.
 
It's dependent on the [Openspace-API](https://github.com/Openspace-Social/OpenSpace-API) backend, be it whether you host your own or use the Openspace backend at https://api.openbook.social/

## Contributing

There are many different ways to contribute to the website development, just find the one that best fits with your skills and open an issue/pull request in the repository.

Examples of contributions we love include:

- **Code patches**
- **Bug reports**
- **Patch reviews**
- **Translations**
- **UI enhancements**

#### Code of Conduct

Please read and follow our [Code of Conduct].

#### License

Every contribution accepted is licensed under [MIT](https://opensource.org/licenses/MIT) or any later version.
You must be careful to not include any code that can not be licensed under this license.

Please read carefully [our license]and ask us if you have any questions.

#### Responsible disclosure

Cyber-hero? Check out our [Vulnerability Disclosure page].

#### Other issues

email admin@openspacelive.com for any issues

#### Git commit message conventions

Help us keep the repository history consistent 🙏!

We use [gitmoji](https://gitmoji.carloscuesta.me/) as our git message convention.

If you're using git in your command line, you can download the handy tool [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli).

## Getting started

### Clone the repository


### Install the dependencies

``` bash
$ npm install
```

### Configure the .env file

``` bash
$ copy .sample.env .dev.env
$ copy .sample.env .prod.env
$ nano .{dev|prod}.env
```

### Start the development server


``` bash
$ npm run dev
```

### Build for production

``` bash
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
