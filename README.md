# Parade State Management System

A web application to automate the process of managing and reporting parade states for different branches.

## Features

- Select your branch from a dropdown menu
- Add personnel with their respective status (Present, BRW, RSO/MC, OFF, Leave)
- Remove personnel from status groups
- Generate and copy formatted parade state reports to clipboard
- Modern, user-friendly interface

## Setup Instructions

1. Install dependencies:
   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

2. Start the development servers:
   ```bash
   # Start both server and client
   npm run dev:full
   ```

   Or run them separately:
   ```bash
   # Start server only
   npm run dev

   # Start client only (in a separate terminal)
   npm run client
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select your branch from the dropdown menu
2. Add personnel by entering their name and selecting their status
3. Click "Add Person" to add them to the list
4. Remove personnel by clicking the 'X' on their chip
5. Click "Copy Report to Clipboard" to generate and copy the formatted report
6. Paste the report into your WhatsApp group chat

## Status Types

- PRESENT: Personnel who are present
- BRW: Personnel on BRW
- RSO/MC: Personnel on RSO or MC duty
- OFF: Personnel who are off
- LEAVE: Personnel on leave

## Technologies Used

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Database: MongoDB (for future implementation)