
import React from 'react';
import { render, screen } from '@testing-library/react';
import Marketplace from './Marketplace';
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



/*
const mockedUsedNavigate = jest.fn();
const mockedUseHref = jest.fn();


jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));



jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHref(): () => mockedUseHref,
 }));
 */


/*
const mockedUseHref = jest.fn();

jest.mock('react-router-dom', () => {
const actualHref = jest.requireActual('react-router-dom');
return {
    ...actualHref,
    useHref: () => ({
        Href: mockedUseHref,
    }),
};
});
*/


test('renders Marketplace component', async () => {

  render(<BrowserRouter><Marketplace /></BrowserRouter>)

  // Checks for text fields/dropdowns  
  expect(await screen.findAllByText(/Search a course/)).toHaveLength(4);
  expect(await screen.findAllByText(/Select a section/)).toHaveLength(4);

  // Checks for buttons
  expect(await screen.findAllByText(/Trade/)).toHaveLength(5);
  expect(await screen.findByText(/Create Trade/)).toBeInTheDocument();
  

});







