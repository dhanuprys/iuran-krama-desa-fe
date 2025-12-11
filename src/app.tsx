import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Constants } from '@/config/constants';

import useAuth from '@/stores/auth.store';

import LayoutSkeleton from '@/components/layout-skeleton';
import { Toaster } from '@/components/ui/sonner';

import AdminLayout from '@/layouts/admin-layout';
import OperatorLayout from '@/layouts/operator-layout';
import KramaLayout from '@/layouts/krama-layout';
import AuthenticatedOnly from '@/layouts/middleware/authenticated-only';

import HomePage from '@/pages/home';

import * as Pages from '@/pages';

function App() {
  const checkAuth = useAuth((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Routes>
        <Route index element={<HomePage loadingSkeleton={<LayoutSkeleton />} />} />
        <Route path="login" element={<Pages.Auth.Login />} />
        <Route path="register" element={<Pages.Auth.Register />} />

        <Route element={<AuthenticatedOnly />}>
          <Route path="logout" element={<Pages.Auth.Logout />} />
        </Route>

        {/* Krama Routes */}
        <Route element={<AuthenticatedOnly roles={[Constants.ROLES.KRAMA]} />}>
          <Route element={<KramaLayout />}>
            <Route path="dashboard" element={<Pages.Krama.Dashboard />} />
            <Route path="payment">
              <Route index element={<Navigate to="announcement" />} />
              <Route path="announcement" element={<Pages.Krama.Payment.Announcement />} />
              <Route path="invoice">
                <Route index element={<Pages.Krama.Payment.Invoice.List />} />
                <Route path=":id" element={<Pages.Krama.Payment.Invoice.Detail />} />
              </Route>
            </Route>
            <Route path="account">
              <Route index element={<Navigate to="profile" />} />
              <Route path="resident">
                <Route index element={<Pages.Krama.Account.Resident.List />} />
                <Route path="create" element={<Pages.Krama.Account.Resident.Create />} />
                <Route path=":id/edit" element={<Pages.Krama.Account.Resident.Edit />} />
                <Route path=":id" element={<Pages.Krama.Account.Resident.Detail />} />
              </Route>
            </Route>
            {/* Shared Profile Route for Krama */}
            <Route path="profile" element={<Pages.ProfilePage />} />
          </Route>
        </Route>

        {/* Operator Routes */}
        <Route element={<AuthenticatedOnly roles={[Constants.ROLES.OPERATOR]} />}>
          <Route path="operator" element={<OperatorLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Pages.Operator.Dashboard />} />

            <Route path="invoice">
              <Route index element={<Pages.Operator.Invoice.List />} />
              <Route path="create" element={<Pages.Operator.Invoice.Create />} />
              <Route path=":id" element={<Pages.Operator.Invoice.Detail />} />
              <Route path=":id/edit" element={<Pages.Operator.Invoice.Edit />} />
            </Route>

            <Route path="payment">
              <Route index element={<Pages.Operator.Payment.List />} />
              <Route path="create" element={<Pages.Operator.Payment.Create />} />
              <Route path=":id" element={<Pages.Operator.Payment.Detail />} />
              <Route path=":id/edit" element={<Pages.Operator.Payment.Edit />} />
            </Route>

            <Route path="resident">
              <Route index element={<Pages.Operator.Resident.List />} />
              <Route path="create" element={<Pages.Operator.Resident.Create />} />
              <Route path=":id" element={<Pages.Operator.Resident.Detail />} />
              <Route path=":id/edit" element={<Pages.Operator.Resident.Edit />} />
            </Route>
            <Route path="profile" element={<Pages.ProfilePage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <AuthenticatedOnly
              roles={[Constants.ROLES.ADMIN]}
              loadingSkeleton={<LayoutSkeleton />}
            />
          }
        >
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Pages.Admin.Dashboard />} />
            <Route path="resident">
              <Route index element={<Pages.Admin.Resident.List />} />
              <Route path="create" element={<Pages.Admin.Resident.Create />} />
              <Route path=":id/edit" element={<Pages.Admin.Resident.Edit />} />
              <Route path=":id" element={<Pages.Admin.Resident.Detail />} />
            </Route>
            <Route path="resident-status">
              <Route index element={<Pages.Admin.ResidentStatus.List />} />
              <Route path="create" element={<Pages.Admin.ResidentStatus.Create />} />
              <Route path=":id/edit" element={<Pages.Admin.ResidentStatus.Edit />} />
              <Route path=":id" element={<Pages.Admin.ResidentStatus.Detail />} />
            </Route>
            <Route path="announcement">
              <Route index element={<Pages.Admin.Announcement.List />} />
              <Route path="create" element={<Pages.Admin.Announcement.Create />} />
              <Route path=":id/edit" element={<Pages.Admin.Announcement.Edit />} />
              <Route path=":id" element={<Pages.Admin.Announcement.Detail />} />
            </Route>
            <Route path="invoice">
              <Route index element={<Pages.Admin.Invoice.List />} />
              <Route path="create" element={<Pages.Admin.Invoice.Create />} />
              <Route path=":id/edit" element={<Pages.Admin.Invoice.Edit />} />
              <Route path=":id" element={<Pages.Admin.Invoice.Detail />} />
            </Route>
            <Route path="banjar">
              <Route index element={<Pages.Admin.Banjar.List />} />
              <Route path="create" element={<Pages.Admin.Banjar.Create />} />
              <Route path=":id/edit" element={<Pages.Admin.Banjar.Edit />} />
              <Route path=":id" element={<Pages.Admin.Banjar.Detail />} />
            </Route>
            <Route path="family">
              <Route index element={<Pages.Admin.Family.List />} />
              <Route path=":id" element={<Pages.Admin.Family.Detail />} />
            </Route>
            <Route path="user">
              <Route index element={<Pages.Admin.User.List />} />
              <Route path="create" element={<Pages.Admin.User.Create />} />
              <Route path=":id/edit" element={<Pages.Admin.User.Edit />} />
              <Route path=":id" element={<Pages.Admin.User.Detail />} />
            </Route>
            <Route path="payment">
              <Route index element={<Pages.Admin.Payment.List />} />
              <Route path="create" element={<Pages.Admin.Payment.Create />} />
              <Route path=":id/edit" element={<Pages.Admin.Payment.Edit />} />
              <Route path=":id" element={<Pages.Admin.Payment.Detail />} />
            </Route>
            <Route path="payment/create" element={<Pages.Admin.Payment.Create />} />{' '}
            {/* Assuming AdminPaymentCreatePage is Pages.Admin.Payment.Create */}
            <Route path="audit-log">
              <Route index element={<Pages.Admin.AuditLog.List />} />
              <Route path=":id" element={<Pages.Admin.AuditLog.Detail />} />
            </Route>
            {/* Admin Profile Route */}
            <Route path="profile" element={<Pages.ProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Pages.NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
