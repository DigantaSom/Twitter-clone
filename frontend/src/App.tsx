import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Feed from './components/Feed';
import Explore from './components/Explore';

const App = () => {
  const isAuthenticated = false; // TODO: dynamic

  return (
    <Routes>
      <Route path='/' element={<HomePage />}>
        <Route index element={isAuthenticated ? <Feed /> : <Explore />} />
      </Route>
    </Routes>
  );
};

export default App;
