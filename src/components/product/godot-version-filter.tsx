import React from 'react'
import Select from '../ui/forms/select'
import { useSelectedGodotVersion } from './lib/use-selected-godot-version'
import { GodotVersionOption } from '@/types'

type GodotVersionFilterProps = {
  versions: GodotVersionOption[]
}

const GodotVersionFilter: React.FC<GodotVersionFilterProps> = ({
  versions
}) => {
  const { selectedVersion, handleVersionChange } = useSelectedGodotVersion()

  return (
    <Select
      id="godot-version"
      label="text-filter-by-godot-version-label"
      value={selectedVersion}
      onChange={(e) => handleVersionChange(e.target.value)}
      options={versions}
      className="mb-4"
    />
  )
}

export default GodotVersionFilter
