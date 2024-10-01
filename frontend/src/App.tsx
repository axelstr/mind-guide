import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Box,
  CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const [patientRecord, setPatientRecord] = useState<string>('');
  const [providerInput, setProviderInput] = useState<string>('');
  const [estimation, setEstimation] = useState<string>('');
  const [plan, setPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        setPatientRecord(typeof text === 'string' ? text : '');
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientRecord, providerInput }),
      });
      const data = await response.json();
      setEstimation(data.estimation);
      setPlan(data.plan);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Mind-Guide</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <input
                accept=".txt"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                  Upload Patient Record
                </Button>
              </label>
              {patientRecord && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  File uploaded: {patientRecord.slice(0, 20)}...
                </Typography>
              )}
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Provider Input"
              value={providerInput}
              onChange={(e) => setProviderInput(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Process'}
            </Button>
          </form>
        </Paper>
        
        {estimation && (
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Estimation</Typography>
            <Typography variant="body1">{estimation}</Typography>
          </Paper>
        )}
        
        {plan && (
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Plan</Typography>
            <Typography variant="body1">{plan}</Typography>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;