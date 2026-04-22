import { Routes, Route } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Orders from './pages/Orders';

function App() {
  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/orders" 
            element={
              <SignedIn>
                <Orders />
              </SignedIn>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
