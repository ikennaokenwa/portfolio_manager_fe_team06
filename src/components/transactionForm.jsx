import React from 'react';
import { formatCurrency } from '../utils/formatters';

function TransactionForm({ transactionFormData, handleInputChange, handleTransaction, marketData, holdings }) {
  const { type, ticker, quantity } = transactionFormData;

  // Get the current price from mock data
  const currentPrice = marketData[ticker.toUpperCase()]?.currentPrice;
  const isSufficientQuantity = holdings[ticker.toUpperCase()]?.quantity >= parseFloat(quantity);
  const isBuy = type === 'buy';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker && quantity) {
      if (isBuy && !currentPrice) {
        alert("Please enter a valid ticker to buy.");
        return;
      }
      if (!isBuy && !isSufficientQuantity) {
        alert(`You don't have enough shares of ${ticker.toUpperCase()} to sell.`);
        return;
      }
      handleTransaction();
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">New Transaction</h2>
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Transaction Type */}
        <div>
          <label htmlFor="type" className="form-label">Transaction Type</label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={handleInputChange}
            className="form-input"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        {/* Ticker Symbol */}
        <div>
          <label htmlFor="ticker" className="form-label">Ticker Symbol</label>
          <input
            type="text"
            id="ticker"
            name="ticker"
            value={ticker}
            onChange={handleInputChange}
            placeholder="e.g., AAPL"
            className="form-input"
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={handleInputChange}
            placeholder="e.g., 10"
            min="1"
            className="form-input"
            required
          />
        </div>
        
        {/* Current Price and Button */}
        <div className="md:col-span-1 flex flex-col justify-end">
          {currentPrice && (
            <p className="text-gray-700 text-sm mb-2 text-right md:text-left">
              Current Price: <span className="font-semibold">{formatCurrency(currentPrice)}</span>
            </p>
          )}
          <button
            type="submit"
            className={`form-button ${isBuy ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'} `}
          >
            {type.toUpperCase()}
          </button>
        </div>
      </form>
    </>
  );
}

export default TransactionForm;
