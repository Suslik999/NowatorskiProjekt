import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const InputField = ({ placeholder, value, onChangeText, secureTextEntry = false }) => (
  <TextInput
    placeholder={placeholder}
    secureTextEntry={secureTextEntry}
    style={styles.input}
    placeholderTextColor="#888"
    value={value}
    onChangeText={onChangeText}
  />
);

const Button = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onLoginSuccess = route.params?.onLoginSuccess;

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:3000/api/auth/login', { email, password });
      const { token } = response.data;

      await AsyncStorage.setItem('token', token);
      onLoginSuccess?.(token); 

    } catch (error) {
      Alert.alert('Login Error', error?.response?.data?.message || 'Server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <InputField placeholder="Email" value={email} onChangeText={setEmail} />
      <InputField placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>Forgot password?</Text>
      <Text style={styles.link} onPress={() => navigation.navigate('Register', { onLoginSuccess })}>Don’t have an account?</Text>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const RegisterScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onLoginSuccess = route.params?.onLoginSuccess;

  const handleRegister = async () => {
    try {
      await axios.post('http://10.0.2.2:3000/api/auth/register', { email, password });
      Alert.alert('Success', 'Registration successful. Please log in.');
      navigation.navigate('Login', { onLoginSuccess });
    } catch (error) {
      Alert.alert('Registration Error', error?.response?.data?.message || 'Server error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <InputField placeholder="Email" value={email} onChangeText={setEmail} />
      <InputField placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Sign Up" onPress={handleRegister} />
    </View>
  );
};

const ForgotPasswordScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Forgot{'\n'}Password</Text>
    <InputField placeholder="Email" />
    <Button title="Send Email" onPress={() => {}} />
  </View>
);

export default function AuthScreen({ onLoginSuccess }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} route={{ ...props.route, params: { onLoginSuccess } }} />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => <RegisterScreen {...props} route={{ ...props.route, params: { onLoginSuccess } }} />}
      </Stack.Screen>
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
