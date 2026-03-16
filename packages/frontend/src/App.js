import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container, Divider, Stack, Typography } from '@mui/material';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import SortControl from './components/SortControl';
import BulkActions from './components/BulkActions';
import ConfirmDialog from './components/ConfirmDialog';
import FeedbackSnackbar from './components/FeedbackSnackbar';
import {
  clearCompleted,
  completeVisible,
  createTask,
  deleteTask,
  duplicateTask,
  fetchTasks,
  updateTask,
} from './api/tasksApi';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dueState: 'all',
    sort: 'default',
    order: 'desc',
  });
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, task: null });
  const [confirmClearCompleted, setConfirmClearCompleted] = useState(false);

  const openFeedback = useCallback((message, severity = 'success') => {
    setFeedback({ open: true, message, severity });
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);

    try {
      const result = await fetchTasks(filters);
      setTasks(result);
    } catch (err) {
      openFeedback(`Failed to fetch tasks: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, openFeedback]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (payload) => {
    setLoading(true);

    try {
      await createTask(payload);
      openFeedback('Task created successfully');
      await loadTasks();
    } catch (err) {
      openFeedback(`Error creating task: ${err.message}`, 'error');
      setLoading(false);
    }
  };

  const handleUpdate = async (taskId, payload) => {
    setLoading(true);

    try {
      await updateTask(taskId, payload);
      openFeedback('Task updated successfully');
      await loadTasks();
    } catch (err) {
      openFeedback(`Error updating task: ${err.message}`, 'error');
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    await handleUpdate(task.id, { completed: !task.completed });
  };

  const handleDuplicate = async (taskId) => {
    setLoading(true);

    try {
      await duplicateTask(taskId);
      openFeedback('Task duplicated successfully');
      await loadTasks();
    } catch (err) {
      openFeedback(`Error duplicating task: ${err.message}`, 'error');
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.task) {
      return;
    }

    setLoading(true);

    try {
      await deleteTask(confirmDelete.task.id);
      setConfirmDelete({ open: false, task: null });
      openFeedback('Task deleted successfully');
      await loadTasks();
    } catch (err) {
      openFeedback(`Error deleting task: ${err.message}`, 'error');
      setLoading(false);
    }
  };

  const handleCompleteVisible = async () => {
    setLoading(true);

    try {
      const result = await completeVisible(filters);
      openFeedback(`Marked ${result.updatedCount} visible task(s) completed`);
      await loadTasks();
    } catch (err) {
      openFeedback(`Error completing visible tasks: ${err.message}`, 'error');
      setLoading(false);
    }
  };

  const handleClearCompleted = async () => {
    setLoading(true);

    try {
      const result = await clearCompleted();
      setConfirmClearCompleted(false);
      openFeedback(`Cleared ${result.deletedCount} completed task(s)`);
      await loadTasks();
    } catch (err) {
      openFeedback(`Error clearing completed tasks: ${err.message}`, 'error');
      setLoading(false);
    }
  };

  const activeCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={2.5}>
        <header>
          <Typography variant="h4" component="h1">
            Task Planner
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Active: {activeCount} | Completed: {completedCount}
          </Typography>
        </header>

        <TaskForm onCreate={handleCreate} loading={loading} />
        <FilterBar filters={filters} onChange={setFilters} />
        <SortControl filters={filters} onChange={setFilters} />
        <BulkActions
          onCompleteVisible={handleCompleteVisible}
          onClearCompleted={() => setConfirmClearCompleted(true)}
          loading={loading}
        />

        <Divider />

        <Typography variant="h6" component="h2">
          Tasks
        </Typography>
        {loading ? (
          <Typography variant="body1">Loading tasks...</Typography>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDelete={(task) => setConfirmDelete({ open: true, task })}
            onDuplicate={handleDuplicate}
            onUpdate={handleUpdate}
            loading={loading}
          />
        )}
      </Stack>

      <ConfirmDialog
        open={confirmDelete.open}
        title="Delete task"
        description={
          confirmDelete.task
            ? `Are you sure you want to delete "${confirmDelete.task.title}"?`
            : 'Are you sure you want to delete this task?'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ open: false, task: null })}
        confirmText="Delete"
      />

      <ConfirmDialog
        open={confirmClearCompleted}
        title="Clear completed tasks"
        description="This action permanently removes all completed tasks."
        onConfirm={handleClearCompleted}
        onCancel={() => setConfirmClearCompleted(false)}
        confirmText="Clear all"
      />

      <FeedbackSnackbar
        open={feedback.open}
        severity={feedback.severity}
        message={feedback.message}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
      />
    </Container>
  );
}

export default App;