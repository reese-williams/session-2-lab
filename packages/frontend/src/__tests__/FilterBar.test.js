import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBar from '../components/FilterBar';

describe('FilterBar', () => {
  test('updates search input', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const filters = {
      search: '',
      status: 'all',
      dueState: 'all',
      sort: 'default',
      order: 'desc',
    };

    render(<FilterBar filters={filters} onChange={onChange} />);

    await user.type(screen.getByLabelText('Search title or description'), 'work');

    expect(onChange).toHaveBeenCalled();
  });
});
