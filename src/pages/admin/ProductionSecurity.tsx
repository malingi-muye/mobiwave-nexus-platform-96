
import React from 'react';
import { AdminDashboardLayout } from '../../components/admin/AdminDashboardLayout';
import { ProductionSecuritySuite } from '../../components/admin/security/ProductionSecuritySuite';

const ProductionSecurity = () => {
  return (
    <AdminDashboardLayout>
      <ProductionSecuritySuite />
    </AdminDashboardLayout>
  );
};

export default ProductionSecurity;
