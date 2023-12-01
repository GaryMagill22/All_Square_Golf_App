import { useContext, createContext, useState } from 'react';


// Creating empty context
const AppContext = createContext(null);


// Context Provider Component
export const AppContextProvider = ({ children }) => {
    // State for userInputCourse
    const [userInputCourse, setUserInputCourse] = useState('');

    // The value provided to the context consumers
    const contextValue = {
        userInputCourse,
        setUserInputCourse,
    };

    return (
        <AppContextProvider value={contextValue}>
            {children}
        </AppContextProvider>
    );
};

// wrapper hook to access the context
export const useAppContext = () => useContext(AppContext);


// Exporting the context to use throughout app
export default AppContext;