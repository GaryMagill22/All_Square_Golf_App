import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const ProfileCard = () => {
    return (
        <div>
            <section className="vh-100" style={{ backgroundColor: '#eee' }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-12 col-xl-4">
                            <div className="card" style={{ borderRadius: '15px' }}>
                                <div className="card-body text-center">
                                    <div className="mt-3 mb-4">


                                        <img
                                            src=""
                                            alt="logo"
                                            style={{ width: '100px' }}
                                        />
                                    </div>
                                    <h4 className="mb-2">Gary Magill</h4>
                                    <p className="text-muted mb-4">
                                        <a><span className="mx-2">|</span>garymagill22@gmail.com</a>
                                    </p>
                                    <div className="mb-4 pb-2">
                                        <p>Handicap: 7.4</p>
                                        <p>Payments | PayPal, Venmo, AppleCash </p>
                                        <p>Righty <span>|</span> Lefty</p>
                                        <p>Home Course</p>
                                        <p>Omni Interlocken Golf Club, Superior Colorado</p>
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
