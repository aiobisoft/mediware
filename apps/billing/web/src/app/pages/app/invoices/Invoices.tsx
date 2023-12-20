import React, { useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getLastRouteItem } from '../../../utils/common';
import InvoiceForm from './InvoiceForm';
import Modal from '../../../shared/organisms/Modal';
import { Button } from '@fluentui/react-components';

const Invoices = () => {
  const location = useLocation();

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
        title="Add Invoice"
        triggerButton={<Button onClick={toggleModel}>Add Invoice</Button>}
      >
        <InvoiceForm />
      </Modal>
    </div>
  );
};

export default Invoices;
