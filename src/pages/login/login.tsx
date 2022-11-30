// import { GitHub } from '@mui/icons-material';
import { Button } from '@arco-design/web-react';
import { LoginContainer, LoginInner, LoginTitle } from './login.style';
import { IconGithub } from '@arco-design/web-react/icon';

export default function LoginPage() {
  function onGitHubLogin() {
    window.location.href = '/api/login/github';
  }

  return (
    <LoginContainer>
      <LoginInner>
        <LoginTitle>CourseNet</LoginTitle>
        <Button type="primary" onClick={onGitHubLogin} icon={<IconGithub />}>
          Sign In with GitHub
        </Button>
      </LoginInner>
    </LoginContainer>
  );
}
