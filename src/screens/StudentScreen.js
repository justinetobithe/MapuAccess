import React, { useEffect, useState } from "react";
import { Box, Text, VStack, HStack, Avatar, Button, Icon, Image, Center } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import dateFormat from "dateformat";
import useAuthStore from "../store/authStore";

export default function StudentScreen() {
    const { userInfo } = useAuthStore();
    const [currentTime, setCurrentTime] = useState(new Date());

    console.log("userInfo ", userInfo)

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
                    alt="University Logo"
                    width="180"
                    height="180"
                    resizeMode="contain"
                />
            </Center>

            <Box p={5}>
                <Text fontSize="xl" fontWeight="bold" color="gray.700">
                    {getGreeting()}, {userInfo?.first_name + " " + userInfo?.last_name} 👋
                </Text>
                <Text fontSize="md" color="gray.500">{formattedDate}</Text>
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">{formattedTime}</Text>

                <Box bg="white" shadow={2} borderRadius="md" p={4} mt={4}>
                    <HStack space={4} alignItems="center">
                        <Avatar source={require('../assets/img/avatar.png')} size="lg" />
                        <VStack>
                            <Text fontSize="lg" fontWeight="bold">{userInfo?.first_name + " " + userInfo?.last_name}</Text>
                            <Text fontSize="md" color="gray.500">Student | {userInfo?.student?.student_no || "N/A"}</Text>
                        </VStack>
                    </HStack>
                </Box>

                <VStack space={4} mt={5}>
                    <Button leftIcon={<Icon as={Ionicons} name="calendar" size="md" />} colorScheme="blue">
                        View Schedule
                    </Button>
                    <Button leftIcon={<Icon as={Ionicons} name="book" size="md" />} colorScheme="red">
                        Assignments
                    </Button>
                    <Button leftIcon={<Icon as={Ionicons} name="megaphone" size="md" />} colorScheme="green">
                        Announcements
                    </Button>
                    <Button leftIcon={<Icon as={Ionicons} name="document-text" size="md" />} colorScheme="purple">
                        Grades & Reports
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
}
