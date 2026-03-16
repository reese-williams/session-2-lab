import React from 'react';
import { Alert, Snackbar } from '@mui/material';

function FeedbackSnackbar({ open, severity = 'success', message, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3500}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default FeedbackSnackbar;
