import React, { useCallback, useContext, useState } from 'react';
import MedicineForm from './MedicineForm';
import Modal from '../../../shared/organisms/Modal';
import { useLocation } from 'react-router-dom';
import { getLastRouteItem } from '../../../utils/common';
import { Button } from '@fluentui/react-components';
import { MedicineContext } from '../../../state/contexts/MedicineContext';
import Table from '../../../shared/organisms/Table';

const Medicines = () => {
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
        title="Add Medicine"
        triggerButton={<Button onClick={toggleModel}>Add Medicine</Button>}
      >
        <MedicineForm />
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

export default Medicines;
