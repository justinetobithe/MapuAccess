import React, { useState, useEffect } from "react";
import { Box, Text, VStack, Spinner, Center, Heading, Image, Button, ScrollView, Pressable } from "native-base";
import { RefreshControl } from "react-native";
import useVehicleStore from "../../store/vehicleStore";
import useAuthStore from "../../store/authStore";
import useVehicleRegistration from "../../store/vehicleRegistrationStore";
import Toast from "../../components/Toast";

export default function VehicleScreen({ navigation }) {
    const { showToast } = Toast();
    const [refreshing, setRefreshing] = useState(false);
    const { userInfo } = useAuthStore();
    const { vehicles, isLoading: isFetchingVehicles, error, getVehiclesByUserId } = useVehicleStore();
    const { addVehicleRegistration, isLoading: isRegistering } = useVehicleRegistration();
    const [loading, setLoading] = useState(false);

    const fetchVehicles = async () => {
        setRefreshing(true);
        try {
            if (userInfo) {
                await getVehiclesByUserId(userInfo?.id);
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [userInfo]);

    const handleVehicleRegistration = async (vehicleId) => {
        setLoading(true);
        await addVehicleRegistration(vehicleId, showToast);
        await fetchVehicles();
        setLoading(false);
    };

    return (
        <ScrollView
            flex={1}
            p={4}
            bg="#fff"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchVehicles} />}
        >
            {isFetchingVehicles ? (
                <Center flex={1}>
                    <Spinner size="lg" />
                </Center>
            ) : error ? (
                <Center>
                    <Text color="red.500">Error: {error}</Text>
                </Center>
            ) : Array.isArray(vehicles) && vehicles.length === 0 ? (
                <Center>
                    <Image
                        source={require('../../assets/img/towing.png')}
                        alt="Vehicle Image"
                        width="100%"
                        height={180}
                        borderRadius="lg"
                    />
                    <Text>No vehicles found</Text>
                </Center>
            ) : (
                vehicles.map((item) => {
                    const latestRegistration = item.vehicle_registration?.sort((a, b) => new Date(b.valid_until) - new Date(a.valid_until))[0];
                    const isExpired = latestRegistration?.valid_until && new Date(latestRegistration.valid_until) < new Date();

                    return (
                        <Pressable
                            key={item.id}
                            onPress={() => navigation.navigate("RecordScreen", { vehicleId: item.id })} 
                        >
                            <Box bg="white" shadow={3} p={4} mb={4} borderRadius="lg">
                                {item.image && (
                                    <Image
                                        source={{ uri: `${process.env.API_URL}/storage/image/${item.image}` }}
                                        alt="Vehicle Image"
                                        width="100%"
                                        height={180}
                                        borderRadius="lg"
                                    />
                                )}
                                <VStack space={2} mt={3}>
                                    <Text bold fontSize="lg">{item.make} {item.model}</Text>
                                    <Text color="gray.600">Plate: {item.plate_number}</Text>
                                    <Text color="gray.600">Year: {item.year}</Text>
                                    <Text color="gray.600">Color: {item.color}</Text>
                                    <Text color="gray.600">Type: {item.type}</Text>
                                    <Text bold color={item.is_registered ? "green.500" : "red.500"}>
                                        {item.is_registered ? "Registered" : "Not Registered"}
                                    </Text>
                                </VStack>

                                {!isExpired && latestRegistration ? (
                                    <Button
                                        mt={4}
                                        colorScheme="blue"
                                        backgroundColor="#007AFF"
                                        borderRadius="md"
                                        onPress={() => navigation.navigate("QRScreen", { vehicle: item })}
                                    >
                                        Show QR
                                    </Button>
                                ) : (
                                    <Button
                                        mt={4}
                                        colorScheme="red"
                                        backgroundColor="#EC1F28"
                                        borderRadius="md"
                                        isLoading={loading || isRegistering}
                                        isDisabled={loading || isRegistering}
                                        onPress={() => handleVehicleRegistration(item.id)}
                                    >
                                        Apply for School Year Vehicle Pass
                                    </Button>
                                )}
                            </Box>
                        </Pressable>
                    );
                })
            )}
        </ScrollView>
    );
}
