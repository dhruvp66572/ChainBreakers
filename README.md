# Real-Time Transaction Tracker

## Overview

The Real-Time Transaction Tracker is a dashboard that monitors live Hedera transactions and displays them using the Mirror Node API. This tool provides users with real-time insights into network activity, allowing them to filter transactions by account, token transfers, or contract interactions. Additionally, it integrates with the HashPack wallet to enable users to track their personal transactions.

## Features

- **Real-Time Data**: Fetches and displays real-time transaction data from Hedera’s Mirror Node.
- **Filtering**: Users can filter transactions by account, token transfers, or contract interactions.
- **Graphical Insights**: A user-friendly UI provides graphical insights into network activity.
- **Wallet Integration**: HashPack wallet integration allows users to track their personal transactions.

## Implementation Steps

## To implement the Real-Time Transaction Tracker, follow these steps:

### Step 1: Clone the Repository

Clone the Real-Time Transaction Tracker repository to your local machine by running the following command:

```bash
git clone 
```

### Step 2: Install Dependencies

Navigate to the project directory and install the required dependencies by running the following command:

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the project directory and add the following environment variables:

```bash
REACT_APP_MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com/api/v1
REACT_APP_HASHPACK_API_URL=https://api.hashpack.app
REACT_APP_HASHPACK_APP_ID=YOUR_HASHPACK_APP_ID
```

Replace `YOUR_HASHPACK_APP_ID` with your HashPack app ID.

### Step 4: Start the Application

Start the Real-Time Transaction Tracker application by running the following command:

```bash
npm start
```

The application will be hosted at `http://localhost:3000`.

### Step 5: Explore the Dashboard

Explore the Real-Time Transaction Tracker dashboard to view live Hedera transactions, filter transactions by account, token transfers, or contract interactions, and track your personal transactions using the HashPack wallet integration.


## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Axios**: A promise-based HTTP client for making API requests.
- **Chart.js**: A JavaScript charting library for creating interactive charts.
- **React Router**: A routing library for React applications.
- **React Bootstrap**: A front-end framework for building responsive web applications.
- **React Toastify**: A notification library for React applications.
- **React Icons**: A library of popular icons for React applications.
- **Dotenv**: A zero-dependency module that loads environment variables from a `.env` file.
- **Moment.js**: A JavaScript date library for parsing, validating, manipulating, and formatting dates.
- **HashPack API**: An API for integrating HashPack wallet functionality into applications.


## Conclusion

The Real-Time Transaction Tracker provides a comprehensive solution for monitoring live Hedera transactions. By following the implementation steps outlined above, you can build a robust dashboard that offers real-time insights and personalized tracking for users.

## License

This project is licensed under the MIT License.

