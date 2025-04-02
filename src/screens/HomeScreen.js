import React from 'react';
import useAuthStore from '../store/authStore';
import GuardScreen from './GuardScreen';
import StudentScreen from './StudentScreen';
import VehicleScreen from './Vehicle/VehicleScreen';
import EmployeeScreen from './EmployeeScreen';

const HomeScreen = () => {
    const { userInfo } = useAuthStore();

    if (!userInfo) {
        return null;
    }

    if (userInfo.role === 'student') {
        return <StudentScreen />;
    }

    if (userInfo.role === 'employee') {
        return <EmployeeScreen />;
    }


    if (userInfo.role === 'guard') {
        return <GuardScreen />;
    }

    return null;
};

export default HomeScreen;
// import React from 'react'
// import { Text, View } from 'react-native'
// import useAuthStore from '../store/authStore';

// export default function HomeScreen() {

//     const { userInfo } = useAuthStore();

//     console.log("userInfo", userInfo)

//     return (
//         <View>
//             <Text>HomeScreen</Text>
//         </View>
//     )
// }
