// import React, { useState } from 'react';
// import PortfolioOverview from '../components/portfolioSummary';
// import HoldingsTable from '../components/holdingsTable';
// import AddHoldingForm from '../components/buySell';


// function Dashboard() {
//     // ... (all your state and functions from App.jsx go here)
//     // ... keep as-is
//     // State for all transactions (buys, sells, deposits, withdrawals). This is our source of truth.
//     const [transactions, setTransactions] = useState([
//         // Initial deposit
//         { id: 1, type: 'deposit', amount: 10000, ticker: null, date: '2023-01-01' },
//         // Mock buys
//         { id: 2, type: 'buy', amount: -1500, ticker: 'AAPL', quantity: 10, avgPrice: 150.00, date: '2023-01-02' },
//         { id: 3, type: 'buy', amount: -1400, ticker: 'MSFT', quantity: 5, avgPrice: 280.00, date: '2023-01-03' },
//     ]);

//     // State for mock prices and names (in a real app, this would come from an API)
//     const [marketData] = useState({
//         'AAPL': { name: 'Apple Inc.', currentPrice: 175.20, dailyChange: 2.5 },
//         'MSFT': { name: 'Microsoft Corp.', currentPrice: 305.50, dailyChange: -1.8 },
//         'GOOGL': { name: 'Alphabet Inc. (Class A)', currentPrice: 1210.00, dailyChange: 0.8 },
//         'AMZN': { name: 'Amazon.com Inc.', currentPrice: 102.30, dailyChange: 3.1 },
//     });

//     // State for new holding form input
//     const [newHolding, setNewHolding] = useState({
//         ticker: '',
//         quantity: '',
//         avgPrice: '',
//     });

//     // Derived state: calculate holdings, cash balance, and total values from transactions
//     const holdings = transactions
//         .filter(t => t.type === 'buy' || t.type === 'sell')
//         .reduce((acc, transaction) => {
//             const { ticker, quantity, avgPrice, type } = transaction;
//             const existingHolding = acc[ticker] || { quantity: 0, avgPrice: 0 };

//             let newQuantity;
//             if (type === 'buy') {
//                 newQuantity = existingHolding.quantity + quantity;
//             } else { // type === 'sell'
//                 newQuantity = existingHolding.quantity - quantity;
//             }

//             // Calculate the new average price
//             const totalCost = existingHolding.quantity * existingHolding.avgPrice + (type === 'buy' ? quantity * avgPrice : 0);
//             const newAvgPrice = newQuantity > 0 ? totalCost / newQuantity : 0;

//             acc[ticker] = {
//                 ...existingHolding,
//                 quantity: newQuantity,
//                 avgPrice: newAvgPrice
//             };

//             return acc;
//         }, {});

//     // Calculate cash balance by summing all transaction amounts
//     const cashBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

//     // Calculate total holdings value
//     const totalHoldingsValue = Object.keys(holdings).reduce((sum, ticker) => {
//         const holding = holdings[ticker];
//         const price = marketData[ticker]?.currentPrice || holding.avgPrice;
//         return sum + (holding.quantity * price);
//     }, 0);

//     // Calculate total investment cost (sum of all buy transactions)
//     const totalInvestmentCost = transactions
//         .filter(t => t.type === 'buy')
//         .reduce((sum, t) => sum - t.amount, 0);

//     const totalPortfolioValue = totalHoldingsValue + cashBalance;
//     const overallProfitLoss = totalPortfolioValue - totalInvestmentCost - cashBalance;
//     const overallProfitLossPercentage = totalInvestmentCost > 0 ? (overallProfitLoss / totalInvestmentCost) * 100 : 0;

//     // Handle input changes for new holding form
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewHolding(prev => ({ ...prev, [name]: value }));
//     };

//     // Handle a new BUY transaction from the form
//     const handleBuyTransaction = (e) => {
//         e.preventDefault();
//         if (newHolding.ticker && newHolding.quantity && newHolding.avgPrice) {
//             const cost = parseFloat(newHolding.quantity) * parseFloat(newHolding.avgPrice);
//             const newTransaction = {
//                 id: transactions.length + 1,
//                 type: 'buy',
//                 amount: -cost, // Amount is negative because it reduces cash
//                 ticker: newHolding.ticker.toUpperCase(),
//                 quantity: parseFloat(newHolding.quantity),
//                 avgPrice: parseFloat(newHolding.avgPrice),
//                 date: new Date().toISOString().split('T')[0],
//             };
//             setTransactions(prev => [...prev, newTransaction]);
//             setNewHolding({ ticker: '', quantity: '', avgPrice: '' });
//         } else {
//             console.error("Please fill all fields for the new holding.");
//         }
//     };

//     // NEW: Handle a SELL transaction
//     const handleSellTransaction = (ticker, sellQuantity) => {
//         const holding = holdings[ticker];
//         if (holding && holding.quantity >= sellQuantity) {
//             const currentPrice = marketData[ticker]?.currentPrice || holding.avgPrice;
//             const proceeds = sellQuantity * currentPrice;
//             const newTransaction = {
//                 id: transactions.length + 1,
//                 type: 'sell',
//                 amount: proceeds, // Amount is positive because it adds to cash
//                 ticker,
//                 quantity: sellQuantity,
//                 avgPrice: currentPrice, // Use current price for sell transaction
//                 date: new Date().toISOString().split('T')[0],
//             };
//             setTransactions(prev => [...prev, newTransaction]);
//         } else {
//             console.error("Insufficient quantity to sell.");
//         }
//     };

//     // Handler for adding a deposit/withdrawal
//     const handleCashTransaction = (amount) => {
//         const newTransaction = {
//             id: transactions.length + 1,
//             type: amount > 0 ? 'deposit' : 'withdrawal',
//             amount: parseFloat(amount),
//             ticker: null,
//             date: new Date().toISOString().split('T')[0],
//         };
//         setTransactions(prev => [...prev, newTransaction]);
//     };

//     // Convert the holdings object back to an array for the table
//     const holdingsArray = Object.keys(holdings).map(ticker => {
//         const holding = holdings[ticker];
//         const data = marketData[ticker] || {};
//         return {
//             id: holdings.id,
//             ticker,
//             name: data.name || `${ticker} Co. (Mock)`,
//             quantity: holding.quantity,
//             avgPrice: holding.avgPrice,
//             currentPrice: data.currentPrice || holding.avgPrice,
//             dailyChange: data.dailyChange || 0,
//         };
//     });

//     return (
//         <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
//             {/* ... same JSX content from your App return ... */}
//             <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8">
//                 {/* Header */}
//                 <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
//                     My Portfolio
//                 </h1>

//                 {/* Portfolio Overview Section */}
//                 <PortfolioOverview
//                     totalPortfolioValue={totalPortfolioValue}
//                     overallProfitLoss={overallProfitLoss}
//                     overallProfitLossPercentage={overallProfitLossPercentage}
//                     cashBalance={cashBalance}
//                 />

//                 {/* Holdings Table - now includes a "Sell" button */}
//                 <HoldingsTable holdings={holdingsArray} onSell={handleSellTransaction} />

//                 {/* Add New Holding Form - now triggers a buy transaction */}
//                 <AddHoldingForm
//                     newHolding={newHolding}
//                     handleInputChange={handleInputChange}
//                     handleAddHolding={handleBuyTransaction} // Use the new buy function
//                 />

//                 {/* New cash management form */}
//                 <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Cash</h2>
//                     <div className="flex space-x-4">
//                         <button
//                             onClick={() => handleCashTransaction(1000)}
//                             className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                         >
//                             Deposit $1,000
//                         </button>
//                         <button
//                             onClick={() => handleCashTransaction(-500)}
//                             className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                         >
//                             Withdraw $500
//                         </button>
//                     </div>
//                 </div>

//                 {/* Placeholder for Charts */}
//                 <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Performance (Coming Soon)</h2>
//                     <p className="text-gray-600">
//                         This section would typically feature interactive charts (e.g., line charts for portfolio value over time, pie charts for asset allocation).
//                         You could integrate libraries like Recharts or Chart.js here.
//                     </p>
//                     <div className="mt-4 h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-lg">
//                         Chart Placeholder
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Dashboard;

import React, { useState } from 'react';
import PortfolioOverview from '../components/PortfolioOverview';
import HoldingsTable from '../components/HoldingsTable';
import AddHoldingForm from '../components/AddHoldingForm';
import PortfolioChart from '../components/PortfolioChart';


function Dashboard() {
  // State for all transactions (buys, sells, deposits, withdrawals). This is our source of truth.
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'deposit', amount: 10000, ticker: null, date: '2023-01-01' },
    { id: 2, type: 'buy', amount: -1500, ticker: 'AAPL', quantity: 10, avgPrice: 150.00, date: '2023-01-02' },
    { id: 3, type: 'buy', amount: -1400, ticker: 'MSFT', quantity: 5, avgPrice: 280.00, date: '2023-01-03' },
  ]);

  // State for mock prices and names (in a real app, this would come from an API)
  const [marketData] = useState({
    'AAPL': { name: 'Apple Inc.', currentPrice: 175.20, dailyChange: 2.5 },
    'MSFT': { name: 'Microsoft Corp.', currentPrice: 305.50, dailyChange: -1.8 },
    'GOOGL': { name: 'Alphabet Inc. (Class A)', currentPrice: 1210.00, dailyChange: 0.8 },
    'AMZN': { name: 'Amazon.com Inc.', currentPrice: 102.30, dailyChange: 3.1 },
    'TSLA': { name: 'Tesla Inc.', currentPrice: 750.00, dailyChange: -4.5 },
    'NVDA': { name: 'NVIDIA Corp.', currentPrice: 550.00, dailyChange: 5.2 },
  });

  // State for new transaction form input
  const [transactionFormData, setTransactionFormData] = useState({
    type: 'buy',
    ticker: '',
    quantity: '',
  });
  
  // Calculate cash balance by summing all transaction amounts
  const cashBalance = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Derived state: calculate holdings from transactions
  const holdings = transactions
    .filter(t => t.type === 'buy' || t.type === 'sell')
    .reduce((acc, transaction) => {
      const { ticker, quantity, avgPrice, type } = transaction;
      const existingHolding = acc[ticker] || { quantity: 0, avgPrice: 0 };
      
      let newQuantity;
      let newAvgPrice;
      if (type === 'buy') {
        newQuantity = existingHolding.quantity + quantity;
        const totalCost = (existingHolding.quantity * existingHolding.avgPrice) + (type === 'buy' ? quantity * avgPrice : 0);
        newAvgPrice = newQuantity > 0 ? totalCost / newQuantity : 0;
      } else { // type === 'sell'
        newQuantity = existingHolding.quantity - quantity;
        newAvgPrice=existingHolding.avgPrice;

      }

      // Calculate the new average price
    //   const totalCost = (existingHolding.quantity * existingHolding.avgPrice) + (type === 'buy' ? quantity * avgPrice : 0);
    //   newAvgPrice = newQuantity > 0 ? totalCost / newQuantity : 0;

      acc[ticker] = {
        ...existingHolding,
        quantity: newQuantity,
        avgPrice: newAvgPrice
      };
      
      return acc;
    }, {});


  // Calculate total holdings value
  const totalHoldingsValue = Object.keys(holdings).reduce((sum, ticker) => {
    const holding = holdings[ticker];
    if (holding.quantity > 0) {
      const price = marketData[ticker]?.currentPrice || holding.avgPrice;
      return sum + (holding.quantity * price);
    }
    return sum;
  }, 0);
  
  // Calculate total investment cost (sum of all buy transactions)
  const totalInvestmentCost = transactions
    .filter(t => t.type === 'buy')
    .reduce((sum, t) => sum - t.amount, 0);
  
  const totalPortfolioValue = totalHoldingsValue + cashBalance;
  const overallProfitLoss = totalPortfolioValue - totalInvestmentCost - cashBalance;
  const overallProfitLossPercentage = totalInvestmentCost > 0 ? (overallProfitLoss / totalInvestmentCost) * 100 : 0;
  
  // Handler for input changes in the transaction form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionFormData(prev => ({ ...prev, [name]: value }));
  };

  // NEW: A single function to handle both buy and sell transactions
  const handleTransaction = () => {
    const { type, ticker, quantity } = transactionFormData;
    const currentPrice = marketData[ticker.toUpperCase()]?.currentPrice;
    const numericQuantity = parseFloat(quantity);
    
    // Check for buy transaction constraints
    if (type === 'buy') {
      const cost = numericQuantity * currentPrice;
      if (cashBalance >= cost) {
        const newTransaction = {
          id: transactions.length + 1,
          type: 'buy',
          amount: -cost,
          ticker: ticker.toUpperCase(),
          quantity: numericQuantity,
          avgPrice: currentPrice,
          date: new Date().toISOString().split('T')[0],
        };
        setTransactions(prev => [...prev, newTransaction]);
        setTransactionFormData({ type: 'buy', ticker: '', quantity: '' });
      } else {
        alert("Insufficient cash to make this purchase.");
      }
    } 
    // Check for sell transaction constraints
    else if (type === 'sell') {
      const holding = holdings[ticker.toUpperCase()];
      if (holding && holding.quantity >= numericQuantity) {
        const proceeds = numericQuantity * currentPrice;
        const newTransaction = {
          id: transactions.length + 1,
          type: 'sell',
          amount: proceeds,
          ticker: ticker.toUpperCase(),
          quantity: numericQuantity,
          avgPrice: currentPrice,
          date: new Date().toISOString().split('T')[0],
        };
        setTransactions(prev => [...prev, newTransaction]);
        setTransactionFormData({ type: 'sell', ticker: '', quantity: '' });
      } else {
        alert("Insufficient shares to sell.");
      }
    }
  };

  // Handler for adding a deposit/withdrawal
  const handleCashTransaction = (amount) => {
    const newTransaction = {
      id: transactions.length + 1,
      type: amount > 0 ? 'deposit' : 'withdrawal',
      amount: parseFloat(amount),
      ticker: null,
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  // Convert the holdings object back to an array for the table
  const holdingsArray = Object.keys(holdings).map(ticker => {
    const holding = holdings[ticker];
    const data = marketData[ticker] || {};
    return {
      id: holding.id,
      ticker,
      name: data.name || `${ticker} Co. (Mock)`,
      quantity: holding.quantity,
      avgPrice: holding.avgPrice,
      currentPrice: data.currentPrice || holding.avgPrice,
      dailyChange: data.dailyChange || 0,
    };
  }).filter(h => h.quantity > 0); // Only show holdings with a quantity greater than 0

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          My Portfolio
        </h1>

        {/* Portfolio Overview Section */}
        <PortfolioOverview
          totalPortfolioValue={totalPortfolioValue}
          totalInvestmentCost={totalInvestmentCost}
          overallProfitLoss={overallProfitLoss}
          overallProfitLossPercentage={overallProfitLossPercentage}
          cashBalance={cashBalance}
        />

        {/* Holdings Table */}
        <HoldingsTable holdings={holdingsArray} />

        {/* New Transaction Form */}
        <TransactionForm
          transactionFormData={transactionFormData}
          handleInputChange={handleInputChange}
          handleTransaction={handleTransaction}
          marketData={marketData}
          holdings={holdings}
        />

        {/* New cash management form */}
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

                {/* Placeholder for Charts */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Performance (Coming Soon)</h2>
                    <p className="text-gray-600">
                        This section would typically feature interactive charts (e.g., line charts for portfolio value over time, pie charts for asset allocation).
                        You could integrate libraries like Recharts or Chart.js here.
                    </p>
                    {/* <div className="mt-4 h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-lg">
                        Chart Placeholder */}
                        <PortfolioChart />
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

