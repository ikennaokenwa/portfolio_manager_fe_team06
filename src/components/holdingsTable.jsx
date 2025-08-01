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
              <th className="table-header-cell rounded-tl-lg text-left">Ticker</th>
              <th className="table-header-cell text-left">Name</th>
              <th className="table-header-cell text-left">Quantity</th>
              <th className="table-header-cell text-left">Avg. Price</th>
              <th className="table-header-cell text-left">Current Price</th>
              <th className="table-header-cell text-left">Marg. Gain/Loss </th>    
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <tr key={holding.id} className="table-row">
                <td className="py-3 px-4 text-sm text-gray-800 font-medium">{holding.ticker}</td>
                <td className="table-cell text-left">{holding.name}</td>
                <td className="table-cell">{holding.quantity}</td>
                <td className="table-cell">{formatCurrency(holding.avgPrice)}</td>
                <td className="table-cell">{formatCurrency(holding.currentPrice)}</td>
                <td className={`py-3 px-4 text-sm font-semibold ${holding.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {holding.dailyChange >= 0 ? '▲' : '▼'} {formatPercentage(holding.dailyChange)}
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
