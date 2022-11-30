import { createContext, useMemo, useState } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import useTheme from './hooks/useTheme';

import "@arco-design/web-react/dist/css/index.less";

function App() {
  useTheme();

  return (
    <div className="App">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
