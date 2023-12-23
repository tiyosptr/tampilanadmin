"use client"
import 'firebase/auth';
const getAdminToken = async () => {
    const adminCredentials = await firebase.auth().signInWithEmailAndPassword(adminEmail, adminPassword);
    const adminToken = await adminCredentials.user.getIdToken();
    return adminToken;
  };
  
  // Contoh penggunaan
  const adminToken = await getAdminToken();
  export default adminToken;