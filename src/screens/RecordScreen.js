import React, { useEffect, useState, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { Box, FlatList, VStack, HStack, Text, Spinner, Center, Divider, Avatar, Heading } from 'native-base';
import useAuthStore from '../store/authStore';
import Ionicons from "react-native-vector-icons/Ionicons";
import useRecordStore from '../store/recordStore';

const RecordScreen = ({ route }) => {
    const { vehicleId } = route.params || {};

    console.log("vehicleId ", vehicleId);
    const { userInfo } = useAuthStore();
    const { records, showRecordsWithVehicleId, isLoading, error } = useRecordStore();

    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (vehicleId) {
            showRecordsWithVehicleId(vehicleId);
        }
    }, [vehicleId]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        if (vehicleId) {
            await showRecordsWithVehicleId(vehicleId);
        }
        setRefreshing(false);
    }, [vehicleId]);

    console.log("records ", records);

    const renderItem = ({ item }) => {
        const formattedDate = new Date(item.recorded_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const recordType = item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Unknown';
        const iconColor = item.type === "entry" ? "blue.500" : "red.500";

        const vehicle = item.vehicle_registration?.vehicle || {};
        const { make = "Unknown", model = "Unknown", plate_number = "Unknown" } = vehicle;

        return (
            <Box bg="white" borderRadius="lg" shadow={2} p={4} mb={4} mx={2}>
                <HStack justifyContent="space-between" alignItems="center">
                    <Avatar bg={iconColor} size="md">
                        <Ionicons name="car" size={22} color="#fff" />
                    </Avatar>

                    <VStack flex={1} ml={4} alignItems="center">
                        <Heading size="md">{formattedDate}</Heading>
                    </VStack>

                    <VStack alignItems="flex-end">
                        <Text fontSize="md" bold color={iconColor}>{recordType}</Text>
                    </VStack>
                </HStack>

                <Divider mt={4} />

                <VStack mt={2}>
                    <Text fontSize="md" bold>{make} {model}</Text>
                    <Text fontSize="sm" color="gray.500">Plate: {plate_number}</Text>
                </VStack>

                {/* Created Date */}
                <Text fontSize="xs" color="gray.400" mt={2}>
                    Created: {new Date(item.created_at).toLocaleString()}
                </Text>
            </Box>
        );
    };

    return (
        <Box safeArea flex={1} bg="gray.100" p={4}>
            {isLoading ? (
                <Center flex={1}>
                    <Spinner size="lg" />
                </Center>
            ) : error ? (
                <Center flex={1}>
                    <Text color="red.500">{error}</Text>
                </Center>
            ) : (
                <FlatList
                    data={[...records].sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at))}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#4CAF50']}
                            tintColor="#4CAF50"
                        />
                    }
                />
            )}
        </Box>
    );
};

export default RecordScreen;
