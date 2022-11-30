import { createContext, useMemo, useState } from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import ColorModeContext from './context/colorMode';

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(
    window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  );
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <div className="App">
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline></CssBaseline>
          <RouterProvider router={router}></RouterProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </div>
  );
}

export default App;
