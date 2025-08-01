import React from 'react';

function AddHoldingForm({ newHolding, handleInputChange, handleAddHolding }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Add New Holding</h2>
      <form onSubmit={handleAddHolding} className="bg-gray-50 p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="ticker" className="block text-sm font-medium text-gray-700 mb-1">Ticker Symbol</label>
          <input
            type="text"
            id="ticker"
            name="ticker"
            value={newHolding.ticker}
            onChange={handleInputChange}
            placeholder="e.g., AAPL"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={newHolding.quantity}
            onChange={handleInputChange}
            placeholder="e.g., 10"
            min="1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="avgPrice" className="block text-sm font-medium text-gray-700 mb-1">Average Price</label>
          <input
            type="number"
            id="avgPrice"
            name="avgPrice"
            value={newHolding.avgPrice}
            onChange={handleInputChange}
            placeholder="e.g., 150.00"
            step="0.01"
            min="0.01"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Add Holding
          </button>
        </div>
      </form>
    </>
  );
}

export default AddHoldingForm;
