import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register } from '../api/auth';
import jwtDecode from 'jwt-decode';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null);

    const log_in = async (email,password) => {
      try {
        console.log("AuthContext.js : awaiting login");
        const data = await login(email, password);
        console.log("AuthContext.js : end of login", data);
    
        if (data && data.user) {
          console.log(`setting new user : ${data.user.email}`);
          setUser(data.user);
        }
    
        return data;
      } catch (err) {
        console.error("AuthContext.js : error in log_in", err);
        throw err;
      }
    }

    const reg = async (email, password, username) => {
        data = await register(email,password,username)
        if (data.user) setUser(data.user)
        return data
    }

    const log_out = async () => {
        setUser(null)
    }

    // const log_out = () => {
    // }

    return (
        <AuthContext.Provider value={{user,log_in, reg, log_out}}>
          {children}
        </AuthContext.Provider>
      );

}