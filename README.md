# GitHub Issues  App

## Getting Started

 1. Clone the repository:
  
  - git clone `https://github.com/Mahesh062001/gitIssuesApi.git`
  
 2. Install dependencies:

  - npm install

 3. Start the application:

  - node src/app.js 

## Authentication

 - Endpoint: /auth/signup

  - Method: POST



 - Endpoint: /auth/login

  - Method: POST

 - JWT Strategy
  
  - Include the generated JWT in the Authorization header for protected routes.

## Routes
 
 - GitHub Sync

  - Endpoint: /sync
  
   - Method: POST

   - Description:fetch GitHub issues

 - Get Issue

  - Endpoint: /issues/:issue_id

   - Method: GET
 
   - Description: Get information for a specific issue

 - Update Issue

  - Endpoint: /issues/:issue_id

   - Method: PUT

   - Description: Update information for a specific issue