import { RouterProvider } from 'react-router';
import { router } from './routes';
import { DiaryProvider } from './context/DiaryContext';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <DiaryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </DiaryProvider>
  );
}

export default App;
