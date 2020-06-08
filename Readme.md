# Readme


## Introduction
This automated testing created via [Robot Framework](https://robotframework.org/) which is a generic open source automation framework. The core of framework implemented using [Python](https://www.python.org/) and also runs on [Jython (JVM)](http://jython.org/) and [IronPython (.NET)](http://ironpython.net/).


## Getting start

### Installation instruction

#### Robot Framework
Before installing Robot framework, please install [pip](https://pypi.org/project/pip/) and [python](https://www.python.org/)


<p>If you are familiar with Python and pip, just run the command below. </p>

`pip install robotframework`

<p>Notice that external libraries and tools need to be installed separately
</p>

<p>In our automated test, we use Selenium Library for create an E2E testing. which can be install using the following command.</p>

`pip install robotframework-seleniumlibrary`

After installing the library, we need to install the specific **browser driver** that we use in tests. The general approach to install a browser driver is downloading a right driver, such as chromedriver for Chrome.

In this test, we use Google Chrome for testing, which can be downloaded from [Chromedriver](http://chromedriver.chromium.org/downloads)
<p> Alternatively, you can use a tool called WebdriverManager which can find the latest version or when required, any version of appropriate webdrivers for you and then download and link/copy it into right location. Tool can run on all major operating systems and supports downloading of Chrome, Firefox, Opera & Edge webdrivers.</p>

For example:

```
pip install webdrivermanager
webdrivermanager firefox chrome --linkpath /usr/local/bin
 ```
 For safari driver (safari 10 or more), safari driver is inside /usr/bin/safaridriver.
 To permit this, Navigate to /usr/bin/ and run `safaridriver –-enable`
And to make sure the Develop menu available. Choose Safari > Preferences, and on the Advanced tab, select “Show Develop menu in menu bar.”
then **Choose Develop > Allow Remote Automation.**

<p>To run this test, please go to the project directory (test.robot directory) and run this command.</p>

`robot test.robot`


#### Jest

[Jest](https://jestjs.io/) is a JavaScript Testing Framework we use in this project for unit testing. It can be installed using [yarn](https://classic.yarnpkg.com/en/package/jest) <br>
`yarn add --dev jest`
<br>
or [npm](https://www.npmjs.com/) <br>
`npm install --save-dev jest`

To run this test please go to project directory use the following command.

`npm test`
