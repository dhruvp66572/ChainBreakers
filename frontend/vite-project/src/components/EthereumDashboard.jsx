import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EthereumDashboard = () => {
    const [account, setAccount] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState(null);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    // Connect to MetaMask
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                setLoading(true);
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                setAccount(account);
                
                // Create a provider
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);
                
                toast.success('Successfully connected to MetaMask');
                
                // Fetch transactions after connecting
                await fetchTransactions(account, provider);
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
                toast.error('Failed to connect to MetaMask');
            } finally {
                setLoading(false);
            }
        } else {
            toast.error('MetaMask is not installed. Please install MetaMask to use this application.');
        }
    };

    // Fetch transactions for the connected account
    const fetchTransactions = async (address, provider) => {
        if (!address || !provider) return;
        
        try {
            setLoading(true);
            
            // Get current block number
            const blockNumber = await provider.getBlockNumber();
            
            // Fetch the last 10 blocks for transactions
            const blocksToFetch = 10;
            const startBlock = Math.max(0, blockNumber - blocksToFetch);
            
            let txList = [];
            
            // Loop through recent blocks
            for (let i = startBlock; i <= blockNumber; i++) {
                const block = await provider.getBlockWithTransactions(i);
                
                // Filter transactions where the connected account is involved
                const relevantTxs = block.transactions.filter(tx => 
                    tx.from.toLowerCase() === address.toLowerCase() || 
                    (tx.to && tx.to.toLowerCase() === address.toLowerCase())
                );
                
                // Add block information to each transaction
                const txsWithBlockInfo = relevantTxs.map(tx => ({
                    ...tx,
                    blockNumber: block.number,
                    timestamp: new Date(block.timestamp * 1000).toLocaleString(),
                    confirmations: blockNumber - block.number + 1
                }));
                
                txList = [...txList, ...txsWithBlockInfo];
            }
            
            setTransactions(txList);
            toast.info(`Found ${txList.length} transactions`);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    // Create a transaction
    const createTransaction = async (e) => {
        e.preventDefault();
        if (!recipient || !amount) {
            toast.error('Please provide a recipient address and amount');
            return;
        }

        try {
            const signer = provider.getSigner();
            const txResponse = await signer.sendTransaction({
                to: recipient,
                value: ethers.utils.parseEther(amount)
            });
            toast.success(`Transaction sent! Hash: ${txResponse.hash}`);
            await txResponse.wait(); // Wait for the transaction to be mined
            toast.success('Transaction confirmed!');
            fetchTransactions(account, provider); // Refresh transactions after sending
        } catch (error) {
            console.error('Error sending transaction:', error);
            toast.error('Transaction failed');
        }
    };

    // Logout functionality
    const logout = () => {
        setAccount('');
        setTransactions([]);
        setProvider(null);
        toast.info('Logged out successfully');
    };

    // Listen for account changes
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    if (provider) {
                        fetchTransactions(accounts[0], provider);
                    }
                } else {
                    setAccount('');
                    setTransactions([]);
                }
            });
        }
        
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
            }
        };
    }, [provider]);

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <ToastContainer position="top-right" autoClose={5000} />
            
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Ethereum Transaction Tracker</h1>
            
            {/* Connect Button */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={connectWallet}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                    {account ? 'Connected: ' + account.substring(0, 6) + '...' + account.substring(38) : 'Connect MetaMask'}
                </button>
            </div>
            
            {/* Account Info */}
            {account && (
                <div className="bg-white rounded-lg shadow-md p-4 mb-6 text-center">
                    <p className="font-semibold">Connected Account:</p>
                    <p className="text-gray-700 break-all">{account}</p>
                    <button
                        onClick={logout}
                        className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm"
                    >
                        Logout
                    </button>
                </div>
            )}
            
            {/* Create Transaction Form */}
            {account && (
                <form onSubmit={createTransaction} className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Create Transaction</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Amount in ETH"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                        Send Transaction
                    </button>
                </form>
            )}
            
            {/* Transactions List */}
            <h2 className="text-2xl font-semibold mt-4 text-gray-700">Transactions:</h2>
            
            {loading ? (
                <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                </div>
            ) : transactions.length > 0 ? (
                <div className="mt-4 overflow-y-auto max-h-96 border border-gray-300 rounded-lg bg-white">
                    {transactions.map((tx, index) => (
                        <div key={index} className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50">
                            <div className="flex justify-between flex-wrap">
                                <span className="font-semibold">Hash:</span>
                                <span className="text-blue-600 break-all">{tx.hash}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                <div>
                                    <p><span className="font-semibold">From:</span> {tx.from.substring(0, 8)}...{tx.from.substring(36)}</p>
                                    <p><span className="font-semibold">To:</span> {tx.to ? `${tx.to.substring(0, 8)}...${tx.to.substring(36)}` : 'Contract Creation'}</p>
                                    <p><span className="font-semibold">Value:</span> {ethers.utils.formatEther(tx.value)} ETH</p>
                                </div>
                                <div>
                                    <p><span className="font-semibold">Block:</span> {tx.blockNumber}</p>
                                    <p><span className="font-semibold">Timestamp:</span> {tx.timestamp}</p>
                                    <p><span className="font-semibold">Confirmations:</span> {tx.confirmations}</p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <a 
                                    href={`https://etherscan.io/tx/${tx.hash}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    View on Etherscan
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : account ? (
                <div className="mt-4 p-6 border border-gray-300 rounded-lg bg-white text-center">
                    <p className="text-gray-600">No transactions found for this account in recent blocks.</p>
                </div>
            ) : (
                <div className="mt-4 p-6 border border-gray-300 rounded-lg bg-white text-center">
                    <p className="text-gray-600">Connect your MetaMask wallet to view transactions.</p>
                </div>
            )}
        </div>
    );
};

export default EthereumDashboard;
