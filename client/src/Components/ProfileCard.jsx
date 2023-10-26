import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
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
                localStorage.clear();
                console.log('user logged out successfully')
                navigate("/")
            })
            .catch(err => {
                console.error("Error during logout:", err)
            })
    }


    return (
        <div>
            <section className="vh-100" style={{ backgroundColor: '#eee' }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-12 col-xl-4">
                            <div className="card" style={{ borderRadius: '15px' }}>
                                <div className="card-body text-center">
                                    <h4 className="mb-2">{user && user.username}</h4>
                                    <div className="mb-4 pb-2">
                                        <p>Handicap: 7.4</p>
                                        <p>Payments | PayPal, Venmo, AppleCash </p>
                                        <p>Home Course:</p>
                                        <p>Omni Interlocken Golf Club, Superior Colorado</p>
                                    </div>

                                    <div className='mt-4'>
                                        <h4>Wallet Balance: ${walletBalance}</h4>
                                        {
                                            (isReadyToFund || isReadyToWithdraw) && <div className='mt-2 mb-2'>
                                                <input type="number" placeholder='Enter amount' className='form-control' onChange={(e) => setAmount(e.target.value)} />
                                            </div>
                                        }
                                        {
                                            !promptFundAndWithdrawal && <div>
                                                <button className='btn btn-primary' onClick={() => {
                                                    setPromptFundAndWithdrawal(true);
                                                    setIsReadyToFund(true);
                                                    setIsReadyToWithdraw(false);
                                                }}>Fund wallet</button>
                                                <button className='btn btn-info ml-2' onClick={() => {
                                                    setPromptFundAndWithdrawal(true); setIsReadyToWithdraw(true);
                                                    setIsReadyToFund(false);
                                                }}>Withdraw funds</button>
                                            </div>
                                        }

                                        {
                                            promptFundAndWithdrawal && <div>
                                                <button className='btn btn-danger mr-2' onClick={() => {
                                                    setPromptFundAndWithdrawal(false);
                                                    setIsReadyToFund(false);
                                                    setIsReadyToWithdraw(false);
                                                }}>Cancel</button>
                                                <button className='btn btn-primary' onClick={handleFundOrWithdraw}>
                                                    {
                                                        isLoading && <span className='spinner-border spinner-border-sm mr-2' role='status' aria-hidden="true"></span>
                                                    }
                                                    {isReadyToFund ? 'Pay now' : 'Withdraw'}
                                                </button>
                                            </div>
                                        }
                                    </div>

                                    <div className="d-flex justify-content-between text-center mt-5 mb-2">
                                        <div>
                                            <p className="mb-0">All Square Balance</p>
                                            <p className="mb-2 h5">$372</p>
                                        </div>
                                        <div className="px-3">
                                            <p className="mb-0">Games Won</p>
                                            <p className="mb-2 h5">14</p>
                                        </div>
                                        <div>
                                            <p className="mb-0">Total Rounds Played</p>
                                            <p className="mb-2 h5">23</p>
                                        </div>
                                    </div>
                                    <Link to="/home" className="btn btn-outline-primary btn-sm m-2">
                                        Home
                                    </Link>
                                    <button className="btn btn-outline-danger btn-sm m-2"  onClick={logoutHandler}>Logout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
};

export default ProfileCard;
