import React, { ReactNode } from 'react';
import SupplierProvider from './SupplierProvider';
import MedicineProvider from './MedicineProvider';

interface Props {
  children: ReactNode | ReactNode[];
}

const AppProvider = ({ children }: Props) => {
  return (
    <SupplierProvider>
      <MedicineProvider>{children}</MedicineProvider>
    </SupplierProvider>
  );
};

export default AppProvider;
