import React from 'react';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';

function BulkActions({ onCompleteVisible, onClearCompleted, loading }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Bulk Actions
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="outlined" onClick={onCompleteVisible} disabled={loading}>
            Mark Visible Completed
          </Button>
          <Button color="error" variant="outlined" onClick={onClearCompleted} disabled={loading}>
            Clear Completed
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default BulkActions;
