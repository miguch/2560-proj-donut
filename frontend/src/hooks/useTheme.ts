import { Theme } from '@emotion/react';
import { useEffect, useState } from 'react';

export default function useTheme() {
  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      // check system dark mode
      document.body.setAttribute('arco-theme', 'dark');
    }
    const themeListener = (event: MediaQueryListEvent) => {
      if (event.matches) {
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        document.body.removeAttribute('arco-theme');
      }
    };

    // listen for system dark mode changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', themeListener);

    return () =>
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', themeListener);
  }, []);
}
