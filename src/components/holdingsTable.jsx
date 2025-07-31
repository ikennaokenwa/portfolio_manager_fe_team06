import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

function HoldingsTable({ holdings, onSell }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Holdings</h2>
      <div className="holdings-table-container">
        <table className="min-w-full bg-white border-collapse">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell rounded-tl-lg">Ticker</th>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell">Quantity</th>
              <th className="table-header-cell">Avg. Price</th>
              <th className="table-header-cell">Current Price</th>
              <th className="table-header-cell">Daily Change</th>
              <th className="table-header-cell rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <tr key={holding.id} className="table-row">
                <td className="py-3 px-4 text-sm text-gray-800 font-medium">{holding.ticker}</td>
                <td className="table-cell">{holding.name}</td>
                <td className="table-cell">{holding.quantity}</td>
                <td className="table-cell">{formatCurrency(holding.avgPrice)}</td>
                <td className="table-cell">{formatCurrency(holding.currentPrice)}</td>
                <td className={`py-3 px-4 text-sm font-semibold ${holding.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {holding.dailyChange >= 0 ? '▲' : '▼'} {formatPercentage(holding.dailyChange)}
                </td>
                <td className="py-3 px-4 text-sm">
                  {holding.quantity > 0 && (
                    <button
                      onClick={() => onSell(holding.ticker, 1)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors duration-200"
                    >
                      Sell 1
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {holdings.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">No holdings added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default HoldingsTable;
