import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AppDrawer from '../components/AppDrawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { TouchableOpacity, Alert } from 'react-native';
import useAuthStore from '../store/authStore';
import VehicleScreen from '../screens/Vehicle/VehicleScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function DrawerStack({ navigation }) {

    const { userInfo } = useAuthStore();

    return (
        <Drawer.Navigator
            drawerContent={props => <AppDrawer {...props} />}
            initialRouteName="Home"
            screenOptions={{
                drawerActiveBackgroundColor: '#EC1F28',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#333',
                drawerLabelStyle: {
                    marginLeft: -25,
                    fontFamily: 'Roboto-Medium',
                    fontSize: 15,
                },
            }}>
            <Drawer.Screen
                name="Home Screen"
                component={HomeScreen}
                options={{
                    title: "Home",
                    drawerIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={22} color={color} />
                    ),
                    headerStyle: {
                        backgroundColor: '#EC1F28',
                    },
                    headerTitleStyle: {
                        color: '#fff',
                    },
                    headerTintColor: "#fff",
                }}
            />
            {
                userInfo.role != "guard" && (
                    <Drawer.Screen
                        name="VehicleScreen"
                        component={VehicleScreen}
                        options={{
                            title: "Vehicle",
                            drawerIcon: ({ color }) => (
                                <Ionicons name="car-sport" size={22} color={color} />
                            ),
                            headerStyle: {
                                backgroundColor: '#EC1F28',
                            },
                            headerTitleStyle: {
                                color: '#fff',
                            },
                            headerTintColor: "#fff",
                            headerRight: () => (
                                <TouchableOpacity onPress={() => navigation.navigate("AddVehicleScreen")}>
                                    <Ionicons name="add" size={22} color="#fff" />
                                </TouchableOpacity>
                            ),

                        }}
                    />

                )
            }

        </Drawer.Navigator>
    );
}
