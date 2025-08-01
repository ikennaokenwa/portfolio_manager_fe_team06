// Simple test script to verify backend connection
// You can run this in the browser console to test your backend

const testBackendConnection = async () => {
    const API_BASE_URL = 'http://localhost:5000';
    
    try {
        console.log('Testing backend connection...');
        
        // Test 1: Get users
        const usersResponse = await fetch(`${API_BASE_URL}/users/`);
        if (usersResponse.ok) {
            const users = await usersResponse.json();
            console.log('✅ Users endpoint working:', users);
        } else {
            console.log('❌ Users endpoint failed:', usersResponse.status);
        }
        
        // Test 2: Get specific user (ID 1)
        const userResponse = await fetch(`${API_BASE_URL}/users/1`);
        if (userResponse.ok) {
            const user = await userResponse.json();
            console.log('✅ User endpoint working:', user);
        } else {
            console.log('❌ User endpoint failed:', userResponse.status);
        }
        
        // Test 3: Get user transactions
        const transactionsResponse = await fetch(`${API_BASE_URL}/users/1/transactions`);
        if (transactionsResponse.ok) {
            const transactions = await transactionsResponse.json();
            console.log('✅ Transactions endpoint working:', transactions);
        } else {
            console.log('❌ Transactions endpoint failed:', transactionsResponse.status);
        }
        
        // Test 4: Get user holdings
        const holdingsResponse = await fetch(`${API_BASE_URL}/users/1/holdings`);
        if (holdingsResponse.ok) {
            const holdings = await holdingsResponse.json();
            console.log('✅ Holdings endpoint working:', holdings);
        } else {
            console.log('❌ Holdings endpoint failed:', holdingsResponse.status);
        }
        
    } catch (error) {
        console.log('❌ Network error:', error.message);
        console.log('Make sure your backend is running on http://localhost:5000');
    }
};

// Run the test
testBackendConnection();
