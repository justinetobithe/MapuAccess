MapuAccess

MapuAccess is a React Native mobile application designed for managing vehicle access in schools, specifically for Mapúa University. The app utilizes QR code scanning for secure vehicle verification.

📱 Features

QR Code scanning for vehicle entry validation

Secure and efficient vehicle tracking system

Integration with React Native Navigation

Offline support with AsyncStorage

Network status detection

🛠 Tech Stack

React Native (^0.70.6)

React Navigation (Drawer & Stack Navigation)

React Native Camera for QR scanning

Axios for API requests

Zustand for state management

📂 Project Structure

MapuAccess/
│── android/                # Android native files
│── ios/                    # iOS native files
│── src/                    # Application source code
│   ├── components/         # Reusable UI components
│   ├── screens/            # Screen components
│   ├── navigation/         # Navigation setup
│   ├── hooks/              # Custom hooks
│   ├── store/              # State management (Zustand)
│── package.json            # Project dependencies
│── App.js                  # Root component
│── README.md               # Documentation

🚀 Installation & Setup

Clone the repository

git clone https://github.com/justinetobithe/MapuAccess.git
cd MapuAccess

Install dependencies

npm install

Link dependencies (if required)

npx react-native link

Start Metro Bundler

npx react-native start

Run the app on Android

npx react-native run-android

Run the app on iOS (MacOS required)

npx react-native run-ios

📦 Dependencies

{
  "@react-native-async-storage/async-storage": "^2.1.0",
  "@react-native-community/netinfo": "^11.4.1",
  "@react-navigation/drawer": "^6.6.3",
  "@react-navigation/native": "^6.1.2",
  "@react-navigation/stack": "^6.3.17",
  "axios": "^1.7.7",
  "react-native-camera": "^4.2.1",
  "react-native-fs": "^2.20.0",
  "react-native-qrcode-scanner": "^1.5.5",
  "react-native-qrcode-svg": "^6.3.14",
  "react-native-reanimated": "^2.14.2",
  "react-native-vector-icons": "^10.2.0",
  "zustand": "^5.0.1"
}

🔥 Troubleshooting

If you encounter Gradle build issues, try:

cd android && ./gradlew clean

If Metro Bundler gets stuck, reset the cache:

npx react-native start --reset-cache

📜 License

This project is licensed under the MIT License.

Developed by Justine Tobithe for Mapúa University 🚀
