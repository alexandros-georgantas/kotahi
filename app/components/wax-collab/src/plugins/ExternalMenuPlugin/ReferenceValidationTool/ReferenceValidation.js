import React, { useState } from 'react'

import Button from '../../../../../asset-manager/src/ui/Modal/Button'
// import { RefModal } from '../../../../../components-refModal/src/index'

function ReferenceValidation() {
  const [openModal, setOpenModal] = useState(false)
  return (
    <>
      <div>
        <Button
          className="px-4"
          label="Reference Linking and validation"
          onClick={() => {
            setOpenModal(true)
            console.log("Opening reference modal – this isn't implemented yet")
          }}
          title="Reference Validation"
        />
      </div>
      {/* <RefModal
        closeModal={() => {
          setOpenModal(false)
        }}
        isOpen={openModal}
      /> */}
    </>
  )
}

export default ReferenceValidation
