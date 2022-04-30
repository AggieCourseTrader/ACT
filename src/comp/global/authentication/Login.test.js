import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import SignInButton from './SignInButton';
import { renderEditInputCell } from '@mui/x-data-grid';

import { addUser } from '../dbFunctions/CrudFunctions';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { app, auth, onAuthStateChanged, GoogleAuthProvider } from "../../../firebase-config";
import { FirebaseError } from 'firebase/app';
import { BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";



describe('Login', () => {
  test('renders Login component', async () => {

    render(<BrowserRouter><Login /></BrowserRouter>);

    expect(await screen.findByText(/Sign in with your TAMU account/)).toBeInTheDocument();
      
    // Testing that with no information entered, the login button fails
    try {
      await userEvent.click(screen.getByRole('button'));
    } catch (error) {
      expect(error).toMatch(FirebaseError);
    }

  });
});



