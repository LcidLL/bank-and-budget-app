import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Bank from './components/bank/bank.jsx';
import BudgetPage from './pages/Budget.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Bank />} />
          <Route path="/budget" element={<BudgetPage />} />
        </Routes>
      </BrowserRouter>
    </div>
    
  );
}

export default App;
