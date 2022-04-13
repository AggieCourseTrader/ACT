
import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './Login';
import { renderEditInputCell } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

/*
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));
*/

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actualNav = jest.requireActual('react-router-dom');
  return {
    ...actualNav,
    useNavigate: () => mockedNavigate,
  };
});



describe('Login', () => {
  test('renders Login component', () => {

    render(<Login />);

    //expect(screen.getByText('Search:')).toBeInTheDocument();

    //expect(screen.getByText('Sign In with your tamu account')).toBeInTheDocument();
  });
});



