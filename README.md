# Merchant Block Explorer

This project is a merchant block explorer application that allows users to manage and view their crypto payment transactions. It includes features such as transaction listing, refund processing, and a disclaimer modal.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- A Solana wallet with some SOL for testing purposes.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/merchant_block_explorer.git
   cd merchant_block_explorer

2. Navigate to the frontend directory:
   
    ```bash
    cd frontend/merchant_block_explorer

3. Install the dependencies:
   
   ```bash
   cd ../../backend/merchant_block_explorer

4. Navigate to the backend directory:
   
   ```bash
   cd ../../backend/merchant_block_explorer

5. Install the backend dependencies:
   
   ```bash
   npm install

## Running the Project

### Backend

1. Start the backend server:
   
   ```bash
   node server.js

    The backend server will run on 'http://localhost:3000'.

### Frontend

1. Navigate to the frontend directory

    ```bash
    cd ../../frontend/merchant_block_explorer

2. Start the frontend development server:
   
   ```bash
   npm run dev

   The frontend application will run on 'http://localhost:3000'

## Features
## Features

- **Transaction Listing**: View a list of crypto payment transactions.
- **Refund Processing**: Process refunds for completed transactions.
- **Disclaimer Modal**: A disclaimer modal that shows up at the launch of the application, informing users about the hardcoded public and private keys used for development purposes.

## Usage

1. Open your browser and navigate to \`http://localhost:3000\`.
2. You will see a disclaimer modal informing you about the hardcoded public and private keys used for development purposes.
3. Close the disclaimer modal to view the transaction list.
4. Use the \"Refund\" button to process refunds for completed transactions.

## Project Structure

- \`frontend/merchant_block_explorer\`: Contains the frontend code.
- \`backend/merchant_block_explorer\`: Contains the backend code.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.