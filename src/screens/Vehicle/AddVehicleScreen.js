import React, { useState } from 'react';
import { ScrollView, Image, StyleSheet, LogBox, TouchableOpacity } from 'react-native';
import { VStack, Input, Button, Text, FormControl, Center, Box, Select, HStack, Switch } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import useAuthStore from '../../store/authStore';
import Toast from '../../components/Toast';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ImagePicker from 'react-native-image-crop-picker';
import useVehicleStore from '../../store/vehicleStore';

const typeOptions = [
    { value: "car", label: "Car" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "other", label: "Other" },
]

export default function AddVehicleScreen({ navigation }) {

    const { showToast } = Toast();
    const { userInfo } = useAuthStore();
    const { addVehicle, isLoading } = useVehicleStore();
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            user_id: undefined,
            plate_number: '',
            make: '',
            model: '',
            year: '',
            color: '',
            type: '',
            is_registered: false,
        }
    });


    const [selectedImage, setSelectedImage] = useState(null);

    const onSubmit = async (data) => {

        const formData = {
            user_id: userInfo.id,
            plate_number: data.plate_number,
            make: data.make,
            model: data.model,
            year: data.year,
            color: data.color,
            type: data.type,
            is_registered: data.is_registered,
            ...(selectedImage && { image: selectedImage }),
        };

        await addVehicle(formData, showToast, navigation);

    };


    const handleCaptureImage = async () => {
        try {
            const image = await ImagePicker.openCamera({
                width: 300,
                height: 300,
                cropping: true,
            });
            setSelectedImage(image.path);
        } catch (error) {
            console.log('Image capture cancelled', error);
        }
    };

    const handleUploadImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 300,
                cropping: true,
            });
            setSelectedImage(image.path);
        } catch (error) {
            console.log('Image upload cancelled', error);
        }
    };

    const formatLabel = (field) => {
        return field.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: currentYear - 1997 }, (_, i) => ({
        value: (1998 + i).toString(),
        label: (1998 + i).toString()
    })).reverse();

    LogBox.ignoreLogs([
        "We can not support a function callback. See Github Issues for details"
    ]);

    const handleRemoveImage = () => {
        setSelectedImage(null);
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Center flex={1} px={4}>
                <Box w="100%" maxW="300px">
                    <VStack space={4}>
                        {['plate_number', 'make', 'model', 'color'].map((field) => (
                            <FormControl key={field} isInvalid={errors[field]}>
                                <FormControl.Label>{formatLabel(field)}</FormControl.Label>
                                <Controller
                                    control={control}
                                    name={field}
                                    rules={{ required: `${formatLabel(field)} is required` }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            placeholder={`Enter ${formatLabel(field)}`}
                                            onBlur={onBlur}
                                            onChangeText={(text) =>
                                                onChange(field === 'plate_number' ? text.toUpperCase() : text)
                                            }
                                            value={value}
                                        />
                                    )}
                                />
                                {errors[field] && <Text color="red.500">{errors[field].message}</Text>}
                            </FormControl>
                        ))}

                        <FormControl isInvalid={errors.year}>
                            <FormControl.Label>Year</FormControl.Label>
                            <Controller
                                control={control}
                                name="year"
                                rules={{ required: 'Year is required' }}
                                render={({ field: { onChange, value } }) => (
                                    <Select selectedValue={value} onValueChange={onChange} placeholder="Select Year">
                                        {yearOptions.map(option => (
                                            <Select.Item key={option.value} label={option.label} value={option.value} />
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.year && <Text color="red.500">{errors.year.message}</Text>}
                        </FormControl>


                        <FormControl isInvalid={errors.type}>
                            <FormControl.Label>Type</FormControl.Label>
                            <Controller
                                control={control}
                                name="type"
                                rules={{ required: 'Type is required' }}
                                render={({ field: { onChange, value } }) => (
                                    <Select selectedValue={value} onValueChange={onChange}>
                                        {typeOptions.map(option => (
                                            <Select.Item key={option.value} label={option.label} value={option.value} />
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.type && <Text color="red.500">{errors.type.message}</Text>}
                        </FormControl>

                        <FormControl>
                            <HStack alignItems="center" space={3}>
                                <FormControl.Label>Registered</FormControl.Label>
                                <Controller
                                    control={control}
                                    name="is_registered"
                                    render={({ field: { value, onChange } }) => (
                                        <Switch
                                            value={!!value}
                                            onValueChange={(val) => onChange(val)}
                                        />
                                    )}
                                />
                            </HStack>
                        </FormControl>

                        <HStack space={4} justifyContent="center" alignItems="center">
                            <Button onPress={handleCaptureImage} colorScheme="blue">Capture Image</Button>
                            <Button onPress={handleUploadImage} colorScheme="green">Upload Image</Button>
                        </HStack>
                        {selectedImage && (
                            <Center>
                                <Box position="relative">
                                    <Image
                                        source={{ uri: selectedImage }}
                                        style={styles.image}
                                    />
                                    <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
                                        <EvilIcons name="close" size={30} color="white" />
                                    </TouchableOpacity>
                                </Box>
                            </Center>
                        )}

                        <Button
                            isLoading={isLoading}
                            onPress={handleSubmit(onSubmit)}
                            backgroundColor="#EC1F28"
                            style={styles.submitButton}
                        >
                            Save
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
    },
    image: {
        height: 250,
        width: 250,
        borderWidth: 1,
        borderColor: "#29B79D",
        borderRadius: 15,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 15,
        padding: 5,
    },
    submitButton: {
        marginBottom: 40,
        height: 45
    }
});
