import React from 'react';
import { Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';

function SortControl({ filters, onChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Sort
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField select name="sort" label="Sort by" value={filters.sort} onChange={handleChange}>
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="dueDate">Due date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="createdAt">Created date</MenuItem>
          </TextField>
          <TextField
            select
            name="order"
            label="Order"
            value={filters.order}
            onChange={handleChange}
            disabled={filters.sort === 'default'}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </TextField>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SortControl;
