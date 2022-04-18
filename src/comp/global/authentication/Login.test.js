import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import SignInButton from './SignInButton';
import { renderEditInputCell } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../dbFunctions/CrudFunctions';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { app, auth, onAuthStateChanged, GoogleAuthProvider } from "../../../firebase-config";
import { FirebaseError } from 'firebase/app';



const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actualNav = jest.requireActual('react-router-dom');
  return {
    ...actualNav,
    useNavigate: () => mockedNavigate,
  };
});




describe('Login', () => {
  test('renders Login component', async () => {

    render(<Login />);

    expect(await screen.getByText('Sign In with your tamu account')).toBeInTheDocument();
      
    // Testing that with no information entered, the login button fails
    try {
      await userEvent.click(screen.getByRole('button'));
    } catch (error) {
      expect(error).toMatch(FirebaseError);
    }
    

  });
});



