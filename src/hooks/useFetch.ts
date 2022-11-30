import { useLocation, useNavigate } from 'react-router-dom';

export default function useFetch() {
  const navigate = useNavigate();
  const location = useLocation();

  const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((res) => {
      if (res.status === 401) {
        navigate('/login?r=' + encodeURIComponent(location.pathname));
      }
      return res.json();
    });
  return fetcher;
}
