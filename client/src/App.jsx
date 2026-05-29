import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddReviewPage from './pages/AddReviewPage';
import OpenReviewsPage from './pages/OpenReviewsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-review/:collegeId" element={<AddReviewPage />} />
        <Route path="/reviews/:collegeId" element={<OpenReviewsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
