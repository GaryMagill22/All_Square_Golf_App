import { useContext, createContext } from 'react';


// Making empty context
const AppContext = createContext(null);
// wrapper hook to access the context
export const useAppContext = () => useContext(AppContext);
// Exporting the context to use throughout app
export default AppContext;