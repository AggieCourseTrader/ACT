
import React from 'react';
import { render, screen } from '@testing-library/react';
import MyTrades from './MyTrades';
import { renderEditInputCell } from '@mui/x-data-grid';

import { useNavigate } from "react-router-dom";

import { BrowserRouter, Routes, Route,} from "react-router-dom";


const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: mockEnqueue
    };
  }
}));


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => {
const actualNav = jest.requireActual('react-router-dom');
return {
    ...actualNav,
    useNavigate: () => mockedNavigate,
};
});


test('renders MyTrades component', async () => {

    render(<BrowserRouter><MyTrades /></BrowserRouter>);

    // Checks for text rendering
    expect(await screen.findByText(/My Listings/)).toBeInTheDocument();
    expect(await screen.findByText(/My Matches/)).toBeInTheDocument();

});







