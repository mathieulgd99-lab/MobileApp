import { Platform } from 'react-native';

// sert de router, appels les fonctions qui font des appels précis à la  database
const API_BASE = "http://192.168.190.72:3000"; // mon pc trouvé avec ifconfig A MODIF EN CONSÉQUENCES



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
}

export async function register(email, password, display_name) {
  //  TOUT cassé ?????? 
    console.log("auth.js : await of register in auth.js")
    const res = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const result = await res.json();
    console.log("auth.js : end of register in auth.js")
    return result
}

const extToMime = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  
function guessMimeType(filename, fallback = 'image/jpeg') {
if (!filename) return fallback;
const parts = filename.split('.');
const ext = parts.length > 1 ? parts.pop().toLowerCase() : '';
return extToMime[ext] || fallback;
}

export async function addBoulder(pickedAsset, zoneId, grade, color,token) {

    try {
        console.log("Entre dans addBoulder auth.js")
        const formData = new FormData();
        const uri = pickedAsset.uri;
        const filename = pickedAsset.fileName || uri.split('/').pop();
        const mimeType = guessMimeType(filename);
        const fileUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
        console.log("fileUri :",fileUri)
        console.log("fileName :",filename)
        console.log("mimeType :",mimeType)

        formData.append('boulder', {
        uri: fileUri,
        name: filename,
        type: mimeType,
        });

        formData.append('zoneId', zoneId);
        formData.append('grade', String(grade));
        formData.append('color', color);

        if (formData._parts) {
          console.log('FormData parts:');
          formData._parts.forEach(p => console.log(p[0], p[1]));
        }

        console.log("lance le fetch dans addBoulder auth.js")
        console.log("Formdata : ",formData)

        const res = await fetch(`${API_BASE}/api/boulders`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,  // Sécurisation via token
              },
          body: formData,
          });

        const json = await res.json();
        if (!res.ok) {
        console.log('Server error', json);
        return { error: json };
        }
        console.log("Sort de addBoulder auth.js")
        return json;
        } catch (err) {
        console.error('addBoulders error', err);
        return { error: err.message || err };
        }
}

export async function getBoulders() {
    try {
      const res = await fetch(`${API_BASE}/api/boulders`, {
        method: 'GET',
      });
  
      const json = await res.json();
      if (!res.ok) {
        console.log('Server error', json);
        return { error: json };
      }
      return json;
    } catch (err) {
      console.error('getBoulders error', err);
      return { error: err.message || err };
    }
}

export async function getValidatedBoulders(token) {
  try {
    const res = await fetch(`${API_BASE}/api/boulders/validated`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        },
    });

    const json = await res.json();
    if (!res.ok) {
      console.log('Server error', json);
      return { error: json };
    }
    return json;
  } catch (err) {
    console.error('getValidatedBoulders error', err);
    return { error: err.message || err };
  }
}

export async function markBoulderAsCompleted(boulder,user, token) {
  try {
    const formData = new FormData();
    formData.append('user', user);
    formData.append('boulder', boulder);
    const res = await fetch(`${API_BASE}/api/boulders/toggle-validation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) {
      console.log('Server error', json);
      return { error: json };
    }
    return json;
  } catch (err) {
    console.error('markBoulderAsCompleted error', err);
    return { error: err.message || err };
  }
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


export async function deleteBoulder() {

}


