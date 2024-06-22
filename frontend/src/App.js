import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import './App.css';
import Error from './components/Error';
import { ToastContainer } from 'react-toastify';
import Home from './screens/Home';

function App() {
  return (
    <section>
      <div className="flex flex-col min-h-screen">
      <ToastContainer/>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<Error />} />
          </Routes>
        </main>
      </div>
    </section>
  );
}

export default App;