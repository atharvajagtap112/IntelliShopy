


import CustomerRouters from './Routers/CustomerRouters';
import ScrollToTop from './customer/components/ScrollToTop';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
  <div className="App">
    
        <ScrollToTop /> {/* 👈 Add this here */}
        
        <Routes>
          <Route path="/*" element={<CustomerRouters />} />
        </Routes>
        <ToastContainer
         position="top-right" autoClose={3000} />
    </div>
   
   
   
  );
}

export default App;   
