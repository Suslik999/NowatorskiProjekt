import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const InputField = ({ placeholder, secureTextEntry = false }) => (
    <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={styles.input}
        placeholderTextColor="#888"
    />
);

const Button = ({ title, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const LoginScreen = ({ navigation }) => (
    <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <InputField placeholder="Login" />
        <InputField placeholder="Password" secureTextEntry />
        <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
            Forgot password?
        </Text>
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Dont have account?
        </Text>
        <Button title="Login" onPress={() => {}} />
    </View>
);

const RegisterScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Sign up</Text>
        <InputField placeholder="Login" />
        <InputField placeholder="Password" secureTextEntry />
        <InputField placeholder="E-mail" />
        <Button title="Sign up" onPress={() => {}} />
    </View>
);

const ForgotPasswordScreen = () => (
    <View style={styles.container}>
        <Text style={styles.title}>Forgot{'\n'}Password</Text>
        <InputField placeholder="E-mail" />
        <Button title="Send e-mail" onPress={() => {}} />
    </View>
);

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#ff5b77',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    link: {
        color: '#555',
        textAlign: 'right',
        marginBottom: 10,
    },
});
