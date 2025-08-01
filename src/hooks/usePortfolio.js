import { useState, useEffect, useCallback } from 'react';
import { userApi, transactionApi, marketApi } from '../services/api';

// Custom hook for managing portfolio data with backend integration
export const usePortfolio = (userId = 1) => { // Default to user 1 for now
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [holdings, setHoldings] = useState([]);
    const [marketData, setMarketData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user data
    const fetchUser = useCallback(async () => {
        try {
            const userData = await userApi.getUser(userId);
            setUser(userData);
        } catch (err) {
            console.error('Error fetching user:', err);
            setError(err.message);
        }
    }, [userId]);

    // Fetch user transactions
    const fetchTransactions = useCallback(async () => {
        try {
            const transactionsData = await userApi.getUserTransactions(userId);
            setTransactions(transactionsData);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError(err.message);
        }
    }, [userId]);

    // Fetch user holdings
    const fetchHoldings = useCallback(async () => {
        try {
            const holdingsData = await userApi.getUserHoldings(userId);
            setHoldings(holdingsData);
        } catch (err) {
            console.error('Error fetching holdings:', err);
            setError(err.message);
        }
    }, [userId]);

    // Fetch market data for all tickers in holdings
    const fetchMarketData = useCallback(async () => {
        try {
            const tickers = holdings.map(holding => holding.ticker);
            if (tickers.length > 0) {
                const marketDataResponse = await marketApi.getMarketData(tickers);
                setMarketData(marketDataResponse);
            }
        } catch (err) {
            console.error('Error fetching market data:', err);
            setError(err.message);
        }
    }, [holdings]);

    // Create a new transaction
    const createTransaction = async (transactionData) => {
        try {
            setLoading(true);
            await transactionApi.createTransaction({
                ...transactionData,
                user_id: userId,
            });
            
            // Refresh data after successful transaction
            await Promise.all([
                fetchTransactions(),
                fetchHoldings(),
                fetchUser(),
            ]);
        } catch (err) {
            console.error('Error creating transaction:', err);
            setError(err.message);
            throw err; // Re-throw to handle in component
        } finally {
            setLoading(false);
        }
    };

    // Deposit/withdraw cash
    const updateBalance = async (amount) => {
        try {
            setLoading(true);
            await userApi.depositBalance(userId, amount);
            
            // Refresh user data
            await fetchUser();
        } catch (err) {
            console.error('Error updating balance:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                await Promise.all([
                    fetchUser(),
                    fetchTransactions(),
                    fetchHoldings(),
                ]);
            } catch (err) {
                console.error('Error loading initial data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [fetchUser, fetchTransactions, fetchHoldings]);

    // Fetch market data when holdings change
    useEffect(() => {
        if (holdings.length > 0) {
            fetchMarketData();
        }
    }, [holdings.length, fetchMarketData]);

    // Calculate derived values
    const calculations = {
        cashBalance: user?.balance || 0,
        totalHoldingsValue: holdings.reduce((sum, holding) => {
            const currentPrice = marketData[holding.ticker]?.currentPrice || 0;
            return sum + (holding.quantity * currentPrice);
        }, 0),
        totalPortfolioValue: (user?.balance || 0) + holdings.reduce((sum, holding) => {
            const currentPrice = marketData[holding.ticker]?.currentPrice || 0;
            return sum + (holding.quantity * currentPrice);
        }, 0),
    };

    return {
        // Data
        user,
        transactions,
        holdings,
        marketData,
        calculations,
        
        // State
        loading,
        error,
        
        // Actions
        createTransaction,
        updateBalance,
        
        // Refresh functions
        refetch: () => {
            fetchUser();
            fetchTransactions();
            fetchHoldings();
        },
    };
};
