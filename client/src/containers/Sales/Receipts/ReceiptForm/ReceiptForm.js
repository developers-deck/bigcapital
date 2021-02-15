import React, { useMemo } from 'react';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { Intent } from '@blueprintjs/core';
import { useIntl } from 'react-intl';
import { pick, sumBy, isEmpty } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';

import { CLASSES } from 'common/classes';
import { ERROR } from 'common/errors';
import {
  EditReceiptFormSchema,
  CreateReceiptFormSchema,
} from './ReceiptForm.schema';

import 'style/pages/SaleReceipt/PageForm.scss';

import { useReceiptFormContext } from './ReceiptFormProvider';

import ReceiptFromHeader from './ReceiptFormHeader';
import ReceiptFormBody from './ReceiptFormBody';
import ReceiptFormFloatingActions from './ReceiptFormFloatingActions';
import ReceiptFormFooter from './ReceiptFormFooter';

import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withSettings from 'containers/Settings/withSettings';

import { AppToaster } from 'components';
import {
  compose,
  repeatValue,
  orderingLinesIndexes,
  transactionNumber,
} from 'utils';

const MIN_LINES_NUMBER = 4;

const defaultReceipt = {
  index: 0,
  item_id: '',
  rate: '',
  discount: 0,
  quantity: '',
  description: '',
};

const defaultInitialValues = {
  customer_id: '',
  deposit_account_id: '',
  receipt_number: '',
  receipt_date: moment(new Date()).format('YYYY-MM-DD'),
  reference_no: '',
  receipt_message: '',
  statement: '',
  closed: '',
  entries: [...repeatValue(defaultReceipt, MIN_LINES_NUMBER)],
};

/**
 * Receipt form.
 */
function ReceiptForm({
  // #withSettings
  receiptNextNumber,
  receiptNumberPrefix,
  preferredDepositAccount,
}) {
  const { formatMessage } = useIntl();
  const history = useHistory();

  // Receipt form context.
  const {
    receiptId,
    receipt,
    editReceiptMutate,
    createReceiptMutate,
    submitPayload
  } = useReceiptFormContext();

  const isNewMode = !receiptId;

  // The next receipt number.
  const receiptNumber = transactionNumber(
    receiptNumberPrefix,
    receiptNextNumber,
  );
  // Initial values in create and edit mode.
  const initialValues = useMemo(
    () => ({
      ...(!isEmpty(receipt)
        ? {
            ...pick(receipt, Object.keys(defaultInitialValues)),
            entries: [
              ...receipt.entries.map((receipt) => ({
                ...pick(receipt, Object.keys(defaultReceipt)),
              })),
              ...repeatValue(
                defaultReceipt,
                Math.max(MIN_LINES_NUMBER - receipt.entries.length, 0),
              ),
            ],
          }
        : {
            ...defaultInitialValues,
            receipt_number: receiptNumber,
            deposit_account_id: parseInt(preferredDepositAccount),
            entries: orderingLinesIndexes(defaultInitialValues.entries),
          }),
    }),
    [receipt, preferredDepositAccount, receiptNumber],
  );

  // Transform response error to fields.
  const handleErrors = (errors, { setErrors }) => {
    if (errors.some((e) => e.type === ERROR.SALE_RECEIPT_NUMBER_NOT_UNIQUE)) {
      setErrors({
        receipt_number: formatMessage({
          id: 'sale_receipt_number_not_unique',
        }),
      });
    }
  };

  // Handle the form submit.
  const handleFormSubmit = (
    values,
    { setErrors, setSubmitting, resetForm },
  ) => {
    const entries = values.entries.filter(
      (item) => item.item_id && item.quantity,
    );
    const totalQuantity = sumBy(entries, (entry) => parseInt(entry.quantity));

    if (totalQuantity === 0) {
      AppToaster.show({
        message: formatMessage({
          id: 'quantity_cannot_be_zero_or_empty',
        }),
        intent: Intent.DANGER,
      });
      setSubmitting(false);
      return;
    }
    const form = {
      ...values,
      closed: submitPayload.status,
      entries: entries.map((entry) => ({
        // Exclude all properties that out of request entries schema.
        ...pick(entry, Object.keys(defaultReceipt)),
      })),
    };
    // Handle the request success.
    const onSuccess = (response) => {
      AppToaster.show({
        message: formatMessage(
          {
            id: isNewMode
              ? 'the_receipt_has_been_created_successfully'
              : 'the_receipt_has_been_edited_successfully',
          },
          { number: values.receipt_number },
        ),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);

      if (submitPayload.redirect) {
        history.push('/receipts');
      }
      if (submitPayload.resetForm) {
        resetForm();
      }
    };

    // Handle the request error.
    const onError = (errors) => {
      handleErrors(errors, { setErrors });
      setSubmitting(false);
    };

    if (receipt && receipt.id) {
      editReceiptMutate(receipt.id, form).then(onSuccess).catch(onError);
    } else {
      createReceiptMutate(form).then(onSuccess).catch(onError);
    }
  };

  return (
    <div
      className={classNames(
        CLASSES.PAGE_FORM,
        CLASSES.PAGE_FORM_STRIP_STYLE,
        CLASSES.PAGE_FORM_RECEIPT,
      )}
    >
      <Formik
        validationSchema={
          isNewMode ? CreateReceiptFormSchema : EditReceiptFormSchema
        }
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <ReceiptFromHeader />
          <ReceiptFormBody defaultReceipt={defaultReceipt} />
          <ReceiptFormFooter />
          <ReceiptFormFloatingActions />
        </Form>
      </Formik>
    </div>
  );
}

export default compose(
  withDashboardActions,
  withSettings(({ receiptSettings }) => ({
    receiptNextNumber: receiptSettings?.nextNumber,
    receiptNumberPrefix: receiptSettings?.numberPrefix,
    preferredDepositAccount: receiptSettings?.preferredDepositAccount,
  })),
)(ReceiptForm);