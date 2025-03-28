# FinTrack - Group Savings Tracker Application 

# # Project Overview

FinTrack is a comprehensive group saving management application that helps users keep track of their group savinga and major how far they are with their targeted saving goal according to the set date. By utilizing external APIs, the application provides the percentage at they are on their savings and provides the equivalance in other currencies moreover it comes visualization abilities showing how much everyone is contributing to the targeted goal. available at:https://www.larissa48.tech/

The application is divided into two main parts:

**Local Implementation:** In the first part, the application is developed to run locally on the user's machine. This can be either a Command-Line Interface (CLI) application or a web application with a frontend built using HTML, CSS, and JavaScript.

**Deployment:** The second part focuses on deploying the application to make it accessible online. The application is deployed on two standard web servers, and a load balancer is configured to distribute incoming traffic between them, ensuring reliable and scalable performance.

# # Key Features

**Total Group Savings Display:** Shows the cumulative amount saved by the group.​
**Goal Progress Visualization:** Illustrates the percentage of the savings goal achieved.​
**Group Members Management:** Allows adding members with details like name, initial contribution, and email.​
**Savings Analytics:** Provides visual representations of savings data through bar charts, pie charts, and line charts over time.​
**Savings Goal Setting:** Enables the establishment of a target savings amount for the group.​
**Contribution Tracking:** Records each member's total saved amount, last contribution date, and maintains a history of contributions.​

These features collectively facilitate effective tracking and management of group savings efforts.

Technologies Used

**Programming Language:** JavaScript
**External APIs:** Currency Conversion API

Getting Started

Prerequisites

Node.js (version 12 or later)
API keys for the external APIs used in the application

## Installation and Setup

Clone the repository:
git clone https://github.com/your-username/fintech.git

Install the necessary dependencies:

cd FinTech
npm install

Obtain the required API keys and securely store them in your environment.
Run the application locally:

npm start


## Deployment

Build a Docker image for the application:

docker build -t fintech.

Deploy the application on the two web servers (Web01 and Web02) .
Configure the load balancer (Lb01) to distribute incoming traffic between the two web servers.
Verify that the application is accessible and functioning correctly through the load balancer's address.

## Demo Video



## Challenges and Lessons Learned

During the development and deployment of the FinTrack application, we encountered several challenges, including:

Integrating multiple external APIs and handling various data formats.
Ensuring the security and privacy of user data, particularly in managing API keys and other sensitive information.
Optimizing the application's performance and scalability, especially when handling increased traffic through the load balancer.

Through these challenges, we learned the importance of thorough planning, research, and testing to create a robust and reliable financial management application. We also gained valuable experience in deploying and managing applications in a distributed web server environment.

## API Credits

This application utilizes the following external APIs:

Exchange Rates API: [https://api.exchangerate-api.com/v4/latest/USD]

