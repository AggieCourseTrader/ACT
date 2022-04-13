import { createContext } from 'react';

const TermsContext = createContext(false);

export const TermsProvider = TermsContext.Provider;

export default TermsContext;