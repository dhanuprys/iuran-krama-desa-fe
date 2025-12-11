// krama imports
import AdminAnnouncementListPage from './admin/announcement';
import AdminAnnouncementCreatePage from './admin/announcement/create';
import AdminAnnouncementDetailPage from './admin/announcement/detail';
import AdminAnnouncementEditPage from './admin/announcement/edit';
import AdminAuditLogListPage from './admin/audit-log';
import AdminAuditLogDetailPage from './admin/audit-log/detail';
import AdminBanjarListPage from './admin/banjar';
import AdminBanjarCreatePage from './admin/banjar/create';
import AdminBanjarDetailPage from './admin/banjar/detail';
import AdminBanjarEditPage from './admin/banjar/edit';
// other imports
// other imports

// admin imports
import AdminDashboardPage from './admin/dashboard';
import AdminFamilyListPage from './admin/family';
import AdminFamilyDetailPage from './admin/family/detail';
import AdminInvoiceListPage from './admin/invoice';
import AdminInvoiceCreatePage from './admin/invoice/create';
import AdminInvoiceDetailPage from './admin/invoice/detail';
import AdminInvoiceEditPage from './admin/invoice/edit';
import AdminPaymentPage from './admin/payment';
import AdminPaymentCreatePage from './admin/payment/create';
import AdminPaymentDetailPage from './admin/payment/detail';
import AdminPaymentEditPage from './admin/payment/edit';
import AdminResidentListPage from './admin/resident';
import AdminResidentCreatePage from './admin/resident/create';
import AdminResidentDetailPage from './admin/resident/detail';
import AdminResidentEditPage from './admin/resident/edit';
import AdminUserListPage from './admin/user';
import AdminUserCreatePage from './admin/user/create';
import AdminUserDetailPage from './admin/user/detail';
import AdminUserEditPage from './admin/user/edit';
import AdminResidentStatusListPage from './admin/resident-status';
import AdminResidentStatusCreatePage from './admin/resident-status/create';
import AdminResidentStatusEditPage from './admin/resident-status/edit';
import AdminResidentStatusDetailPage from './admin/resident-status/detail';
// auth imports
import LoginPage from './auth/login';
import LogoutPage from './auth/logout';
import RegisterPage from './auth/register';
import KramaAccountResidentPage from './krama/account/resident';
import KramaAccountResidentCreatePage from './krama/account/resident/create';
import KramaAccountResidentDetailPage from './krama/account/resident/detail';
import KramaAccountResidentEditPage from './krama/account/resident/edit';
import KramaDashboardPage from './krama/dashboard';
import KramaPaymentAnnouncementPage from './krama/payment/announcement';
import KramaPaymentInvoicePage from './krama/payment/invoice';
import KramaPaymentInvoiceDetailPage from './krama/payment/invoice/detail';

// ... existing code ...

export const Krama = {
  Dashboard: KramaDashboardPage,
  Account: {
    Resident: {
      List: KramaAccountResidentPage,
      Create: KramaAccountResidentCreatePage,
      Edit: KramaAccountResidentEditPage,
      Detail: KramaAccountResidentDetailPage,
    },
  },
  Payment: {
    Announcement: KramaPaymentAnnouncementPage,
    Invoice: {
      List: KramaPaymentInvoicePage,
      Detail: KramaPaymentInvoiceDetailPage,
    },
  },
};

export const Admin = {
  Dashboard: AdminDashboardPage,
  Resident: {
    List: AdminResidentListPage,
    Create: AdminResidentCreatePage,
    Edit: AdminResidentEditPage,
    Detail: AdminResidentDetailPage,
  },
  Announcement: {
    List: AdminAnnouncementListPage,
    Create: AdminAnnouncementCreatePage,
    Edit: AdminAnnouncementEditPage,
    Detail: AdminAnnouncementDetailPage,
  },
  Invoice: {
    List: AdminInvoiceListPage,
    Create: AdminInvoiceCreatePage,
    Edit: AdminInvoiceEditPage,
    Detail: AdminInvoiceDetailPage,
  },
  Banjar: {
    List: AdminBanjarListPage,
    Create: AdminBanjarCreatePage,
    Edit: AdminBanjarEditPage,
    Detail: AdminBanjarDetailPage,
  },
  Family: {
    List: AdminFamilyListPage,
    Detail: AdminFamilyDetailPage,
  },
  User: {
    List: AdminUserListPage,
    Create: AdminUserCreatePage,
    Edit: AdminUserEditPage,
    Detail: AdminUserDetailPage,
  },
  Payment: {
    List: AdminPaymentPage,
    Detail: AdminPaymentDetailPage,
    Create: AdminPaymentCreatePage,
    Edit: AdminPaymentEditPage,
  },
  AuditLog: {
    List: AdminAuditLogListPage,
    Detail: AdminAuditLogDetailPage,
  },
  ResidentStatus: {
    List: AdminResidentStatusListPage,
    Create: AdminResidentStatusCreatePage,
    Edit: AdminResidentStatusEditPage,
    Detail: AdminResidentStatusDetailPage,
  },
};

export const Auth = {
  Login: LoginPage,
  Logout: LogoutPage,
  Register: RegisterPage,
};

export { default as NotFoundPage } from './not-found';
export { default as ProfilePage } from './profile';
