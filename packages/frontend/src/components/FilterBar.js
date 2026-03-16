import React from 'react';
import { Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';

function FilterBar({ filters, onChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Find and Filter
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            name="search"
            label="Search title or description"
            value={filters.search}
            onChange={handleChange}
          />
          <TextField select name="status" label="Status" value={filters.status} onChange={handleChange}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
          <TextField select name="dueState" label="Due state" value={filters.dueState} onChange={handleChange}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
            <MenuItem value="today">Due today</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="none">No due date</MenuItem>
          </TextField>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default FilterBar;
