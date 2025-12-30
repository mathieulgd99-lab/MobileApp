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
    const result = await res.json();
    console.log("auth.js : end of login in server.js")
    return result
}

export async function register(email, password, display_name) {
    console.log("auth.js : await of register in auth.js")
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

        formData.append('boulder', {
        uri: fileUri,
        name: filename,
        type: mimeType,
        });

        formData.append('zoneId', zoneId);
        formData.append('grade', String(grade));
        formData.append('color', color);

        if (formData._parts) {
          formData._parts.forEach(p => console.log(p[0], p[1]));
        }

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
      console.log("getBoulders")
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
    console.log("end get validatedboulders :")
    return json;
  } catch (err) {
    console.error('getValidatedBoulders error', err);
    return { error: err.message || err };
  }
}

export async function markBoulderAsCompleted(boulderId, token) {
  try {
    console.log("entrée markboulderasCOmpleted")
    const res = await fetch(`${API_BASE}/api/boulders/toggle-validation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        },
      body: JSON.stringify({ boulder: boulderId })
    });
    const json = await res.json();
    if (!res.ok) {
      console.log('Server error', json);
      return { error: json };
    }
    console.log("sortie markboulderascompleted : ")
    return json;
  } catch (err) {
    console.error('markBoulderAsCompleted error', err);
    return { error: err.message || err };
  }
}

export async function addComment(token, commentary, boulder_id) {
  try {
    console.log("Upload new comment")
    const res = await fetch(`${API_BASE}/api/comment/${encodeURIComponent(boulder_id)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        },
      body: JSON.stringify({comment : commentary})
    });
    const json = await res.json();
    if (!res.ok) {
      console.log('Server error', json);
      return { error: json };
    }
    console.log("sortie add comment : ")
    return json;
  } catch (err) {
    console.error('Comment error', err);
    return { error: err.message || err };
  }
}

export async function deleteComment(token, commentId) {
  try {
    console.log("Delete comment");
    const res = await fetch(`${API_BASE}/api/comment/${encodeURIComponent(commentId)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      console.log('Server error', json);
      return { error: json };
    }
    console.log("sortie delete comment")
    return json;
  } catch (err) {
    console.error('Delete comment error', err);
    return { error: err.message || err };
  }
}


export async function getComment(token, boulderId) {
  try {
    const url = `${API_BASE}/api/comment/${encodeURIComponent(boulderId)}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization' : `Bearer ${token}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      console.log('Server error', json);
      return { error: json };
    }
    return json;
  } catch (err) {
    console.error('Get comment error', err);
    return { error: err.message || err };
  }
}

export async function deleteBoulders(token, boulderId) {
  try {
    const url = `${API_BASE}/api/boulders/${encodeURIComponent(boulderId)}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization' : `Bearer ${token}`,
      }
    })
    const json = await res.json();
    if (!res.ok) {
      console.log('Server error', json);
      return { error: json };
    }
    console.log("sortie deleteBoulder")
    return json;
  } catch (err) {
    console.error('Delete boulder error', err);
    return { error: err.message || err };
  }
}

export async function archiveBoulders(token, boulderId) {
  try {
    console.log("entrée archivedBoulder boulderId: ",boulderId, "token : ",token)
    const url = `${API_BASE}/api/boulders/archived/${encodeURIComponent(boulderId)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        },
      body: JSON.stringify({ boulder: boulderId })
    });
    const json = await res.json();
    if (!res.ok) {
      console.log('Server error', json);
      return { error: json };
    }
    console.log("sortie archiveBoulders")
    return json;
  } catch (err) {
    console.error('ArchivedBoulder error', err);
    return { error: err.message || err };
  }
}

export async function getUserPoints(token,userId){
  console.log("entrée get User Points")
  try {
    const url = `${API_BASE}/api/points/${encodeURIComponent(userId)}`;
    const res = await fetch(url, {
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
    console.log("res UserPoints : ",json)
    return json;
  } catch (err) {
    console.error('ArchivedBoulder error', err);
    return { error: err.message || err };
  }
}

export async function getLeaderboard(token) {
  console.log("entrée get LeaderBoard")
  try {
    const res = await fetch(`${API_BASE}/api/leaderboard`, {
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
    console.log("res leaderboard : ",json)
    return json;
  } catch (err) {
    console.error('ArchivedBoulder error', err);
    return { error: err.message || err };
  }
}

export async function getUserBoulders(userId, token) {
  try {
    const res = await fetch(`${API_BASE}/api/users/${userId}/boulders`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json
  } catch (err) {
    console.error('getUserBoulders error', err);
    return { error: err.message || err };
  }
}

export async function getUserProfile(userId, token) {
  try {
    console.log("Entrée getUserProfile, userId: ",userId)
    const res = await fetch(`${API_BASE}/api/users/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json
  } catch (err) {
    console.error('getUserProfile error', err);
    return { error: err.message || err };
  }
}

export async function getUserSessions(userId, token, range = 'month') {
  try {
    const res = await fetch(
      `${API_BASE}/api/users/${userId}/stats/sessions-timeline?range=${range}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('getUserSessions error', err);
    return { error: err.message || err };
  }
}

export async function getUserSessionsCalendar(userId, token, month) {
  try {
    const res = await fetch(
      `${API_BASE}/api/users/${userId}/stats/sessions-calendar?month=${month}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('getUserSessionsCalendar error', err);
    return { error: err.message || err };
  }
}


export async function updatePassword(token, newPassword) {
  try {
    console.log("entrée updatePassword: ")
    const url = `${API_BASE}/api/change/password`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        },
      body: JSON.stringify({ newPassword: newPassword })
    });
    const json = await res.json();
    if (!res.ok) {
      console.log('Server error', json);
      return { error: json };
    }
    return json;
  } catch (err) {
    console.error('updatePassword error', err);
    return { error: err.message || err };
  }
}
export async function updateDisplayName(token, newName) {
  try {
    console.log("entrée updateDisplayName");
    const url = `${API_BASE}/api/change/username`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newUsername: newName }),
    });

    const json = await res.json();
    if (!res.ok) {
      console.log('Server error', json);
      return { error: json };
    }
    return json;
  } catch (err) {
    console.error('updateDisplayName error', err);
    return { error: err.message || err };
  }
}


