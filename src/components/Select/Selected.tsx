import { FormControl, FormHelperText, MenuItem, Select } from '@mui/material'
import { FC } from 'react'

interface Props {
  error?: any
  onChange: any
  value: any
  empty?: string
  width?: string
}

const options = [
  { label: 'Ten', value: 10 },
  { label: 'Twenty', value: 20 },
  { label: 'Thirty', value: 30 },
]

const Selected: FC<Props> = ({
  error,
  onChange,
  value,
  empty,
  width,
}: Props): JSX.Element => {
  return (
    <FormControl
      sx={{ width: !width ? '100%' : width }}
      error={!!error}>
      <Select
        sx={{
          '& .MuiSelect-select': {
            paddingY: 1.5,
            // backgroundColor: '#E6F0F6',
            backgroundColor: '#e8e7e7',
            borderRadius: '8px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: !!error ? '' : 'none',
            borderRadius: '8px',
          },
        }}
        displayEmpty
        defaultValue=""
        value={value}
        onChange={onChange}>
        <MenuItem value="">
          <em>{empty}</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {!!error && (
        <FormHelperText sx={{ margin: 0, fontSize: '14px' }}>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default Selected
