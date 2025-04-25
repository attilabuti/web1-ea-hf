import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate  } from 'react-router-dom';

import Todo from './Todo';
import Pomodoro from './Pomodoro';

function App() {
    return (
        <Router>
            <header>
                <h1>WEB-programozás I. - Előadás Házi feladat</h1>

                <nav>
                    <ul>
                        <li><NavLink to="/app/todo" end>TODO</NavLink></li>
                        <li><NavLink to="/app/pomodoro">Pomodoro</NavLink></li>
                    </ul>
                </nav>
            </header>

            <div className="wrapper">
                <main>
                    <Routes>
                        <Route path="/app/" element={<Navigate to="/app/todo" replace />} />
                        <Route path="/app/todo" element={<Todo />} />
                        <Route path="/app/pomodoro" element={<Pomodoro />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
