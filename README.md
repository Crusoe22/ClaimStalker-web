# Claim Stalker Web App

Claim Stalker is a simple web application designed to help users input and manage basic claim information. Built using HTML, CSS, and JavaScript, this app allows users to enter claim details such as Claim ID, Name, and Phone Number. The data is then processed and managed within the app, providing an organized way to keep track of claims.

### This application is currently being hosted on GitHub pages
link: https://crusoe22.github.io/ClaimStalker-web/ 

## How to run code locally
- install necessary packages/depenencies express, bcrypt, and any other packages listed in package.json: 
    npm install

- nodemon Not Installed: Install it globally with:
    npm install -g nodemon

1. Confirm you are in the correct location:
    cd \Users\nolan\OneDrive\Documents\Personal JS applications\ClaimStalker-webapp\ClaimStalker-web
2. Run in terminal:
    nodemon src/index.js


## Table of Contents
- [Project Structure](#project-structure)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Project Structure

The application is organized as follows:
- `index.html` - The main entry point for the application.
- `index.css` - Contains the styling for the app's user interface.
- `index.js` - Manages the app's interactivity and logic.
- `../views/` - Contains the HTML structure for other pages.
- `../pages-css/` - Contains the CSS styling for other pages.

### Folder Path
The project files are located in:



## Features

- **Claim Data Input**: Users can enter Claim ID, Name, and Phone Number.
- **Simple and Organized Interface**: Clean design focused on ease of use.
- **Front-End Focus**: Pure HTML, CSS, and JavaScript currently without back-end data storage.

## Technologies

- **HTML** - For creating the structure of the web pages.
- **CSS** - For styling and responsive design.
- **JavaScript** - For handling user interactions and logic.

## Getting Started

To run Claim Stalker locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/claim-stalker.git


## Usage
1. Open the application by launching index.html.
2. On the home page, enter the claim details in the input fields provided:
    - Policy No.
    - Name
    - Phone Number
    - etc...
3. Future functionalities may include submitting the claim details or saving them.


## Future Enhancements
- Back-End Integration: Connect to a database to store claim details persistently.
- User Authentication: Add login and user-specific claim management.
- Additional Data Fields: Enable users to enter more comprehensive claim details.
- Data Search: Include search and filter options for managing multiple claims.
- Mobile Compatibility: Ensure responsive design for better usability on mobile devices.

    ## Login and Sign Up
    - This code creates a database connection to MongoDB locally
    - In the sign up page it enter new user information
        - Passwords are hashed in database
    - Checks if user already created

    #### Check if page is working
    - Download all packages locally in package.json
        - use npm install bcrypt ejs express mongoose
    - This will open page locally 
        nodemon src/index.js