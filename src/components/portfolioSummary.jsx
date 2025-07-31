import { formatCurrency, formatPercentage } from '../utils/formatters'; // Import formatting utilities

function PortfolioOverview({ totalPortfolioValue, totalInvestmentCost, overallProfitLoss, overallProfitLossPercentage, cashBalance}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
        <p className="text-sm font-medium opacity-90">Total Portfolio Value</p>
        <p className="text-3xl sm:text-4xl font-bold mt-2">
          {formatCurrency(totalPortfolioValue)}
        </p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
        <p className="text-sm font-medium opacity-90">Cash Balance</p>
        <p className="text-3xl sm:text-4xl font-bold mt-2">
          {formatCurrency(cashBalance)}
        </p>
      </div>
      <div className={`p-6 rounded-lg shadow-md flex flex-col items-center justify-center ${overallProfitLoss >= 0 ? 'bg-gradient-to-br from-teal-500 to-teal-700' : 'bg-gradient-to-br from-red-500 to-red-700'} text-white`}>
        <p className="text-sm font-medium opacity-90">Overall P&L</p>
        <p className="text-3xl sm:text-4xl font-bold mt-2">
          {formatCurrency(overallProfitLoss)}
        </p>
        <p className="text-lg mt-1">
          ({formatPercentage(overallProfitLossPercentage)})
        </p>
      </div>
      
    </div>
  );
}



export default PortfolioOverview;