import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeProvider';

function MainLayout() {
  const { loggedIn } = useAuth();
  
  return (
    <Stack>
      {!loggedIn ? (
        <Stack.Screen 
          name="login"
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }} 
        />
      ) : (
        <Stack.Screen 
          name="(tabs)"
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }} 
        />
      )}
    </Stack>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}