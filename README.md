# FinTech - Group Saving Tracker Application

## Project Overview

FinTech is a comprehensive group saving tracker application that helps a group of people to collectively save together and get the equivalnce of their savings in other currency. By utilizing external APIs, the application provides visually appealing insights on everyone's contribution and allow the to set a goal and check their progress on the set goals. available at: www.larissa48.tech

The application is divided into two main parts:

**Local Implementation:** In the first part, the application is developed to run locally on the user's machine. This can be either a Command-Line Interface (CLI) application or a web application with a frontend built using HTML, CSS, and JavaScript.

**Deployment:** The second part focuses on deploying the application to make it accessible online. The application is deployed on two standard web servers, and a load balancer is configured to distribute incoming traffic between them, ensuring reliable and scalable performance.

## Key Features

**Total Group Savings Display:** Shows the cumulative amount saved by the group, with options to convert the total into various currencies such as USD, EUR, GBP, JPY, and CAD.​
**Goal Progress Visualization:** Illustrates the percentage of the savings goal achieved, providing a clear view of progress.​
**Group Members Management:** Allows sorting of members by name, amount saved, or date of last contribution. Users can add new members by entering their name, initial contribution, and email address.​
**Savings Analytics:** Offers visual representations of savings data through bar charts, pie charts, and line charts to analyze savings trends over time.​
**Set Group Savings Goal:** Enables the group to define a specific savings target to work towards collectively.​
**Contribution Tracking:** Records each member's total savings, last contribution date, and maintains a history of contributions. Members can add new contributions as needed.​

This tool provides a comprehensive platform for groups to collaboratively set, track, and achieve their financial savings objectives

## Technologies Used

**Programming Language:** JavaScript
**External APIs:** Currency Conversion API
**Charting Libraries:** Chart.js

## Getting Started

### Prerequisites

Node.js (version 12 or later)
API keys for the external APIs used in the application

### Installation and Setup

Clone the repository:
git clone https://github.com/your-username/finTech.git

### Install the necessary dependencies:

cd fintrack
npm install

Obtain the required API keys and securely store them in your environment.
Run the application locally:

npm start

### Deployment

Build a Docker image for the application:

docker build -t finTech .
Deploy the application on the two web servers (Web01 and Web02) .
Configure the load balancer (Lb01) to distribute incoming traffic between the two web servers.
Verify that the application is accessible and functioning correctly through the load balancer's address.

## Demo Video

https://www.loom.com/share/1a1a585032994b9295b34b618308c039

## Challenges and Lessons Learned

During the development and deployment of the FinTrack application, we encountered several challenges, including:

Integrating multiple external APIs and handling various data formats.
Ensuring the security and privacy of user data, particularly in managing API keys and other sensitive information.
Optimizing the application's performance and scalability, especially when handling increased traffic through the load balancer.
Through these challenges, we learned the importance of thorough planning, research, and testing to create a robust and reliable financial management application. We also gained valuable experience in deploying and managing applications in a distributed web server environment.

## API Credits
This application utilizes the following external APIs:

**Currency Conversion API:** [ https://api.exchangerate-api.com/v4/latest/USD]
