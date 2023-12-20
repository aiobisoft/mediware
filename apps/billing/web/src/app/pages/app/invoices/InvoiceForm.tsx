import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useState,
} from 'react';
import {
  Button,
  Divider,
  MenuItem,
  Popover,
  PopoverSurface,
  PopoverTrigger,
} from '@fluentui/react-components';
import ListSelectors from '../../../shared/organisms/ListSelectors';
import { SupplierContext } from '../../../state/contexts/SupplierContext';
import { IInvoice, ISupplier } from '@billinglib';
import clsx from 'clsx';
import Modal from '../../../shared/organisms/Modal';
import SupplierForm from '../suppliers/SupplierForm';
import InputField from '../../../shared/molecules/InputField';
import { handleChange } from '../../../utils/common';
import Menu from '../../../shared/organisms/Menu';
import { STATAUS } from '../../../utils/types';

const InvoiceForm = () => {
  const { supplierList } = useContext(SupplierContext);

  const [stepCount, setStepCount] = useState(0);

  const [addingNewSupplier, setAddingNewSupplier] = useState(false);
  const [supplierSearchText, setSupplierSearchText] = useState('');

  const [invoiceData, setInvoiceData] = useState<IInvoice>({
    invoiceNumber: '',
    invoiceDate: new Date(),
    bookingDriver: '',
    deliveredBy: '',
    salesTax: 0,
    status: '',
    total: 0,
  });

  const handleOnChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      handleChange(
        ev.target.name,
        ev.target.value,
        invoiceData,
        setInvoiceData
      );
    },
    [invoiceData]
  );

  const onSelectSupplier = useCallback(
    (selectedSupplier: ISupplier) => {
      setInvoiceData({
        ...invoiceData,
        supplierId: selectedSupplier?.id,
        Supplier: selectedSupplier,
      });
    },
    [invoiceData]
  );

  const handleSubmit = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      console.log(JSON.stringify(invoiceData, null, 2));
    },
    [invoiceData]
  );

  const toggleAddNewSupplier = useCallback(
    () => setAddingNewSupplier(!addingNewSupplier),
    [addingNewSupplier]
  );

  const getFilteredListOfSuppliers = useCallback(() => {
    return (
      supplierList?.filter(
        (supplier) =>
          supplier.name
            .toLocaleLowerCase()
            .includes(supplierSearchText.toLocaleLowerCase()) ||
          supplier.emails
            .toLocaleLowerCase()
            .includes(supplierSearchText.toLocaleLowerCase()) ||
          supplier.telephones
            .toLocaleLowerCase()
            .includes(supplierSearchText.toLocaleLowerCase())
      ) ?? []
    );
  }, [supplierList, supplierSearchText]);

  return (
    <form className="gap-2 flex flex-col" onSubmit={handleSubmit}>
      {
        // Select the list of suppliers
        stepCount === 0 && supplierList && (
          <>
            <Modal
              isOpen={addingNewSupplier}
              hideClose={false}
              modalType="modal"
              setIsOpen={setAddingNewSupplier}
              title="Add Supplier"
            >
              <SupplierForm />
            </Modal>
            <ListSelectors
              list={getFilteredListOfSuppliers()}
              listTitle="Select Supplier"
              searchQuery={supplierSearchText}
              setSearchQuery={setSupplierSearchText}
              addNewEntry={toggleAddNewSupplier}
              renderItem={(supplier, index) => (
                <div
                  key={index}
                  className={clsx([
                    'p-2 border rounded-md cursor-pointer',
                    'hover:shadow-md',
                    invoiceData?.supplierId === supplier?.id
                      ? 'bg-blue-500 text-white'
                      : 'text-black',
                    'transition-all duration-200',
                  ])}
                  onClick={() => onSelectSupplier(supplier)}
                >
                  <div className="text-lg">{supplier.name}</div>
                  <div className="text-xs">{supplier.emails}</div>
                </div>
              )}
            />
          </>
        )
      }
      {stepCount === 1 && invoiceData && invoiceData?.Supplier && (
        <div>
          <Popover positioning={'below-start'}>
            <PopoverTrigger>
              {/* <Button>Invoicing Supplier {selectedSupplier?.name}</Button> */}
              <Button>Invoicing Supplier {invoiceData?.Supplier?.name}</Button>
            </PopoverTrigger>
            <PopoverSurface>
              <div className="text-lg capitalize">
                Name: {invoiceData?.Supplier?.name}
              </div>
              <div className="text-xs">
                Emails: {invoiceData?.Supplier?.emails}
              </div>
              <div className="text-xs">
                Telephones: {invoiceData?.Supplier?.telephones}
              </div>
              <div className="mt-3">{'Calculating payables...'}</div>
            </PopoverSurface>
          </Popover>
          <div className="my-3 flex-col gap-2 flex align-bottom">
            <div className="flex flex-row gap-3">
              <div className="flex-1">
                <InputField
                  name="invoiceNumber"
                  value={invoiceData?.invoiceNumber}
                  label="Invoice Number"
                  placeholder="Enter invoice number"
                  onChange={handleOnChange}
                  required
                />
              </div>
              <div className="flex-col flex justify-end">
                <Menu
                  button={
                    <Button size="large">
                      {invoiceData?.status ? invoiceData?.status : 'Status'}
                    </Button>
                  }
                >
                  {STATAUS.map((status) => (
                    <MenuItem
                      key={status}
                      onClick={() =>
                        handleChange(
                          'status',
                          status,
                          invoiceData,
                          setInvoiceData
                        )
                      }
                    >
                      {status}
                    </MenuItem>
                  ))}
                  <Divider className="my-2" />
                  <MenuItem
                    onClick={() =>
                      handleChange('status', '', invoiceData, setInvoiceData)
                    }
                  >
                    Clear
                  </MenuItem>
                </Menu>
              </div>
            </div>
            <InputField
              name="invoiceDate"
              value={invoiceData?.invoiceDate.toString()}
              label="Invoice Date"
              type="datetime-local"
              onChange={handleOnChange}
              required
            />
            <InputField
              name="salesTax"
              value={invoiceData?.salesTax?.toString() ?? ''}
              label="Sales Tax."
              placeholder="Sales Tax Percentage (%)"
              type="number"
              onChange={handleOnChange}
              required
            />
            <InputField
              name="deliveredBy"
              value={invoiceData?.deliveredBy ?? ''}
              label="Delivered By"
              placeholder="Delivered By"
              onChange={handleOnChange}
            />
            <InputField
              name="bookingDriver"
              value={invoiceData?.bookingDriver ?? ''}
              label="Booking Driver"
              placeholder="Booking driver name"
              onChange={handleOnChange}
            />

            <div className="flex justify-end mt-3">
              <Button onClick={() => setStepCount(stepCount + 1)}>
                Add Medicine
              </Button>
            </div>
          </div>
        </div>
      )}

      <Divider className="mb-3" />
      <div className="flex flex-row justify-end gap-2">
        <Button
          disabled={stepCount <= 0}
          onClick={() => setStepCount(stepCount - 1)}
        >
          Previouse
        </Button>
        <Button disabled={false} onClick={() => setStepCount(stepCount + 1)}>
          Next
        </Button>
      </div>

      <Divider className="my-3" />
      <Button type="submit" size="large" appearance="primary">
        Submit
      </Button>
    </form>
  );
};

export default InvoiceForm;
