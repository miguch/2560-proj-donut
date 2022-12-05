import { LoginContainer, LoginInner, LoginTitle } from './login.style';
import LoginForm from './loginForm';

export default function LoginPage() {

  return (
    <LoginContainer>
      <LoginInner>
        <LoginForm></LoginForm>
      </LoginInner>
    </LoginContainer>
  );
}
