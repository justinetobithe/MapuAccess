import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';

export default function App() {

    useEffect(() => {
        LogBox.ignoreLogs([
            'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.'
        ]);
    }, []);

    return (
        <AuthProvider>
            <NativeBaseProvider>
                <Navigation />
            </NativeBaseProvider>
        </AuthProvider>
    );
}
