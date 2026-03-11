import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerMenu } from './components/CustomerMenu';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The dynamic :restaurant_id parameter extracts the target restaurant */}
        <Route path="/ar/:restaurant_id" element={<CustomerMenu />} />
        
        {/* Fallback route for 404s */}
        <Route path="*" element={<div>Restaurant not found.</div>} />
      </Routes>
    </BrowserRouter>
  );
}