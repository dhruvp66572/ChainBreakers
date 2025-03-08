import React, { useEffect, useState } from 'react';
import { FiRefreshCw, FiFilter, FiSearch, FiArrowRight, FiClock, FiDollarSign, FiHash } from 'react-icons/fi';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/transactions');
            const data = await response.json();
            console.log("Fetched transactions:", data);
            
            setTransactions(data.transactions || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Filter transactions based on search query and selected filter
    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = searchQuery === '' || 
            (tx.entity_id && tx.entity_id.toString().includes(searchQuery)) ||
            (tx.consensus_timestamp && tx.consensus_timestamp.includes(searchQuery));
        
        if (filter === 'all') return matchesSearch;
        if (filter === 'high-fee' && tx.charged_tx_fee > 1000000) return matchesSearch;
        if (filter === 'low-fee' && tx.charged_tx_fee <= 1000000) return matchesSearch;
        
        return false;
    });

    // Function to format timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp || isNaN(new Date(timestamp))) return 'Invalid Date';
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    // Function to convert tinybars to a more readable format
    const formatTinybars = (tinybars) => {
        if (!tinybars) return '0';
        if (tinybars >= 100000000) {
            return `${(tinybars / 100000000).toFixed(2)} ℏ`;
        } else {
            return `${tinybars} tinybars`;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* Header Banner */}
            <div className="container mx-auto px-4">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Real-Time Hedera Transaction Tracker</h1>
                            <p className="mt-2 text-purple-100">Monitor live transactions on the Hedera network</p>
                        </div>
                        <button 
                            onClick={fetchTransactions} 
                            className="mt-4 md:mt-0 flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition-all duration-200"
                        >
                            <FiRefreshCw className="mr-2" /> Refresh Data
                        </button>
                    </div>
                </div>

                {/* Controls and Stats Section */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        {/* Search */}
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by Entity ID or Timestamp..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter */}
                        <div className="flex items-center">
                            <FiFilter className="mr-2 text-gray-500" />
                            <select 
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Transactions</option>
                                <option value="high-fee">High Fee (&gt;1M tinybars)</option>
                                <option value="low-fee">Low Fee (&lt;=1M tinybars)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-lg font-semibold text-gray-700">Total Transactions</h3>
                        <p className="text-3xl font-bold text-purple-600">{transactions.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-lg font-semibold text-gray-700">Average Fee</h3>
                        <p className="text-3xl font-bold text-purple-600">
                            {transactions.length > 0 
                                ? formatTinybars(Math.round(transactions.reduce((sum, tx) => sum + (parseInt(tx.charged_tx_fee) || 0), 0) / transactions.length))
                                : '0'}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-lg font-semibold text-gray-700">Latest Update</h3>
                        <p className="text-xl font-bold text-purple-600">
                            {transactions.length > 0 
                                ? new Date().toLocaleTimeString() 
                                : 'No data yet'}
                        </p>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
                        </div>
                    ) : filteredTransactions.length > 0 ? (
                        <div className="overflow-y-auto max-h-96">
                            {filteredTransactions.map((tx, index) => (
                                <div key={tx.consensus_timestamp || index} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150">
                                    <div className="p-4">
                                        <div className="flex flex-col md:flex-row justify-between">
                                            <div className="flex items-start mb-2 md:mb-0">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                                                    <FiHash className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Entity ID</p>
                                                    <p className="font-medium">{tx.entity_id || 'N/A'}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex items-center">
                                                    <FiClock className="text-gray-400 mr-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Timestamp</p>
                                                        <p className="font-medium">{formatTimestamp(tx.consensus_timestamp)}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center">
                                                    <FiDollarSign className="text-gray-400 mr-1" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Fee</p>
                                                        <p className="font-medium">{formatTinybars(tx.charged_tx_fee)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {tx.max_fee && (
                                            <div className="mt-2 text-sm">
                                                <span className="text-gray-500">Max Fee:</span> {formatTinybars(tx.max_fee)}
                                            </div>
                                        )}
                                        
                                        <div className="mt-3 flex justify-end">
                                            <a 
                                                href={`https://testnet.dragonglass.me/hedera/search?q=${tx.entity_id}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-purple-600 hover:text-purple-800 text-sm flex items-center"
                                            >
                                                View Details <FiArrowRight className="ml-1" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <p className="mt-4 text-gray-600">
                                {searchQuery || filter !== 'all' 
                                    ? 'No transactions found matching your criteria.' 
                                    : 'No transactions available at the moment. Transactions will appear here as they occur on the Hedera network.'}
                            </p>
                            {(searchQuery || filter !== 'all') && (
                                <button 
                                    onClick={() => {
                                        setSearchQuery('');
                                        setFilter('all');
                                    }}
                                    className="mt-4 text-purple-600 hover:text-purple-800"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
