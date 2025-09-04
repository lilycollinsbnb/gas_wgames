import React, { useState } from 'react'
import { License } from '@/types'
import { useSelectedLicense } from './lib/use-selected-license'
import Select from '../ui/forms/select'

type LicenseFilterProps = {
  licenses: License[]
}

const LicenseFilter: React.FC<LicenseFilterProps> = ({ licenses }) => {
  const { selectedLicense, handleLicenseChange } = useSelectedLicense()

  const options = [
    { value: '', label: 'text-any-license' }, // default "All" option
    ...licenses.map((license) => ({
      value: license.id,
      label: license.name
    }))
  ]

  return (
    <Select
      id="license"
      label="text-filter-by-license-label"
      value={selectedLicense}
      onChange={(e) => handleLicenseChange(e.target.value)}
      options={options}
      className="mb-4"
    />
  )
}

export default LicenseFilter
