import { RouterProvider } from 'react-router';
import { router } from './routes';
import { DiaryProvider } from './context/DiaryContext';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <DiaryProvider>
      <RouterProvider router={router} />
      <Toaster />
    </DiaryProvider>
  );
}

export default App;
