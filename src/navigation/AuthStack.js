import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import DrawerStack from './DrawerStack';
import useAuthStore from '../store/authStore';
import AddVehicleScreen from '../screens/Vehicle/AddVehicleScreen';
import QRScreen from '../screens/QRScreen';
import RecordScreen from '../screens/RecordScreen';

const Stack = createStackNavigator();

export default function AuthStack() {

    const { userInfo } = useAuthStore();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeScreen"
                component={DrawerStack}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddVehicleScreen"
                component={AddVehicleScreen}
                options={{
                    title: "Add Vehicle",
                    drawerIcon: ({ color }) => (
                        <Ionicons name="book-outline" size={22} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: "#EC1F28",
                    },
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    headerTintColor: "#fff",

                }}
            />
            <Stack.Screen
                name="QRScreen"
                component={QRScreen}
                options={{
                    title: "Show QR",
                    drawerIcon: ({ color }) => (
                        <Ionicons name="book-outline" size={22} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: "#EC1F28",
                    },
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    headerTintColor: "#fff",

                }}
            />
            <Stack.Screen
                name="RecordScreen"
                component={RecordScreen}
                options={{
                    title: "Records",
                    drawerIcon: ({ color }) => (
                        <Ionicons name="book-outline" size={22} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: "#EC1F28",
                    },
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    headerTintColor: "#fff",
                }}
            />
        </Stack.Navigator>
    )
}
