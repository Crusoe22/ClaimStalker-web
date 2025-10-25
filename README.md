# Claim Stalker Web App

Claim Stalker is a simple web application designed to help users input and manage basic claim information. Built using HTML, CSS, and JavaScript, this app allows users to enter claim details such as Claim ID, Name, and Phone Number. The data is then processed and managed within the app, providing an organized way to keep track of claims.


### 🌐 Live Deployment
The Claim Stalker application is currently hosted on **Render**.

**Access it here:** [www.claimstalker.com](https://www.claimstalker.com)


## How to run code locally
- install necessary packages/depenencies express, bcrypt, and any other packages listed in package.json: 
    npm install

- nodemon Not Installed: Install it globally with:
    npm install -g nodemon

1. Confirm you are in the correct location:
    cd \Users\nolan\OneDrive\Documents\Personal JS applications\ClaimStalker-webapp\ClaimStalker-web
2. Run in terminal:
    nodemon src/index.js


### Git add and commit
```bash
Pull code into saved repo
git pull origin main

git add .
git commit -m "add .gitignore, readme, and requirements"
git push origin main
```


## Table of Contents
- [Overview](#Overview)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Future Enhancements](#future-enhancements)
- [License](#license)

### Overview
- **Frontend:** Built with HTML, CSS, and EJS templates for rendering dynamic content.  
- **Backend:** Powered by Node.js and Express, with routes defined in `src/index.js`.  
- **Database:** PostgreSQL (schema defined in `database_creation/newtables.sql`).  
- **Email Service:** Outgoing email notifications handled by `send-email/sendemail.js`.  


## Features

- **Claim Data Input**: Users can enter Claim ID, Name, and Phone Number.
- **Simple and Organized Interface**: Clean design focused on ease of use.
- **Front-End Focus**: Pure HTML, CSS, and JavaScript currently without back-end data storage.


## Technologies

- **HTML** - For creating the structure of the web pages.
- **CSS** - For styling and responsive design.
- **JavaScript** - For handling user interactions and logic.
- **Postgres** - Used for data storage


## Getting Started

To run Claim Stalker locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/claim-stalker.git
   ```


## Future Enhancements
- User Authentication: Add login and user-specific claim management. (Currently all users can access the entire database)
- Add different search options for view claims page. 
- Add submission dates for claim submission. 
- Connect Ivans API to provide additional functionality. 


## Active Functionality 
- Back-End Integration: Connect to a database to store claim details persistently.
- Submit a Claim: Insert all claim information and submit. This sends all information to the data base (PostgreSQL) and sends an email. 
- View Claims by searching with the policy number


## Submit Claims Page

The **Submit Claims** page allows users to submit new insurance claims.  
When a claim is submitted, the information is:

- **Stored** in the PostgreSQL database table named `"Claims"`.  
- **Sent via email** notification (sent to email entered in text box).

### Database Fields

Below are the columns and data types received by the `"Claims"` table:

| Column Name        | Data Type                      | Description                                |
|--------------------|--------------------------------|--------------------------------------------|
| `id`               | integer                        | Primary key (auto-incremented)             |
| `claimDate`        | timestamp with time zone        | Date of the claim incident                 |
| `createdAt`        | timestamp with time zone        | Record creation timestamp (Sequelize)      |
| `updatedAt`        | timestamp with time zone        | Record update timestamp (Sequelize)        |
| `agency_id`        | integer                        | Foreign key reference to `Agencies` table  |
| `carrier_id`       | integer                        | Foreign key reference to `Carriers` table  |
| `description`      | character varying               | Description of the claim                   |
| `autoLoss`         | character varying               | Type of automobile loss                    |
| `propertyLoss`     | character varying               | Type of property loss                      |
| `location`         | character varying               | Location of the incident                   |
| `email`            | character varying               | Customer email address                     |
| `name`             | character varying               | Customer full name                         |
| `phone`            | character varying               | Customer phone number                      |
| `policyNumber`     | character varying               | Policy number associated with the claim     |
| `insuranceCompany` | character varying               | Insurance company name                     |

---



