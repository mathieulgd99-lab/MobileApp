import AsyncStorage from '@react-native-async-storage/async-storage';

// sert de router, appels les fonctions qui font des appels précis à la  database
const API_BASE = "http://192.168.190.72:3000"; // mon pc trouvé avec ifconfig A MODIF EN CONSÉQUENCES

async function getToken() {
    return AsyncStorage.getItem('token');   
}

export async function login(email, password) {
    console.log("auth.js : await for login in server.js")

    const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({"email" : email,
                "password" : password
        })
    });
    console.log("auth.js : response status", res.status, res.statusText);
    const result = await res.json();
    console.log("auth.js : raw response text:", result);
    console.log("auth.js : end of login in server.js")
    return result
    // return {
    //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoidGVzdCIsImlhdCI6MTc2MTk3NTU5NiwiZXhwIjoxNzYyNTgwMzk2fQ.2PLDOsuxvu1c8WuyUEUfSFWjb29Ua3rhSKcfWixTpj4",
    //     "user": {
    //         "id": 1,
    //         "email": "Admin",
    //         "display_name": "Admin",
    //         "role": "admin"
    //     }
    // }
}

export async function register(email, password, display_name) {
    console.log("auth.js : await for register in server.js")
    const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({"email" : email,
            "password" : password,
            "display_name" : display_name
    })  
    });
    const result = await res.json();
    console.log("auth.js : end of register in auth.js")
    return result
}

export async function updatePassword(newPassword) {

}

export async function updateDisplayName(newName) {

}

export async function comment() {

}

export async function deleteComment() {

}

// Soit faire un if already completed dans le backend et utiliser cette fonction pour cliquer/decliquer OU en faire une autre 
export async function markAsCompleted() {

}

export async function addBoulder() {

}

export async function deleteBoulder() {

}


