import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FirebaseConfig from '@/components/FirebaseConfig/FirebaseConfig'; // Impor instance autentikasi Firebase

const ProtectedRoute = ({ children }) => {
  const auth = FirebaseConfig().auth;
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/auth'); // Alihkan ke halaman login jika pengguna tidak login
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
