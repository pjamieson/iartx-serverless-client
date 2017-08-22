# iartx-serverless-client

A React web client (with React 15.6.1, React Router 4.1.2, and Redux 3.7.2) for a serverless Online Art Gallery application leveraging 8 AWS Services: S3, Cognito, API Gateway, Lambda, DynamoDB, Certificate Manager, CloudFront, and Route53. (This is a work-in-progress that will replace the currently-deployed Angular-based site at http://iartx.com.)

## Setting up the project

This project was seeded with [Create React App](https://github.com/facebookincubator/create-react-app). That provided a basic React application skeleton, including Babel to transpile ES2015 JavaScript to ES5 and Webpack pre-configured to manage both development and production builds. Also available in this seed project are a number of packages that the Facebook Team has found useful. I'm not sure how I ever lived without [Autoprefixer](https://github.com/postcss/autoprefixer). It allows me to write my CSS rules without worrying about vendor prefixes, then--when Webpack builds the project--the appropriate vendor prefixes are automatically inserted into the minified CSS. Very cool!

I added the [redux](https://github.com/reactjs/redux) and [react-redux](https://github.com/reactjs/react-redux) packages to the project for enhanced application state management, and I added [react-router-dom](https://github.com/ReactTraining/react-router/tree/master/packages/react-router-dom) for route handling.

With an eye toward using Bootstrap in this project, and following the Create React App documentation for extending the initial seed, I installed [node-sass](https://github.com/sass/node-sass) and [npm-run-all](https://github.com/mysticatea/npm-run-all), then added scripts to the package.json file to watch and build the SCSS files. [Bootstrap 3.3.7](https://getbootstrap.com/docs/3.3/) and [react-bootstrap](https://react-bootstrap.github.io/) were then also added to the project.

TODO: Upgrade to Bootstrap 4, when released (in first beta in Aug 2017)


## Using Amazon Cognoto for Signup, Login, and Permissions Management

The initial code for this project followed the excellent [Serverless Stack Tutorial](https://github.com/AnomalyInnovations/serverless-stack-com) by AnomalyInnovations. Among other things, that tutorial demonstrates how to leverage the Amazon Cognito service as a backend for user signup, signup confirmation, login, and logout. Following full implementation of the tutorial code, the following modifications/extensions were made:

1. Added Redux for state management, moving auth-related state and methods from the `App`, `Signup`, and `Login` components into new `reducers/AuthReducer.js` and `actions/AuthActions.js` files

2. Extracted the `NavBar` from the `App` component, making is a separate component

3. Merged the largely-redundant `Signup` and `Login` components into a single one named `AuthForm`

4. Enhanced user confirmation functionality, showing the confirmation form following a login by an unconfirmed user, in addition to showing it immediately following a new signup.

TODO: Add Forgot Password and Login with Facebook functionality.


Additional details coming soon....
