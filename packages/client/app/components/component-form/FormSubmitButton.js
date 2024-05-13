import React, { useState } from 'react'
import styled from 'styled-components'
import { ActionButton } from '../shared'
import { articleStatuses } from '../../globals'
import Confirm from './Confirm'

const ModalWrapper = styled.div`
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10000;
`

const FormSubmitButton = ({
  form,
  text,
  handleSubmit,
  validateForm,
  values,
  errors,
  isSubmitting,
  submitCount,
  submitButtonOverrideStatus,
}) => {
  const [buttonIsPending, setButtonIsPending] = useState(false)
  const [submitSucceeded, setSubmitSucceeded] = useState(false)
  const [confirming, setConfirming] = React.useState(false)

  const toggleConfirming = () => {
    setConfirming(confirm => !confirm)
  }

  const hasPopup = form.haspopup ? JSON.parse(form.haspopup) : false
  const shouldShowPopup = hasPopup && values.status !== 'revise'

  return (
    <div>
      <ActionButton
        dataTestid={`${form.name
          ?.toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]+/g, '')}-action-btn`}
        onClick={async () => {
          setButtonIsPending(true)

          const hasErrors = Object.keys(await validateForm()).length !== 0

          // If there are errors, do a fake submit
          // to focus on the error
          if (
            hasErrors ||
            values.status === articleStatuses.evaluated ||
            values.status === articleStatuses.submitted ||
            !shouldShowPopup
          ) {
            handleSubmit()
            setSubmitSucceeded(!hasErrors)
          } else {
            toggleConfirming()
          }

          setButtonIsPending(false)
        }}
        primary
        status={
          /* eslint-disable no-nested-ternary */
          submitButtonOverrideStatus ??
          (buttonIsPending || isSubmitting
            ? 'pending'
            : Object.keys(errors).length && submitCount
            ? '' // TODO Make this case 'failure', once we've fixed the validation delays in the form
            : submitSucceeded
            ? 'success'
            : '')
          /* eslint-enable no-nested-ternary */
        }
      >
        {text}
      </ActionButton>
      {confirming && (
        <ModalWrapper>
          <Confirm
            errors={errors}
            form={form}
            submit={handleSubmit}
            toggleConfirming={toggleConfirming}
          />
        </ModalWrapper>
      )}
    </div>
  )
}

export default FormSubmitButton
