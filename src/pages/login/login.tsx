import { Box, Button, Card, useTheme } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { LoginContainer } from './login.style';

export default function LoginPage() {
  function onGitHubLogin() {
    window.location.href = '/api/login/github';
  }
  const theme = useTheme();

  return (
    <LoginContainer>
      <Box
        sx={{
          p: 4,
          border: '1px solid grey',
          borderRadius: 2,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={onGitHubLogin}
          startIcon={<GitHub />}
        >
          Sign In with GitHub
        </Button>
      </Box>
    </LoginContainer>
  );
}
