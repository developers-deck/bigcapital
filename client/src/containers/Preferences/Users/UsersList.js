import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from 'react-query';
import DataTable from 'components/DataTable';
import {
  Alert,
  Popover,
  Button,
  Menu,
  MenuItem,
  MenuDivider,
  Position,
  Intent,
  Tag
} from '@blueprintjs/core';
import { snakeCase } from 'lodash';
import { FormattedMessage as T, useIntl } from 'react-intl';

import Icon from 'components/Icon';
import LoadingIndicator from 'components/LoadingIndicator';

import AppToaster from 'components/AppToaster';

import DialogConnect from 'connectors/Dialog.connector';
import withDashboard from 'containers/Dashboard/withDashboard';
import withUsers from 'containers/Users/withUsers';
import withUsersActions from 'containers/Users/withUsersActions';

import { compose } from 'utils';


function UsersListPreferences({
  // #withDialog
  openDialog,
  closeDialog,

  // #withUsers  
  usersList,

  // #withUsersActions
  requestDeleteUser,
  requestInactiveUser,
  requestFetchUsers,

  // #ownProps
  onFetchData,
}) {
  const [deleteUserState, setDeleteUserState] = useState(false);
  const [inactiveUserState, setInactiveUserState] = useState(false);
  const { formatMessage } = useIntl()
  const fetchUsers = useQuery('users-table',
    () => requestFetchUsers());

  const onInactiveUser = (user) => {
    setInactiveUserState(user);
  };

  // Handle cancel inactive user alert
  const handleCancelInactiveUser = useCallback(() => {
    setInactiveUserState(false);
  }, []);

  // handel confirm user activation
  const handleConfirmUserActive = useCallback(() => {
    requestInactiveUser(inactiveUserState.id).then(() => {
      setInactiveUserState(false);
      AppToaster.show({ message: formatMessage({id:'the_user_has_been_successfully_inactivated'}) });
    });
  }, [inactiveUserState, requestInactiveUser, requestFetchUsers,formatMessage]);

  const onDeleteUser = (user) => {
    setDeleteUserState(user);
  };

  const handleCancelUserDelete = () => {
    setDeleteUserState(false);
  };

  const onEditInviteUser = (user) => () => {
    const form = Object.keys(user).reduce((obj, key) => {
      const camelKey = snakeCase(key);
      obj[camelKey] = user[key];
      return obj;
    }, {});

    openDialog('user-form', { action: 'edit', user: form });
  };

  const onEditUser = (user) => () => {
    const form = Object.keys(user).reduce((obj, key) => {
      const camelKey = snakeCase(key);
      obj[camelKey] = user[key];
      return obj;
    }, {});

    openDialog('userList-form', { action: 'edit', user: form });
  };

  const handleConfirmUserDelete = () => {
    if (!deleteUserState) { return; }
    requestDeleteUser(deleteUserState.id).then((response) => {
      setDeleteUserState(false);
      AppToaster.show({
        message: formatMessage({id:'the_user_has_been_successfully_deleted'}),
      });
    });
  };

  const actionMenuList = useCallback(
    (user) => (
      <Menu>
        <MenuItem text={<T id={'edit_user'} />} onClick={onEditUser(user)} />
        <MenuDivider />
        <MenuItem text={<T id={'edit_invite'} />} onClick={onEditInviteUser(user)} />
        <MenuItem text={<T id={'inactivate_user'} />} onClick={() => onInactiveUser(user)} />
        <MenuItem text={<T id={'delete_user'} />} onClick={() => onDeleteUser(user)} />
      </Menu>
    ),
    []
  );

  const columns = useMemo(() => [
    {
      id: 'full_name',
      Header:formatMessage({id:'full_name'}),
        accessor: 'full_name',
      width: 170,
    },
    {
      id: 'email',
      Header: formatMessage({id:'email'}),
      accessor: 'email',
      width: 150,
    },
    {
      id: 'phone_number',
      Header: formatMessage({id:'phone_number'}),
      accessor: 'phone_number',
      width: 150,
    },
    {
      id: 'active',
      Header: 'Status',
      accessor: (user) => user.active ?
        <Tag intent={Intent.SUCCESS} minimal={true}><T id={'activate'} /></Tag> :
        <Tag intent={Intent.WARNING} minimal={true}><T id={'inactivate'} /></Tag>,
      width: 50,
      className: 'status',
    },
    {
      id: 'actions',
      Header: '',
      Cell: ({ cell }) => (
        <Popover
          content={actionMenuList(cell.row.original)}
          position={Position.RIGHT_TOP}
        >
          <Button icon={<Icon icon='ellipsis-h' />} />
        </Popover>
      ),
      className: 'actions',
      width: 50,
    },
  ], [actionMenuList,formatMessage]);

  const handelDataTableFetchData = useCallback(() => {
    onFetchData && onFetchData();
  }, []);

  return (
    <LoadingIndicator>
      <DataTable
        columns={columns}
        data={usersList}
        onFetchData={handelDataTableFetchData()}
        loading={fetchUsers.isFetching}
        manualSortBy={true}
        expandable={false}
      />

      <Alert
        cancelButtonText={<T id={'cancel'}/>}
        confirmButtonText={<T id={'move_to_trash'}/>}
        icon='trash'
        intent={Intent.DANGER}
        isOpen={deleteUserState}
        onCancel={handleCancelUserDelete}
        onConfirm={handleConfirmUserDelete}
      >
        <p>
          Are you sure you want to move <b>filename</b> to Trash? You will be
          able to restore it later, but it will become private to you.
        </p>
      </Alert>

      <Alert
        cancelButtonText={<T id={'cancel'}/>}
        confirmButtonText={<T id={'inactivate'}/>}
        icon='trash'
        intent={Intent.WARNING}
        isOpen={inactiveUserState}
        onCancel={handleCancelInactiveUser}
        onConfirm={handleConfirmUserActive}
      >
        <p>
          Are you sure you want to move <b>filename</b> to Trash? You will be
          able to restore it later, but it will become private to you.
        </p>
      </Alert>
    </LoadingIndicator>
  );
}

export default compose(
  DialogConnect,
  withDashboard,
  withUsers,
  withUsersActions,
)(UsersListPreferences);