import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ReadingLevel from './pages/ReadingLevel';
import TimeBubbleFrame from './pages/TimeBubbleFrame';
import TBRShelf from './pages/TBRShelf';
import ReadShelf from './pages/ReadShelf';
import BookSetup from './pages/BookSetup';
import SearchComponent from './pages/SearchComponent';
import BookSelectionWheel from './pages/BookSelectionWheel';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = () => {
        setLoggedIn(true);
    };

    const handleLogout = () => {
        setLoggedIn(false);
    };

    return (
        <div>
            <Routes>
                {/* Public Routes */}
                {!loggedIn && (
                    <>
                        <Route path="/" element={<Login onLogin={handleLogin} />} />
                        <Route path="/createaccount" element={<CreateAccount onAccountCreated={() => <Navigate to="/" />} />} />
                    </>
                )}
                {/* Protected Routes */}
                {loggedIn && (
                    <>
                        <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
                        <Route path="/readinglevel" element={<ReadingLevel />} />
                        <Route path="/timebubbleframe" element={<TimeBubbleFrame />} />
                        <Route path="/tbrshelf" element={<TBRShelf />} />
                        <Route path="/readshelf" element={<ReadShelf />} />
                        <Route path="/booksetup" element={<BookSetup />} />
                        <Route path="/searchcomponent" element={<SearchComponent />} />
                        <Route path="/bookselectionwheel" element={<BookSelectionWheel />} />
                    </>
                )}
                {/* Redirect unmatched routes */}
                <Route path="*" element={<Navigate to={loggedIn ? "/dashboard" : "/"} />} />
            </Routes>
        </div>
    );
}

export default App;
