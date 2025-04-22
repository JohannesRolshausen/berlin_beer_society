import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPostDetail from './pages/BlogPostDetail';
import TastingsPage from './pages/TastingsPage';
import TerminePage from './pages/TerminePage';
import TerminDetailPage from './pages/TerminDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ImpressumPage from './pages/ImpressumPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:id" element={<BlogPostDetail />} />
          <Route path="tastings" element={<TastingsPage />} />
          <Route path="termine" element={<TerminePage />} />
          <Route path="termine/:id" element={<TerminDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="impressum" element={<ImpressumPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
