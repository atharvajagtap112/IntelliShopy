import { Route, Routes } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import CustomerRouters from './Routers/CustomerRouters';
import ScrollToTop from './customer/components/ScrollToTop';
import { ToastContainer } from 'react-toastify';

function App() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="App">
      {/* Reading-progress hairline across the top of the page */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-accent-500"
      />

      <ScrollToTop />

      <Routes>
        <Route path="/*" element={<CustomerRouters />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
