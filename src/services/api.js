// API configuration and service functions for communicating with the backend

const API_BASE_URL = 'http://localhost:5000'; // Adjust this if your backend runs on a different port

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// User API functions
export const userApi = {
    // Get all users
    getUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/user/`);
        return handleResponse(response);
    },

    // Get specific user
    getUser: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        return handleResponse(response);
    },

    // Get user transactions
    getUserTransactions: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/user/${userId}/transactions`);
        return handleResponse(response);
    },

    // Get user holdings
    getUserHoldings: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/user/${userId}/holdings`);
        return handleResponse(response);
    },

    // Deposit money to user account
    depositBalance: async (userId, amount) => {
        const response = await fetch(`${API_BASE_URL}/user/${userId}/deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ammount: amount }), // Note: backend expects "ammount" (typo in backend)
        });
        return handleResponse(response);
    },
};

// Transaction API functions
export const transactionApi = {
    // Get all transactions
    getAllTransactions: async () => {
        const response = await fetch(`${API_BASE_URL}/transaction/`);
        return handleResponse(response);
    },

    // Get specific transaction
    getTransaction: async (transactionId) => {
        const response = await fetch(`${API_BASE_URL}/transaction/${transactionId}`);
        return handleResponse(response);
    },

    // Create new transaction (buy/sell)
    createTransaction: async (transactionData) => {
        const response = await fetch(`${API_BASE_URL}/transaction/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ticker: transactionData.ticker,
                quantity: transactionData.quantity,
                price: transactionData.price,
                user_id: transactionData.user_id,
                timestamp: transactionData.timestamp || new Date().toISOString(),
            }),
        });
        return handleResponse(response);
    },
};

// Market data API (you might want to integrate with a real market data service later)
export const marketApi = {
    // For now, we'll use mock data, but you can integrate with Yahoo Finance API or similar
    getMarketData: async (tickers) => {
        // Mock implementation - replace with real API call later
        const mockData = {
            'AAPL': { name: 'Apple Inc.', currentPrice: 175.20, dailyChange: 2.5 },
            'MSFT': { name: 'Microsoft Corp.', currentPrice: 305.50, dailyChange: -1.8 },
            'GOOGL': { name: 'Alphabet Inc. (Class A)', currentPrice: 1210.00, dailyChange: 0.8 },
            'AMZN': { name: 'Amazon.com Inc.', currentPrice: 102.30, dailyChange: 3.1 },
            'TSLA': { name: 'Tesla Inc.', currentPrice: 750.00, dailyChange: -4.5 },
            'NVDA': { name: 'NVIDIA Corp.', currentPrice: 550.00, dailyChange: 5.2 },
        };
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = {};
                tickers.forEach(ticker => {
                    if (mockData[ticker]) {
                        result[ticker] = mockData[ticker];
                    }
                });
                resolve(result);
            }, 100);
        });
    },
};

export default {
    userApi,
    transactionApi,
    marketApi,
};
