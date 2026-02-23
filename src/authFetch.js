

const API_BASE = "http://localhost:4000"; 

let refreshPromise = null;

async function refreshSession() {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Refresh failed");
 
}

export async function authFetch(url, options = {}) {
  const config = { ...options, credentials: "include" };

 
  let res = await fetch(url, config);
  if (res.status !== 401) return res;

 
  if (!refreshPromise) {
    refreshPromise = refreshSession().finally(() => {
      refreshPromise = null;
    });
  }

  try {
    await refreshPromise;
  } catch (err) {
   
    window.location.assign("/login");
    throw err;
  }

  
  return fetch(url, config);
}
