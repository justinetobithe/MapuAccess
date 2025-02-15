import React from 'react';
import useAuthStore from '../store/authStore';
import GuardScreen from './GuardScreen';
import StudentScreen from './StudentScreen';

const HomeScreen = () => {
    const { userInfo } = useAuthStore();

    if (!userInfo) {
        return null;
    }

    if (userInfo.role === 'student') {
        return <StudentScreen />;
    }

    if (userInfo.role === 'guard') {
        return <GuardScreen />;
    }

    return null;
};

export default HomeScreen;
