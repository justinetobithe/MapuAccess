import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import { Button } from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Toast from '../components/Toast';
import { useForm } from 'react-hook-form';
import useAttendanceRecordStore from '../store/attendanceRecordStore';

export default function GuardScreen() {
    const { showToast } = Toast();
    const [scannedData, setScannedData] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [scannerKey, setScannerKey] = useState(Date.now());

    const { addAttendanceRecord } = useAttendanceRecordStore();

    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm({
        defaultValues: {
            student_number: '',
        }
    });

    const onSuccess = async (e) => {
        setScannedData(e.data);

        setValue('student_number', scannedData);

        try {
            await addAttendanceRecord({ student_number: scannedData }, showToast);
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
    };

    useEffect(() => {
        requestCameraPermission();
    }, []);

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Camera Permission Required</Text>
                <Text style={styles.instruction}>Please enable camera permissions to scan QR codes.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.scannerContainer}>
                <QRCodeScanner
                    key={scannerKey}
                    onRead={onSuccess}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    topContent={<Text style={styles.header}>Scan the QR Code</Text>}
                    reactivate={true}
                    reactivateTimeout={3000}
                    showMarker={true}
                />
            </View>
            <Button
                onPress={refreshScanner}
                variant="solid"
                backgroundColor="#7393B3"
                style={styles.button}
            >
                Refresh
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'flex-start',
    },
    scannerContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    instruction: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
    },
    button: {
        height: 45,
        marginHorizontal: 20,
        marginTop: 10,
        alignSelf: 'center',
    },
});
