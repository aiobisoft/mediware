import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { getLastRouteItem } from '../../../../utils/common';
import Table from '../../../../shared/organisms/Table';
import { Button, Input } from '@fluentui/react-components';
import NewCapsule from '../../../../forms/medicine/capsules/NewCapsule';
import { CapsuleListsCtx } from '../../../../state/contexts/CapsulesCtx';

const Capsules = () => {
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(false);
  const [capsules] = useContext(CapsuleListsCtx);
  const [queryString, setQueryString] = useState('');

  const handleQueryChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setQueryString(e.target.value);
  }, []);

  const onPressSearch = useCallback(() => {
    console.log(queryString);
  }, [queryString]);

  const toggleModalOpen = useCallback(() => setIsAdding(!isAdding), [isAdding]);

  useEffect(() => {
    if (getLastRouteItem(location.pathname) === 'insert') {
      setIsAdding(true);
    }
  }, [location]);

  return (
    <div>
      <NewCapsule isOpen={isAdding} setIsOpen={setIsAdding} />
      <div className="my-3 flex items-center justify-between">
        <Button onClick={toggleModalOpen}>Add New</Button>
        <div className="flex items-center gap-2">
          <Input
            size="medium"
            placeholder="Search"
            value={queryString}
            onChange={handleQueryChange}
          />
          <Button size="medium" onClick={onPressSearch}>
            Search
          </Button>
        </div>
      </div>
      <div className="mt-14 max-h-[75vh] overflow-y-auto">
        <Table data={capsules as object[]} />
      </div>
    </div>
  );
};

export default Capsules;