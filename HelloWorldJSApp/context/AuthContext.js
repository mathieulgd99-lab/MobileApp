import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register, addImage } from '../api/auth';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    // When state change -> re-render
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Run when rendering 
    useEffect(() => {
      (async () => {
        try {
          const saved = await AsyncStorage.getItem('token');
          if (!saved) return;
          setToken(saved);
          const payload = jwtDecode(saved);
          setUser({
            id: payload.id,
            email: payload.email,
            display_name: payload.display_name,
            role: payload.role
          });
        } catch (err) {
          console.log('AuthProvider: failed to load token', err);
        } finally {
          setLoading(false);
        }
      })();
    }, []); // Dependencies


    const log_in = async (email,password) => {
      try {
        console.log("AuthContext.js : awaiting login");
        const { token: serverToken, user: userData } = await login(email, password);
        console.log("AuthContext.js : end of login", userData);
    
        if (userData) {
          setUser(userData);
          await AsyncStorage.setItem('token',serverToken);
          setToken(serverToken)
        }
    
        return userData;
      } catch (err) {
        console.error("AuthContext.js : error in log_in", err);
        throw err;
      }
    }

    const reg = async (email, password, username) => {
      const { token: serverToken, user: userData}  = await register(email,password,username);
      if (userData) {
        setUser(userData)
        console.log("token : ",token)
        console.log("server token : ",serverToken)
        await AsyncStorage.setItem('token',serverToken);
        setToken(serverToken)
      }
      console.log("AuthContext.js : end of register", userData);
      return userData
    }

    const log_out = async () => {
        setUser(null)
        setToken(null)
        await AsyncStorage.removeItem('token');
    }

    const updateUser = (user) => {
      setUser(user);
    };
    

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{user,token, isAdmin,log_in, reg, log_out, updateUser}}>
          {!loading && children}
        </AuthContext.Provider>
      );

}