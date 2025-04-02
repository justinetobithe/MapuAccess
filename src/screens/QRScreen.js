import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, PermissionsAndroid } from 'react-native';
import { Button } from 'native-base';
import QRCode from 'react-native-qrcode-svg';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import Toast from '../components/Toast';
import { useRoute } from '@react-navigation/native';

export default function QRScreen() {
    const route = useRoute();
    const { vehicle } = route.params || {};
    const qrCodeRef = useRef(null);
    const { showToast } = Toast();
    const [isValid, setIsValid] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [imageSaved, setImageSaved] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (vehicle?.vehicle_registration?.length > 0) {
            const today = new Date();
            const latestValidReg = vehicle.vehicle_registration
                .filter(reg => new Date(reg.valid_until) >= today)
                .sort((a, b) => new Date(b.valid_until) - new Date(a.valid_until))[0];

            console.log("Latest valid registration:", latestValidReg);

            setIsValid(!!latestValidReg);
            setQrData(latestValidReg ? latestValidReg.code : null);
        }
    }, [vehicle]);

    const requestPermissions = async () => {
        try {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            ];

            const granted = await PermissionsAndroid.requestMultiple(permissions);

            if (
                granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] !== PermissionsAndroid.RESULTS.GRANTED ||
                granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] !== PermissionsAndroid.RESULTS.GRANTED
            ) {
                showToast('Permission denied!', 'info');
                return false;
            }

            return true;
        } catch (err) {
            showToast('Error requesting permissions!', 'error');
            return false;
        }
    };

    const saveQrToDisk = async () => {
        if (busy || !isValid) return;

        setBusy(true);
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            setBusy(false);
            return;
        }

        if (!qrCodeRef.current) {
            setBusy(false);
            showToast('QR Code not available', 'error');
            return;
        }

        qrCodeRef.current.toDataURL((data) => {
            const filePath = `${RNFS.CachesDirectoryPath}/vehicle_qr.png`;

            RNFS.writeFile(filePath, data, 'base64')
                .then(() => CameraRoll.save(filePath, { type: 'photo' }))
                .then(() => {
                    setImageSaved(true);
                    setBusy(false);
                    showToast("Saved to gallery!", "success");
                })
                .catch(() => {
                    setBusy(false);
                    showToast("Error saving image!", "error");
                });
        });
    };

    return (
        <View style={styles.container}>
            {vehicle?.make && vehicle?.model && (
                <Text style={styles.vehicleTitle}>
                    {vehicle.make} {vehicle.model}
                </Text>
            )}

            {isValid ? (
                <View style={styles.qrCodeWrapper}>
                    <QRCode value={qrData} size={300} getRef={(ref) => (qrCodeRef.current = ref)} />
                </View>
            ) : (
                <Text style={styles.message}>Vehicle registration is expired or invalid.</Text>
            )}

            <Button
                onPress={saveQrToDisk}
                variant="solid"
                backgroundColor="#EC1F28"
                style={styles.buttonSaveQr}
                isDisabled={!isValid}
            >
                Save QR to Gallery
            </Button>

            {imageSaved && <Text style={styles.successMessage}>QR Code Saved Successfully!</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    vehicleTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        textAlign: 'center',
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FF0000',
        marginBottom: 20,
        textAlign: 'center',
    },
    qrCodeWrapper: {
        marginTop: 20,
        padding: 15,
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSaveQr: {
        height: 45,
        marginTop: 50,
    },
    successMessage: {
        marginTop: 10,
        fontSize: 16,
        color: 'green',
        fontWeight: '600',
    },
});

