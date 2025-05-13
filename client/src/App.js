import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  ButtonGroup,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { supabase } from './supabaseClient';

// Create a green theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green 800
      light: '#4caf50', // Green 500
      dark: '#1b5e20', // Green 900
    },
    secondary: {
      main: '#81c784', // Green 300
    },
    background: {
      default: '#f1f8e9', // Light Green 50
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1b5e20',
    },
    h6: {
      fontWeight: 500,
      color: '#2e7d32',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#e8f5e9', // Light Green 100
          '&:hover': {
            backgroundColor: '#c8e6c9', // Light Green 200
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

const STATUS_TYPES = {
  PRESENT: 'PRESENT',
  BRW: 'BRW',
  RSO_MC: 'RSO/MC',
  OFF: 'OFF',
  LEAVE: 'LEAVE',
  DC: 'DC',
};

const PARADE_TYPES = {
  FIRST: 'FIRST PARADE',
  LAST: 'LAST PARADE',
};

function App() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [personnel, setPersonnel] = useState([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  const [statusGroups, setStatusGroups] = useState({
    [STATUS_TYPES.PRESENT]: [],
    [STATUS_TYPES.BRW]: [],
    [STATUS_TYPES.RSO_MC]: [],
    [STATUS_TYPES.OFF]: [],
    [STATUS_TYPES.LEAVE]: [],
    [STATUS_TYPES.DC]: [],
  });
  const [newPerson, setNewPerson] = useState({ name: '', status: STATUS_TYPES.PRESENT });
  const [selectedParadeType, setSelectedParadeType] = useState(PARADE_TYPES.LAST);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  useEffect(() => {
    fetchBranches();
    fetchPersonnel();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      const filtered = personnel.filter(p => p.branch === selectedBranch);
      setFilteredPersonnel(filtered);
    } else {
      setFilteredPersonnel([]);
    }
  }, [selectedBranch, personnel]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setBranches(data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setError('Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonnel = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setPersonnel(data || []);
    } catch (error) {
      console.error('Error fetching personnel:', error);
      setError('Failed to fetch personnel');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPerson = () => {
    if (newPerson.name) {
      setStatusGroups(prev => ({
        ...prev,
        [newPerson.status]: [...prev[newPerson.status], newPerson.name],
      }));
      setNewPerson({ name: '', status: STATUS_TYPES.PRESENT });
    }
  };

  const handleRemovePerson = (status, index) => {
    setStatusGroups(prev => ({
      ...prev,
      [status]: prev[status].filter((_, i) => i !== index),
    }));
  };

  const generateReport = () => {
    let reportParts = [`${selectedBranch}\n\n${selectedParadeType}\n\n`];

    Object.entries(statusGroups).forEach(([status, people]) => {
      if (people.length > 0) {
        reportParts.push(`${status}:\n${people.join('\n')}\n\n`);
      }
    });

    return reportParts.join('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateReport());
  };

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography color="error">{error}</Typography>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2 }
      }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
              Parade State Management
            </Typography>

            <Box sx={{ mb: 4 }}>
              <ButtonGroup fullWidth size={isMobile ? "small" : "medium"}>
                <Button
                  variant={selectedParadeType === PARADE_TYPES.FIRST ? "contained" : "outlined"}
                  onClick={() => setSelectedParadeType(PARADE_TYPES.FIRST)}
                >
                  First Parade
                </Button>
                <Button
                  variant={selectedParadeType === PARADE_TYPES.LAST ? "contained" : "outlined"}
                  onClick={() => setSelectedParadeType(PARADE_TYPES.LAST)}
                >
                  Last Parade
                </Button>
              </ButtonGroup>
            </Box>

            <FormControl fullWidth sx={{ mb: 4 }}>
              <InputLabel>Branch</InputLabel>
              <Select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                label="Branch"
                disabled={loading}
                size={isMobile ? "small" : "medium"}
              >
                {branches.map((branch) => (
                  <MenuItem key={branch.id} value={branch.name}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <FormControl fullWidth>
                    <InputLabel>Person Name</InputLabel>
                    <Select
                      value={newPerson.name}
                      onChange={(e) => setNewPerson(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                      label="Person Name"
                      disabled={!selectedBranch || loading}
                      size={isMobile ? "small" : "medium"}
                    >
                      {filteredPersonnel.map((person) => (
                        <MenuItem key={person.id} value={person.name}>
                          {person.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={newPerson.status}
                      onChange={(e) => setNewPerson({ ...newPerson, status: e.target.value })}
                      label="Status"
                      disabled={loading}
                      size={isMobile ? "small" : "medium"}
                    >
                      {Object.values(STATUS_TYPES).map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                variant="contained"
                onClick={handleAddPerson}
                sx={{ mt: 2 }}
                disabled={!newPerson.name || loading}
                fullWidth={isMobile}
              >
                Add Person
              </Button>
            </Box>

            {Object.entries(statusGroups).map(([status, people]) => (
              <Box key={status} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>{status}</Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  p: 1,
                  bgcolor: 'background.default',
                  borderRadius: 1
                }}>
                  {people.map((person, index) => (
                    <Chip
                      key={index}
                      label={person}
                      onDelete={() => handleRemovePerson(status, index)}
                      sx={{ 
                        m: 0.5,
                        '& .MuiChip-deleteIcon': {
                          color: 'primary.main',
                          '&:hover': {
                            color: 'primary.dark',
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ))}

            <Button
              variant="contained"
              color="primary"
              onClick={copyToClipboard}
              sx={{ 
                mt: 4,
                py: 1.5,
                width: { xs: '100%', sm: 'auto' }
              }}
              disabled={!selectedBranch || loading}
            >
              Copy {selectedParadeType} Report to Clipboard
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 