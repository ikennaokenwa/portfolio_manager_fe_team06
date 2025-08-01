import React, { useState } from 'react';

// Simple component to test backend connectivity
const BackendTest = () => {
    const [testResults, setTestResults] = useState([]);
    const [testing, setTesting] = useState(false);

    const testEndpoints = async () => {
        setTesting(true);
        setTestResults([]);
        
        const endpoints = [
            { name: 'Users List', url: 'http://localhost:5000/user/' },
            { name: 'User 1', url: 'http://localhost:5000/user/1' },
            { name: 'User 1 Transactions', url: 'http://localhost:5000/user/1/transactions' },
            { name: 'User 1 Holdings', url: 'http://localhost:5000/user/1/holdings' },
        ];

        const results = [];

        for (const endpoint of endpoints) {
            try {
                console.log(`Testing ${endpoint.name}: ${endpoint.url}`);
                const response = await fetch(endpoint.url);
                
                if (response.ok) {
                    const data = await response.json();
                    results.push({
                        name: endpoint.name,
                        status: 'SUCCESS',
                        data: data,
                        error: null
                    });
                } else {
                    results.push({
                        name: endpoint.name,
                        status: 'ERROR',
                        data: null,
                        error: `HTTP ${response.status}: ${response.statusText}`
                    });
                }
            } catch (error) {
                results.push({
                    name: endpoint.name,
                    status: 'NETWORK_ERROR',
                    data: null,
                    error: error.message
                });
            }
        }

        setTestResults(results);
        setTesting(false);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Backend Connection Test</h2>
            
            <button
                onClick={testEndpoints}
                disabled={testing}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {testing ? 'Testing...' : 'Test Backend Connection'}
            </button>

            {testResults.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
                    {testResults.map((result, index) => (
                        <div key={index} className="mb-4 p-4 border rounded">
                            <div className="flex items-center mb-2">
                                <span className="font-medium">{result.name}: </span>
                                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                    result.status === 'SUCCESS' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {result.status}
                                </span>
                            </div>
                            
                            {result.error && (
                                <div className="text-red-600 text-sm mb-2">
                                    Error: {result.error}
                                </div>
                            )}
                            
                            {result.data && (
                                <details className="text-sm">
                                    <summary className="cursor-pointer text-blue-600">
                                        View Response Data
                                    </summary>
                                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                                        {JSON.stringify(result.data, null, 2)}
                                    </pre>
                                </details>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 rounded">
                <h4 className="font-semibold text-yellow-800">Common Issues:</h4>
                <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">
                    <li>Backend not running - Check your Flask server terminal</li>
                    <li>Wrong port - Flask usually runs on port 5000</li>
                    <li>CORS issues - Make sure CORS is enabled in your Flask app</li>
                    <li>Firewall blocking requests</li>
                </ul>
            </div>
        </div>
    );
};

export default BackendTest;
