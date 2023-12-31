import { IMedicine, ISaleInvoiceItem } from '@billinglib';
import {
  Button,
  Divider,
  Input,
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from '@fluentui/react-components';
import { ChangeEvent, useCallback, useContext, useMemo, useState } from 'react';
import { sanitizeNaN } from '../../../utils/common';
import Menu from '../Menu';
import { MedicineContext } from '../../../state/contexts/MedicineContext';
import { Delete16Regular as ClearFormIcon } from '@fluentui/react-icons';
import clsx from 'clsx';

interface Props {
  invoiceItems: ISaleInvoiceItem[];
  onAddItem: (data: ISaleInvoiceItem) => void;
  onSaveItems: () => void;
  onDeleteItem: (index: number) => void;
  onCloseForm: () => void;
}

const SaleInvoiceItemPicker = ({
  invoiceItems,
  onAddItem,
  onDeleteItem,
  onSaveItems,
  onCloseForm,
}: Props) => {
  const { medicineList } = useContext(MedicineContext);
  const [searchString, setSearchString] = useState('');
  const [newInvoiceItem, setNewInvoiceItem] = useState<ISaleInvoiceItem>({
    medicinesId: 0,
    Medicine: {
      name: '',
      packing: '',
      unitTakePrice: 0,
      brand: '',
      code: '',
      id: 0,
      formula: '',
      quantityInStock: 0,
      type: '',
    },
    comments: '',
    quantity: 1,
    unitSalePrice: 0,
    quantitySoldFromPack: 0,
  });

  const clearForm = useCallback(() => {
    setNewInvoiceItem({
      medicinesId: 0,
      Medicine: {
        name: '',
        packing: '',
        unitTakePrice: 0,
        brand: '',
        code: '',
        id: 0,
        formula: '',
        quantityInStock: 0,
        type: '',
      },
      comments: '',
      quantity: 1,
      unitSalePrice: 0,
      quantitySoldFromPack: 0,
    });
    setSearchString('');
  }, [newInvoiceItem]);

  const SaveItemInArray = useCallback(() => {
    onAddItem(newInvoiceItem);
    clearForm();
  }, [newInvoiceItem]);

  const handleChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setNewInvoiceItem({
        ...newInvoiceItem,
        [ev.target.name]: ev.target.value,
      });
    },
    [newInvoiceItem]
  );

  const filteredMedicines = useMemo(() => {
    if (medicineList && medicineList?.length > 0) {
      return medicineList?.filter((medicine) =>
        medicine?.name?.toLowerCase().includes(searchString?.toLowerCase())
      );
    }
    return [];
  }, [searchString]);

  const disableSelection = useCallback(
    (med: IMedicine) => {
      if (!med.quantityInStock) {
        return true;
      }
      return invoiceItems?.map((m) => m.Medicine)?.includes(med);
    },
    [invoiceItems]
  );

  const onSelectMedicine = useCallback(
    (data: IMedicine) => {
      if (data?.name && !disableSelection(data)) {
        setSearchString(data.name);
        setNewInvoiceItem({
          ...newInvoiceItem,
          Medicine: data,
          unitSalePrice: data.unitTakePrice,
        });
      }
    },
    [newInvoiceItem, searchString, newInvoiceItem]
  );

  return (
    <div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Medicine</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Sale Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableHeader>
            {invoiceItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div>
                    {item?.Medicine?.name}{' '}
                    {item.Medicine?.brand && `(${item.Medicine?.brand})`}
                  </div>
                </TableCell>
                <TableCell>${item?.Medicine?.unitTakePrice}</TableCell>
                <TableCell>
                  <div>${item?.unitSalePrice}</div>
                </TableCell>
                <TableCell>
                  <div>{item?.quantity}</div>
                </TableCell>
                <TableCell>
                  <Button
                    size="large"
                    className="w-full"
                    onClick={() => onDeleteItem(index)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <Menu
                  positioning={'below-start'}
                  button={
                    <Input
                      size="large"
                      className="w-full"
                      placeholder="Search Medicine..."
                      value={searchString}
                      onChange={(e) => setSearchString(e.target.value)}
                      contentAfter={
                        <ClearFormIcon
                          className="cursor-pointer"
                          onClick={clearForm}
                        />
                      }
                    />
                  }
                >
                  {filteredMedicines?.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => onSelectMedicine(med)}
                      className={clsx([
                        'cursor-pointer hover:bg-gray-100 p-2 min-w-[150pt] rounded-sm',
                        'flex justify-between',
                        disableSelection(med) &&
                          'text-gray-300 cursor-not-allowed',
                      ])}
                    >
                      <div>
                        <div className="text-md">
                          {med?.name} {med?.packing ? `(${med?.packing})` : ''}
                        </div>
                        <div className="text-xs">{med?.type}</div>
                      </div>
                      <div>{med?.quantityInStock}</div>
                    </div>
                  ))}
                  <div
                    onClick={() => {}}
                    className="cursor-pointer hover:bg-gray-100 p-2 min-w-[150pt] rounded-sm"
                  >
                    <div className="text-md">Add New</div>
                  </div>
                </Menu>
              </TableCell>
              <TableCell>
                <Input
                  size="large"
                  className="w-full my-1"
                  placeholder="Unit Price"
                  value={sanitizeNaN(
                    String(newInvoiceItem.Medicine?.unitTakePrice)
                  )}
                  disabled
                />
              </TableCell>
              <TableCell>
                <Input
                  size="large"
                  className="w-full my-1 text-red-400"
                  placeholder="Sale Price"
                  name="unitSalePrice"
                  value={sanitizeNaN(String(newInvoiceItem.unitSalePrice))}
                  onChange={handleChange}
                  type="number"
                  min={0}
                />
              </TableCell>
              <TableCell>
                <Input
                  size="large"
                  className="w-full my-1"
                  placeholder="Quantity"
                  name="quantity"
                  value={sanitizeNaN(String(newInvoiceItem.quantity))}
                  onChange={handleChange}
                  type="number"
                  min={1}
                />
              </TableCell>
              <TableCell>
                <Button size="large" className="w-full" onClick={clearForm}>
                  Clear
                </Button>
              </TableCell>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="text-end p-2">
          <Button
            disabled={
              !newInvoiceItem?.Medicine || !newInvoiceItem?.Medicine.name
            }
            onClick={SaveItemInArray}
          >
            Add
          </Button>
        </div>
      </div>
      <Divider />
      <div className="flex flex-row gap-3 justify-end pt-4">
        <Button size="large" onClick={onCloseForm}>
          Close
        </Button>
        <Button
          size="large"
          appearance="primary"
          disabled={!invoiceItems || !invoiceItems?.length}
          onClick={onSaveItems}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SaleInvoiceItemPicker;
