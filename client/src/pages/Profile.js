import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, TextField, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';

const Profile = () => {
  const { currentUser, generateApiKey } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCopyApiKey = () => {
    if (currentUser?.apiKey) {
      navigator.clipboard.writeText(currentUser.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleGenerateApiKey = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await generateApiKey();
      setSuccess('New API key generated successfully!');
    } catch (error) {
      setError('Failed to generate new API key. Please try again.');
      console.error('Error generating API key:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              User Information
            </Typography>
            
            {currentUser && (
              <Box>
                {currentUser.avatarUrl && (
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.displayName || currentUser.username} 
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }} 
                    />
                  </Box>
                )}
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Username:</strong> {currentUser.username}
                </Typography>
                
                {currentUser.displayName && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Display Name:</strong> {currentUser.displayName}
                  </Typography>
                )}
                
                {currentUser.email && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {currentUser.email}
                  </Typography>
                )}
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>GitHub ID:</strong> {currentUser.githubId}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              API Key
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              Use this API key with SpiceCode CLI to send metrics to your dashboard.
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={currentUser?.apiKey || 'No API key generated yet'}
                InputProps={{
                  readOnly: true,
                  endAdornment: currentUser?.apiKey && (
                    <Button 
                      onClick={handleCopyApiKey}
                      startIcon={<ContentCopyIcon />}
                      color={copied ? "success" : "primary"}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  )
                }}
              />
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleGenerateApiKey}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Generate New API Key"}
            </Button>
            
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              Note: Generating a new API key will invalidate your previous key.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              SpiceCode CLI Integration
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              To use SpiceCode CLI with this dashboard:
            </Typography>
            
            <ol>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Install SpiceCode CLI from <a href="https://github.com/spicecodecli/spicecode" target="_blank" rel="noopener noreferrer">GitHub</a>
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Configure SpiceCode CLI with your API key
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Run SpiceCode CLI on your project files
                </Typography>
              </li>
              <li>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  View your metrics in the dashboard
                </Typography>
              </li>
            </ol>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              Example command:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5', mt: 1 }}>
              <code>spicecode analyze --api-key {currentUser?.apiKey || 'YOUR_API_KEY'} --project my-project path/to/file.js</code>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
