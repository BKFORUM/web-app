import { IOption } from '@interfaces/IForum'
import { FormControl, FormHelperText, MenuItem, Select } from '@mui/material'
import { FC } from 'react'

interface Props {
  error: any
  onChange: any
  value: string
  empty?: string
  options?: IOption[]
}

// const options = [
//   { label: 'Ten', value: 10 },
//   { label: 'Twenty', value: 20 },
//   { label: 'Thirty', value: 30 },
// ]

const Selected: FC<Props> = ({
  error,
  onChange,
  value,
  empty,
  options,
}: Props): JSX.Element => {
  return (
    <FormControl
      sx={{ width: '100%' }}
      error={!!error}>
      <Select
        sx={{
          '& .MuiSelect-select': {
            paddingY: 1.5,
            backgroundColor: '#E6F0F6',
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
        {options?.map((option) => (
          <MenuItem
            key={option.id}
            value={option.id}>
            {option.name}
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
