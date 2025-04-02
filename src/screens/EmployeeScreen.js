import React, { useState, useEffect } from "react";
import { Box, Text, VStack, HStack, Avatar, Button, Icon, Image, Center } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import dateFormat from "dateformat";
import useAuthStore from "../store/authStore";

export default function EmployeeScreen() {
    const { userInfo } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = dateFormat(currentTime, "hh:MM TT");
    const formattedDate = dateFormat(currentTime, "dddd, mmmm d, yyyy");

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <Box flex={1} bg="gray.100">
            <Center mt={2}>
                <Image
                    source={require('../assets/img/logo.png')}
                    alt="Mapúa University"
                    width="200"
                    height="200"
                    resizeMode="contain"
                />
            </Center>

            <Box p={5}>
                <Text fontSize="xl" fontWeight="bold" color="gray.700">{getGreeting()}, {userInfo?.first_name + " " + userInfo?.last_name} 👋</Text>
                <Text fontSize="md" color="gray.500">{formattedDate}</Text>
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">{formattedTime}</Text>

                <HStack space={4} mt={5} alignItems="center">
                    <Avatar source={require('../assets/img/avatar.png')} size="lg" />
                    <VStack>
                        <Text fontSize="lg" fontWeight="bold"> {userInfo?.first_name + " " + userInfo?.last_name}</Text>
                        <Text fontSize="md" color="gray.500">Professor | IT Department</Text>
                    </VStack>
                </HStack>

                <HStack space={3} mt={8} justifyContent="space-between">
                    <Button flex={1} leftIcon={<Icon as={Ionicons} name="calendar" size="md" />} colorScheme="blue">
                        Schedule
                    </Button>
                    <Button flex={1} leftIcon={<Icon as={Ionicons} name="time" size="md" />} colorScheme="red">
                        Attendance
                    </Button>
                </HStack>
                <HStack space={3} mt={3} justifyContent="space-between">
                    <Button flex={1} leftIcon={<Icon as={Ionicons} name="megaphone" size="md" />} colorScheme="green">
                        Announcements
                    </Button>
                    <Button flex={1} leftIcon={<Icon as={Ionicons} name="document-text" size="md" />} colorScheme="purple">
                        Reports
                    </Button>
                </HStack>

                <HStack mt={5} justifyContent="center">
                    <Button colorScheme="orange" onPress={sendTestNotification}>
                        Test Push Notification
                    </Button>
                </HStack>

            </Box>
        </Box>
    );
}
