import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            SpiceCode Dashboard
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            Monitor and analyze your code quality metrics with SpiceCode Dashboard
          </Typography>
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<GitHubIcon />}
            onClick={login}
            sx={{ mt: 2 }}
          >
            Sign in with GitHub
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
