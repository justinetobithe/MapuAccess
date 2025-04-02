import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert, Animated } from 'react-native';
import { Button, Box, VStack, HStack, Icon, Radio, Modal } from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Toast from '../components/Toast';
import { useForm } from 'react-hook-form';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dateFormat from "dateformat";
import useRecordStore from '../store/recordStore';

export default function GuardScreen() {
    const { showToast } = Toast();
    const [scannedData, setScannedData] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [scannerKey, setScannerKey] = useState(Date.now());
    const [fadeAnim] = useState(new Animated.Value(0));
    const [entryExitType, setEntryExitType] = useState('entry');
    const [isScanning, setIsScanning] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const { record, scanQRCode } = useRecordStore();

    const { control, handleSubmit, formState: { errors }, setValue, reset, getValues } = useForm({
        defaultValues: {
            qr_code: '',
            type: ''
        }
    }); pnpm

    useEffect(() => {
        requestCameraPermission();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const onSuccess = async (e) => {
        if (!isScanning) return;
        setIsScanning(false);

        setValue('qr_code', e.data);
        setValue('type', entryExitType);

        const formData = getValues();
        console.log("Form Data:", formData);

        try {
            const response = await scanQRCode(formData, showToast);

            if (response.status === "success") {
                const record = response?.data;

                setScannedData(record);
                setShowModal(true);
            }
        } catch (error) {
            showToast("Error recording attendance", "error");
        }
    };

    const requestCameraPermission = async () => {
        const status = await request(PERMISSIONS.ANDROID.CAMERA);
        if (status === RESULTS.GRANTED) {
            setHasPermission(true);
        } else {
            setHasPermission(false);
            Alert.alert('Permission Denied', 'Camera permission is required to scan QR codes.');
        }
    };

    const refreshScanner = () => {
        setScannerKey(Date.now());
        setIsScanning(true);
    };

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Camera Permission Required</Text>
                <Text style={styles.instruction}>Please enable camera permissions to scan QR codes.</Text>
            </View>
        );
    }

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Box safeArea p={4}>
                <HStack justifyContent="space-between" alignItems="center">
                    <Text style={styles.header}>Guard Scanner</Text>
                    <Icon as={Ionicons} name="shield-checkmark" size={8} color="red.500" />
                </HStack>
            </Box>

            <View style={styles.scannerContainer}>
                <View style={styles.scannerWrapper}>
                    <QRCodeScanner
                        key={scannerKey}
                        onRead={onSuccess}
                        flashMode={RNCamera.Constants.FlashMode.auto}
                        topContent={<Text style={styles.scannerText}>Scan the QR Code</Text>}
                        reactivate={false}
                        showMarker={true}
                    />
                </View>
            </View>

            <VStack space={3} alignItems="center" mt={5}>
                <Radio.Group
                    name="entryExit"
                    value={entryExitType}
                    onChange={setEntryExitType}
                    flexDirection="row"
                    mb={4}
                    style={styles.radioGroup}
                >
                    <HStack space={4} justifyContent="center" alignItems="center">
                        <Radio value="entry" my={1} size="lg" colorScheme="teal">
                            <Text style={styles.radioText}>Entry</Text>
                        </Radio>
                        <Radio value="exit" my={1} size="lg" colorScheme="teal">
                            <Text style={styles.radioText}>Exit</Text>
                        </Radio>
                    </HStack>
                </Radio.Group>

                <Button
                    leftIcon={<Icon as={Ionicons} name="refresh" size={5} />}
                    colorScheme="red"
                    onPress={refreshScanner}
                    style={styles.button}
                >
                    Refresh Scanner
                </Button>
            </VStack>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Scanned Details</Modal.Header>
                    <Modal.Body>
                        {scannedData && (
                            <>
                                <Text style={styles.modalText}>Owner: {scannedData?.vehicle_registration?.vehicle?.user?.first_name} {scannedData?.vehicle_registration?.vehicle?.user?.last_name}</Text>
                                <Text style={styles.modalText}>Vehicle: {scannedData?.vehicle_registration?.vehicle?.make} {scannedData?.vehicle_registration?.vehicle?.model} ({scannedData?.vehicle_registration?.vehicle?.year})</Text>
                                <Text style={styles.modalText}>Plate Number: {scannedData?.vehicle_registration?.vehicle?.plate_number}</Text>
                                <Text style={styles.modalText}>Type: {scannedData?.type === 'entry' ? 'Entry' : 'Exit'}</Text>
                                <Text style={styles.modalText}>Recorded At: {dateFormat(scannedData?.recorded_at, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</Text>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="ghost" colorScheme="blueGray" onPress={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scannerContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    scannerText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
    },
    instruction: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    button: {
        width: '80%',
        borderRadius: 8,
    },
    radioGroup: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f1f1f1',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    radioText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    modalText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 10,
        fontWeight: '500',
    },
});
