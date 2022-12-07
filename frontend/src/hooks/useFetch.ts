import { Message } from '@arco-design/web-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function useFetch(auth = true) {
  const navigate = useNavigate();
  const location = useLocation();

  const fetcher = (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (auth && res.status === 401) {
        navigate('/login?r=' + encodeURIComponent(location.pathname));
        return;
      }
      if (res.status >= 400) {
        try {
          res.json().then((obj) => {
            Message.error(obj.message || 'request failed');
          });
        } catch {
          Message.error('request failed');
        }
        throw res;
      }
      try {
        return res.json();
      } catch {
        return res.text();
      }
    }).catch(e => {
      console.error(e);
      if (!e.status) {
        Message.error('request failed');
      }
      throw e
    });
  return fetcher;
}
