# Claim Stalker Web App

Claim Stalker is a simple web application designed to help users input and manage basic claim information. Built using HTML, CSS, and JavaScript, this app allows users to enter claim details such as Claim ID, Name, and Phone Number. The data is then processed and managed within the app, providing an organized way to keep track of claims.


### Git add and commit
```bash
Pull code into saved repo
git pull origin main

git add .
git commit -m "add .gitignore, readme, and requirements"
git push origin main
```

### This application is currently being hosted on Render
link: https://claimstalker-web.onrender.com/homepage 

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
- User Authentication: Add login and user-specific claim management. (Currently all users can access the entire database)
- Add different search options for view claims page. 
- Add submission dates for claim submission. 
- Connect Ivans API to provide additional functionality. 


## Active Functionality 
- Back-End Integration: Connect to a database to store claim details persistently.
- Submit a Claim: Insert all claim information and submit. This sends all information to the data base (PostgreSQL) and sends an email. 
- View Claims by searching with the policy number
