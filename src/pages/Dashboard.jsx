import React, { useState } from 'react';
import PortfolioOverview from '../components/PortfolioOverview';
import HoldingsTable from '../components/HoldingsTable';
import PortfolioChart from '../components/PortfolioChart';
import TransactionForm from '../components/TransactionForm';
import { usePortfolio } from '../hooks/usePortfolio';

function Dashboard() {
    // Use the custom hook to manage portfolio data with backend integration
    const {
        user, // eslint-disable-line no-unused-vars
        transactions,
        holdings,
        marketData,
        calculations,
        loading,
        error,
        createTransaction,
        updateBalance,
    } = usePortfolio(1); // Using user ID 1 for now

    // State for new transaction form input
    const [transactionFormData, setTransactionFormData] = useState({
        type: 'buy',
        ticker: '',
        quantity: '',
    });

    // Handler for input changes in the transaction form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTransactionFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle buy/sell transactions using the backend
    const handleTransaction = async () => {
        const { type, ticker, quantity } = transactionFormData;
        const currentPrice = marketData[ticker.toUpperCase()]?.currentPrice;
        const numericQuantity = parseFloat(quantity);

        if (!currentPrice) {
            alert("Invalid ticker symbol or price not available. Please try again.");
            return;
        }

        if (!numericQuantity || numericQuantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        try {
            // For buy transactions, quantity is positive
            // For sell transactions, quantity is negative
            const transactionQuantity = type === 'buy' ? numericQuantity : -numericQuantity;
            
            await createTransaction({
                ticker: ticker.toUpperCase(),
                quantity: transactionQuantity,
                price: currentPrice,
            });

            // Clear the form on success
            setTransactionFormData({ type: 'buy', ticker: '', quantity: '' });
            
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} transaction completed successfully!`);
        } catch (err) {
            alert(`Transaction failed: ${err.message}`);
        }
    };

    // Handler for cash deposits/withdrawals
    const handleCashTransaction = async (amount) => {
        try {
            await updateBalance(amount);
            alert(`Cash ${amount > 0 ? 'deposit' : 'withdrawal'} completed successfully!`);
        } catch (err) {
            alert(`Cash transaction failed: ${err.message}`);
        }
    };

    // Convert holdings to array format for the table component
    const holdingsArray = holdings.map(holding => {
        const data = marketData[holding.ticker] || {};
        return {
            id: holding.id,
            ticker: holding.ticker,
            name: data.name || `${holding.ticker} Co.`,
            quantity: holding.quantity,
            avgPrice: holding.avg_price || 0,
            currentPrice: data.currentPrice || holding.avg_price || 0,
            dailyChange: data.dailyChange || 0,
        };
    }).filter(h => h.quantity > 0);

    // Calculate portfolio metrics
    const totalInvestmentCost = transactions
        .filter(t => t.quantity > 0) // Only buy transactions
        .reduce((sum, t) => sum + (t.quantity * t.price), 0);

    const overallProfitLoss = calculations.totalHoldingsValue - totalInvestmentCost;
    const overallProfitLossPercentage = totalInvestmentCost > 0 
        ? (overallProfitLoss / totalInvestmentCost) * 100 
        : 0;

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700">Loading your portfolio...</h2>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center bg-red-50 p-8 rounded-lg">
                    <h2 className="text-xl font-semibold text-red-700 mb-4">Error Loading Portfolio</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8">
                {/* Header */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
                    My Portfolio
                </h1>

                {/* Portfolio Overview Section */}
                <PortfolioOverview
                    totalPortfolioValue={calculations.totalPortfolioValue}
                    totalInvestmentCost={totalInvestmentCost}
                    overallProfitLoss={overallProfitLoss}
                    overallProfitLossPercentage={overallProfitLossPercentage}
                    cashBalance={calculations.cashBalance}
                />

                {/* Holdings Table */}
                <HoldingsTable holdings={holdingsArray} />

                {/* New Transaction Form */}
                <TransactionForm
                    transactionFormData={transactionFormData}
                    handleInputChange={handleInputChange}
                    handleTransaction={handleTransaction}
                    marketData={marketData}
                    holdings={holdings.reduce((acc, holding) => {
                        acc[holding.ticker] = holding;
                        return acc;
                    }, {})}
                />

                {/* Cash management form */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Cash</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => handleCashTransaction(1000)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Deposit $1,000
                        </button>
                        <button
                            onClick={() => handleCashTransaction(-500)}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Withdraw $500
                        </button>
                    </div>
                </div>

                {/* Portfolio Chart */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Performance</h2>
                    <PortfolioChart />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

