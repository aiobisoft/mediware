import { useLocation } from 'react-router-dom';
import Modal from '../../../shared/organisms/Modal';
import { useCallback, useContext, useState } from 'react';
import { Button } from '@fluentui/react-components';
import { getLastRouteItem } from '../../../utils/common';
import SupplierForm from './SupplierForm';
import Table from '../../../shared/organisms/Table';
import { MedicineContext } from '../../../state/contexts/MedicineContext';

const Suppliers = () => {
  const location = useLocation();

  const { medicineList, deleteMedicine, updateMedicine } =
    useContext(MedicineContext);

  const [isCreatingRecord, setIsCreatingRecord] = useState(
    getLastRouteItem(location.pathname) === 'new'
  );
  const toggleModel = useCallback(
    () => setIsCreatingRecord(!isCreatingRecord),
    [isCreatingRecord]
  );

  return (
    <div>
      <div className="p-2 text-gray-400">{location.pathname}</div>
      <Modal
        isOpen={isCreatingRecord}
        hideClose={false}
        modalType="modal"
        setIsOpen={setIsCreatingRecord}
        title="Add Supplier"
        triggerButton={<Button onClick={toggleModel}>Add New</Button>}
      >
        <SupplierForm />
      </Modal>
      <div>
        {medicineList && medicineList?.length > 0 && (
          <Table
            headers={[]}
            data={medicineList}
            onDelete={deleteMedicine}
            onEdit={updateMedicine}
          />
        )}
      </div>
    </div>
  );
};

export default Suppliers;
