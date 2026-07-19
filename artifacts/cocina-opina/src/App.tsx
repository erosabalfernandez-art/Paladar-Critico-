import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { PublicLayout } from '@/components/layout/PublicLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

import { Home } from '@/pages/public/Home';
import { ProductReview } from '@/pages/public/ProductReview';
import { CategoryPage } from '@/pages/public/CategoryPage';

import { AdminLogin } from '@/pages/admin/Login';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { ProductForm } from '@/pages/admin/ProductForm';
import { AdminCategories } from '@/pages/admin/Categories';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/productos/nuevo">
        <AdminLayout><ProductForm /></AdminLayout>
      </Route>
      <Route path="/admin/productos/:id/editar">
        <AdminLayout><ProductForm /></AdminLayout>
      </Route>
      <Route path="/admin/categorias">
        <AdminLayout><AdminCategories /></AdminLayout>
      </Route>
      <Route path="/admin">
        <AdminLayout><AdminDashboard /></AdminLayout>
      </Route>
      <Route path="/">
        <PublicLayout><Home /></PublicLayout>
      </Route>
      <Route path="/opiniones/:slug">
        <PublicLayout><ProductReview /></PublicLayout>
      </Route>
      <Route path="/categoria/:slug">
        <PublicLayout><CategoryPage /></PublicLayout>
      </Route>
      <Route>
        <PublicLayout><NotFound /></PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster position="top-center" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
