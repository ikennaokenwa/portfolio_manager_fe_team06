import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import React from 'react';

const data = [
    { date: '2023-01-01', value: 10000, cash: 2000 },
    { date: '2023-01-02', value: 11200, cash: 1800 },
    { date: '2023-01-03', value: 10800, cash: 2100 },
    { date: '2023-01-04', value: 11500, cash: 2200 },
    { date: '2023-01-05', value: 12000, cash: 2000 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-300 rounded p-2 shadow">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-blue-600">Portfolio: ${payload[0].value.toLocaleString()}</p>
                <p className="text-xs text-green-600">Cash: ${payload[1].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

export default function PortfolioChart() {
    return (
        <div className="w-full h-96 p-4">
            <h2 className="text-xl font-bold mb-2">Portfolio Performance</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Portfolio Value" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="cash" stroke="#82ca9d" name="Cash Balance" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
