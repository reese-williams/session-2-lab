import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  test('shows validation when title is empty', async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn();

    render(<TaskForm onCreate={onCreate} loading={false} />);

    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
  });

  test('submits valid form', async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn().mockResolvedValue(undefined);

    render(<TaskForm onCreate={onCreate} loading={false} />);

    await user.type(screen.getByRole('textbox', { name: /task title/i }), 'Write tests');
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Write tests',
      })
    );
  });
});
