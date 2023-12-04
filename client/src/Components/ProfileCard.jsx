import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Axios } from '../helpers/axiosHelper';
import axios from 'axios';

const ProfileCard = () => {
    const navigate = useNavigate();

    const [isReadyToFund, setIsReadyToFund] = useState(false);
    const [isReadyToWithdraw, setIsReadyToWithdraw] = useState(false);
    const [promptFundAndWithdrawal, setPromptFundAndWithdrawal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [user, setUser] = useState();






    useEffect(() => {
        const fetchWalletBalance = async () => {
            const response = await Axios({
                url: 'wallet/wallet-balance',
                method: 'get',
            });

            setWalletBalance(response.walletDetails.amount);
        }

        fetchWalletBalance();
    }, []);


    const initiatePayment = async () => {
        setIsLoading(true);
        try {
            const response = await Axios({
                url: 'wallet/fund-wallet',
                method: 'post',
                body: {
                    amount,
                }
            });

            setIsLoading(false);
            if (response.status) {
                localStorage.setItem('client_secret', response.client_secret);
                setTimeout(() => {
                    navigate(`/fund-wallet/${amount}`);
                }, 2000);
            }
        } catch (err) {
            setIsLoading(false);
            alert('Unable to process wallet funding');
        }
    }

    const initiateWithdrawal = async () => {
        setIsLoading(true);
        try {
            const response = await Axios({
                url: 'wallet/withdraw',
                method: 'post',
                body: {
                    amount,
                }
            });

            setIsLoading(false);
            if (response.status) {
                if (response.data.isOnboarded) {
                    alert(response.message);
                    window.location.reload();
                    return;
                }

                if (response.data.url) {
                    alert(response.message);
                    window.location.href = response.data.url;
                    return;
                }

                if (!response.data.url) {
                    alert(response.message);
                    return;
                }
            }
        } catch (err) {
            setIsLoading(false);
            alert(err.message);
        }
    }

    const handleFundOrWithdraw = () => {
        if (isReadyToFund) {
            initiatePayment();
        } else if (isReadyToWithdraw) {
            initiateWithdrawal();
        }
    }


    useEffect(() => {
        axios.get(`https://allsquare.club/api/users/getUser`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch()
    }, [])

    const logoutHandler = () => {
        axios.delete(`https://allsquare.club/api/users/logout`, { withCredentials: true })
            .then(res => {
                // clear all local/session storage
                localStorage.clear();
                sessionStorage.clear();

                // Clear all cookies (individually)
                document.cookie.split(";").forEach((c) => {
                    document.cookie = c
                        .replace(/^ +/, "")
                        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });

                console.log('user logged out successfully')
                navigate("/")
            })
            .catch(err => {
                console.error("Error during logout:", err)
            })
    }


    return (
        <div className="min-h-screen bg-gray-dark flex justify-center items-center p-4">
            <div className="w-full max-w-sm bg-blue-dark border border-salmon-light rounded-lg shadow dark:bg-gray-darkest dark:border-salmon-light">
                <div className="flex flex-col items-center pb-10">

                    <span className="inline-block h-28 w-28 m-4 overflow-hidden rounded-full bg-gray-100">
                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </span>
                    <h1 className="m-1 text-5xl font-medium text-orange-light dark:text-orange-light">{user && user.username}</h1>
                    <h2 className="text-xl text-salmon-light dark:text-salmon-light">Handicap: {user && user.handicap}</h2>
                    {/* Wallet Balance */}
                    <div className="m-3 bg-gray-light dark:bg-gray-light p-2 w-60 h-full rounded-lg shadow flex flex-col items-center justify-center border-2 border-slamon-light">
                        <div className="text-lg font-bold text-cyan-dark dark:text-cyan-dark uppercase mb-2">
                            Wallet Balance:
                        </div>
                        <div className="text-5xl font-bold text-gray-900 dark:text-cyan-dark">
                            ${walletBalance}
                        </div>
                    </div>
                    <div className="flex flex-col mt-4 space-y-2 md:mt-6 md:flex-row md:space-y-0 md:space-x-2">
                        {/* Fund Wallet Button */}
                        <button
                            className="inline-flex items-center justify-center px-4 py-2 text-center w-40 border border-transparent text-sm font-medium text-black bg-blue-light rounded-md hover:bg-maroon-normal dark:focus:ring-salmon-light focus:outline-none focus:ring"
                            onClick={() => {
                                setPromptFundAndWithdrawal(true);
                                setIsReadyToFund(true);
                                setIsReadyToWithdraw(false);
                            }}
                        >
                            Deposit Funds
                        </button>
                        {/* Withdraw Funds Button */}
                        <button
                            className="inline-flex items-center justify-center px-4 py-2 text-center w-40 border border-transparent text-sm font-medium text-black bg-blue-light rounded-md hover:bg-maroon-normal dark:focus:ring-salmon-light focus:outline-none focus:ring"
                            onClick={() => {
                                setPromptFundAndWithdrawal(true);
                                setIsReadyToWithdraw(true);
                                setIsReadyToFund(false);
                            }}
                        >
                            Withdraw Funds
                        </button>
                    </div>
                    {
                        (isReadyToFund || isReadyToWithdraw) &&
                        <div className='flex flex-col items-center mt-3 '>
                            <input type="number" placeholder='Enter amount' className="appearance-none block w-full px-3 py-2 rounded-md bg-gray-light focus:outline-none focus:ring-4 focus:ring-salmon-light sm:text-sm" onChange={(e) => setAmount(e.target.value)} />
                            <button
                                className='mt-3 inline-flex items-center justify-center px-2 py-2 text-center w-40 border border-transparent text-sm font-bold text-white bg-indigo-dark rounded-md hover:bg-gray-dark dark:focus:ring-salmon-light focus:outline-1 focus:ring-2 focus:ring-salmon-light'
                                onClick={handleFundOrWithdraw}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : (isReadyToFund ? 'Confirm Deposit' : 'Confirm Withdraw')}
                            </button>
                        </div>
                    }
                    <div className="mt-4 flex justify-center space-x-4">
                        <Link to="/home" className="w-9/12 inline-flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-maroon-normal hover:bg-indigo-dark hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light">
                            Home
                        </Link>
                        <button onClick={logoutHandler} className="w-9/12 inline-flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-maroon-normal hover:bg-indigo-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salmon-light">Logout</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ProfileCard;

