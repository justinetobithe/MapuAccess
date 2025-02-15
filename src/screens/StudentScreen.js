import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, PermissionsAndroid } from 'react-native';
import { Button } from 'native-base';
import useAuthStore from '../store/authStore';
import QRCode from 'react-native-qrcode-svg';
import dateFormat from 'dateformat';
import { CameraRoll } from 'react-native';
import RNFS from 'react-native-fs';
import Toast from '../components/Toast';

const StudentScreen = () => {
    const { userInfo } = useAuthStore();
    const [dateTime, setDateTime] = useState(new Date());
    const [busy, setBusy] = useState(false);
    const [imageSaved, setImageSaved] = useState(false);
    const qrCodeRef = useRef(null);
    const { showToast } = Toast();
    const studentNumber = userInfo?.student?.student_number;
    const firstName = userInfo?.first_name;
    const lastName = userInfo?.last_name;

    const greeting = `Hello, ${firstName} ${lastName}!`;

    useEffect(() => {
        const timer = setInterval(() => {
            setDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedDate = dateFormat(dateTime, "mmmm d, yyyy");
    const formattedTime = dateFormat(dateTime, "h:MM TT");

    const currentHour = dateTime.getHours();
    const currentDay = dateTime.getDay();
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = weekdays[currentDay];
    let customMessage = "";

    if (currentDay > 0 && currentDay < 6) {
        customMessage = `Hi, today is ${currentDayName}. You have a class to attend!`;
        if (currentHour >= 6 && currentHour < 7) {
            customMessage = "Hurry up! You're about to be late.";
        } else if (currentHour >= 8 && currentHour < 16) {
            customMessage = "Good luck in class!";
        } else if (currentHour >= 16 && currentHour < 17) {
            customMessage = "You're about to go home. Please scan your QR attendance to clock out.";
        }
    } else {
        customMessage = "";
    }

    const requestPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'We need access to your storage to save the QR code.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Permission denied');
                return false;
            }
            return true;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };


    const saveQrToDisk = async () => {
        if (busy) return;

        setBusy(true);

        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            setBusy(false);
            showToast('Permission denied!', 'info');
            return;
        }

        qrCodeRef.current.toDataURL((data) => {
            const filePath = `${RNFS.CachesDirectoryPath}/${studentNumber}.png`;

            RNFS.writeFile(filePath, data, 'base64')
                .then(() => {
                    return CameraRoll.save(filePath, { type: 'photo' });
                })
                .then(() => {
                    setImageSaved(true);
                    setBusy(false);
                    showToast("Saved to gallery!", "success");
                })
                .catch((error) => {
                    setBusy(false);
                    showToast("Error saving image!", "error");
                });
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.dateTime}>{formattedDate}, {formattedTime}</Text>
            {customMessage && <Text style={styles.message}>{customMessage}</Text>}

            <View style={styles.qrCodeWrapper}>
                <QRCode value={studentNumber || "No Student Number"} size={300} getRef={(ref) => (qrCodeRef.current = ref)} />
            </View>

            <Button
                onPress={saveQrToDisk}
                variant="solid"
                backgroundColor="#7393B3"
                style={styles.buttonSaveQr}
            >
                Save QR to Gallery
            </Button>

            {imageSaved && <Text>QR Code Saved Successfully!</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
        textAlign: 'center',
    },
    dateTime: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 10,
        textAlign: 'center',
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
    qrCodeContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSaveQr: {
        height: 45,
        marginTop: 50
    }
});

export default StudentScreen;
