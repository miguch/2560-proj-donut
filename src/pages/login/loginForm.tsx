import { Button } from '@arco-design/web-react';

import { IconGithub } from '@arco-design/web-react/icon';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginTitle } from './login.style';

interface LoginFormProps {
  isPage?: boolean;
  onLogin?: (() => void) | undefined;
}

export default function LoginForm({ isPage = false, onLogin }: LoginFormProps) {
  const { search } = useLocation();
  
  function onGitHubLogin() {
    window.location.href = '/api/login/github' + location.search;
  }

  return (
    <>
      <LoginTitle>CourseNet</LoginTitle>
      <Button type="primary" onClick={onGitHubLogin} icon={<IconGithub />}>
        Sign In with GitHub
      </Button>
    </>
  );
}
