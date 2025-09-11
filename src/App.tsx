// // App.tsx
// import React from 'react';
// import HomePage from './pages/HomePage/HomePage.tsx';
// import './App.css';
//
// const App: React.FC = () => {
//     return (
//         <div>
//             <HomePage />
//         </div>
//     );
// };
//
// export default App;

// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import PrintablePage from './pages/PrintablePage/PrintablePage';
import './App.css';

const App: React.FC = () => {
    return (
        <Router basename="/resume-react">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/print" element={<PrintablePage />} />
            </Routes>
        </Router>
    );
};

export default App;