import React from 'react';
import intl from 'react-intl-universal';

import { Intent } from '@blueprintjs/core';
import { AppToaster } from 'components';

import NotifyViaSMSForm from '../../NotifyViaSMS/NotifyViaSMSForm';
import { useNotifyReceiptViaSMSContext } from './NotifyReceiptViaSMSFormProvider';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

/**
 * Notify Receipt Via SMS Form.
 */
function NotifyReceiptViaSMSForm({
  // #withDialogActions
  closeDialog,
}) {
  const { dialogName, receiptId } = useNotifyReceiptViaSMSContext();

  // Handles the form submit.
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    // Handle request response success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get('notify_via_sms.dialog.success_message'),
        intent: Intent.SUCCESS,
      });
      closeDialog(dialogName);
    };

    // Handle request response errors.
    const onError = ({
      response: {
        data: { errors },
      },
    }) => {
      setSubmitting(false);
    };
  };

  return (
    <NotifyViaSMSForm
      NotificationDetail={{}}
      NotificationName={dialogName}
      onSubmit={handleFormSubmit}
    />
  );
}

export default compose(withDialogActions)(NotifyReceiptViaSMSForm);
