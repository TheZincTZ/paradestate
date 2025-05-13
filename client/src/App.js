import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  ButtonGroup,
  Autocomplete,
} from '@mui/material';
import { supabase } from './supabaseClient';

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
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Parade State Management
        </Typography>

        <Box sx={{ mb: 3 }}>
          <ButtonGroup fullWidth>
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

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Branch</InputLabel>
          <Select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            label="Branch"
            disabled={loading}
          >
            {branches.map((branch) => (
              <MenuItem key={branch.id} value={branch.name}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Autocomplete
                options={filteredPersonnel}
                getOptionLabel={(option) => option.name}
                value={newPerson.name ? filteredPersonnel.find(p => p.name === newPerson.name) : null}
                onChange={(event, newValue) => {
                  setNewPerson(prev => ({
                    ...prev,
                    name: newValue ? newValue.name : '',
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Person Name"
                    fullWidth
                    disabled={!selectedBranch || loading}
                  />
                )}
                disabled={!selectedBranch || loading}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newPerson.status}
                  onChange={(e) => setNewPerson({ ...newPerson, status: e.target.value })}
                  label="Status"
                  disabled={loading}
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
          >
            Add Person
          </Button>
        </Box>

        {Object.entries(statusGroups).map(([status, people]) => (
          <Box key={status} sx={{ mb: 2 }}>
            <Typography variant="h6">{status}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {people.map((person, index) => (
                <Chip
                  key={index}
                  label={person}
                  onDelete={() => handleRemovePerson(status, index)}
                />
              ))}
            </Box>
          </Box>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={copyToClipboard}
          sx={{ mt: 3 }}
          disabled={!selectedBranch || loading}
        >
          Copy {selectedParadeType} Report to Clipboard
        </Button>
      </Paper>
    </Container>
  );
}

export default App; 