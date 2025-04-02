import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { VStack, Input, Button, Text, FormControl, Center, Box, HStack } from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Toast from '../components/Toast';
import useAuthStore from '../store/authStore';

export default function RegisterScreen({ navigation }) {
    const { showToast } = Toast();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState('student');

    const { register, isLoading } = useAuthStore();
    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        defaultValues: {
            student_number: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '',
            student_no: '',
            employee_no: ''
        }
    });


    const onSubmit = async (data) => {
        if (selectedRole === 'student' && !data.student_no) {
            showToast("Student ID is required", "error");
            return;
        }

        if (selectedRole === 'employee' && !data.employee_no) {
            showToast("Employee ID is required", "error");
            return;
        }

        if (data.password !== data.confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        try {
            const res = await register({
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
                role: selectedRole,
                student_no: data.student_no,
                employee_no: data.employee_no,
            });

            if (res.success) {
                showToast(res.message, "success");
                navigation.navigate('Login');
                reset();
            } else {
                showToast(res.message, "error");
            }
        } catch (e) {
            showToast("Registration failed", "error");
        }
    };

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        if (role === 'student') {
            setValue('employee_no', '');
        } else if (role === 'employee') {
            setValue('student_no', '');
        }
    };


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Center>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/img/logo.png')}
                        style={styles.logo}
                    />
                </View>
            </Center>

            <Center flex={1} px={4}>
                <Box w="100%" maxW="300px">
                    <VStack space={4}>

                        <HStack justifyContent="center" space={2} mb={4} mt={5}>
                            <TouchableOpacity
                                style={[styles.toggleButton, selectedRole === 'employee' && styles.activeButton]}
                                onPress={() => handleRoleChange('employee')}
                            >
                                <FontAwesome5 name="user-tie" size={20} color={selectedRole === 'employee' ? "#fff" : "#000"} />
                                <Text color={selectedRole === 'employee' ? "white" : "black"}>Employee</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleButton, selectedRole === 'student' && styles.activeButton]}
                                onPress={() => handleRoleChange('student')}
                            >
                                <FontAwesome6 name="user-graduate" size={20} color={selectedRole === 'student' ? "#fff" : "#000"} />
                                <Text color={selectedRole === 'student' ? "white" : "black"}>Student</Text>
                            </TouchableOpacity>
                        </HStack>

                        {selectedRole === 'student' ? (
                            <FormControl>
                                <FormControl.Label>Student ID</FormControl.Label>
                                <Controller
                                    control={control}
                                    name="student_no"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            placeholder="Enter Student ID"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType="numeric"
                                        />
                                    )}
                                />
                            </FormControl>
                        ) : (
                            <FormControl>
                                <FormControl.Label>Employee ID</FormControl.Label>
                                <Controller
                                    control={control}
                                    name="employee_no"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            placeholder="Enter Employee ID"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType="numeric"
                                        />
                                    )}
                                />
                            </FormControl>
                        )}

                        <FormControl isInvalid={errors.first_name}>
                            <FormControl.Label>First Name</FormControl.Label>
                            <Controller
                                control={control}
                                name="first_name"
                                rules={{ required: 'First name is required' }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Enter your first name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="words"
                                    />
                                )}
                            />
                            {errors.first_name && <Text color="red.500">{errors.first_name.message}</Text>}
                        </FormControl>

                        <FormControl isInvalid={errors.last_name}>
                            <FormControl.Label>Last Name</FormControl.Label>
                            <Controller
                                control={control}
                                name="last_name"
                                rules={{ required: 'Last name is required' }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Enter your last name"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="words"
                                    />
                                )}
                            />
                            {errors.last_name && <Text color="red.500">{errors.last_name.message}</Text>}
                        </FormControl>

                        <FormControl isInvalid={errors.email}>
                            <FormControl.Label>Email</FormControl.Label>
                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email format'
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Enter your email"
                                        keyboardType="email-address"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                    />
                                )}
                            />
                            {errors.email && <Text color="red.500">{errors.email.message}</Text>}
                        </FormControl>

                        <FormControl isInvalid={errors.password}>
                            <FormControl.Label>Password</FormControl.Label>
                            <Controller
                                control={control}
                                name="password"
                                rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Enter your password"
                                        type={showPassword ? "text" : "password"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                        InputRightElement={
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                <Ionicons
                                                    name={showPassword ? "eye-off" : "eye"}
                                                    size={22}
                                                    color="#000"
                                                    style={{ marginRight: 10 }}
                                                />
                                            </TouchableOpacity>
                                        }
                                    />
                                )}
                            />
                            {errors.password && <Text color="red.500">{errors.password.message}</Text>}
                        </FormControl>

                        <FormControl isInvalid={errors.confirmPassword}>
                            <FormControl.Label>Confirm Password</FormControl.Label>
                            <Controller
                                control={control}
                                name="confirmPassword"
                                rules={{ required: 'Please confirm your password' }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        placeholder="Confirm your password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="none"
                                        InputRightElement={
                                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                <Ionicons
                                                    name={showConfirmPassword ? "eye-off" : "eye"}
                                                    size={22}
                                                    color="#000"
                                                    style={{ marginRight: 10 }}
                                                />
                                            </TouchableOpacity>
                                        }
                                    />
                                )}
                            />
                            {errors.confirmPassword && <Text color="red.500">{errors.confirmPassword.message}</Text>}
                        </FormControl>

                        <Button
                            isLoading={isLoading}
                            onPress={handleSubmit(onSubmit)}
                            backgroundColor="#EC1F28"
                            style={styles.buttonRegister}
                        >
                            {isLoading ? (
                                <EvilIcons name="spinner" size={24} color="white" style={{ marginRight: 10 }} />
                            ) : (
                                "Register"
                            )}
                        </Button>

                    </VStack>
                </Box>
            </Center>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    logoContainer: {
        width: 300,
        height: 200,
    },
    logo: {
        flex: 1,
        width: undefined,
        height: undefined,
        resizeMode: 'contain',
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#000",
        backgroundColor: "#f0f0f0",
        flex: 1,
    },
    activeButton: {
        backgroundColor: "#EC1F28",
    },
    buttonRegister: {
        marginTop: 10,
        marginBottom: 30
    },
});

