import Box from '@mui/material/Box'
import { FormControl, FormHelperText, MenuItem, Select, Chip } from '@mui/material'
import { IOption } from '@interfaces/IForum'
interface IProps {
  onChange: any
  value: string[]
  error: any
  options: IOption[]
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export default function MultiSelect({
  onChange,
  value,
  error,
  options,
}: IProps): JSX.Element {
  return (
    <div>
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
          multiple
          value={value}
          onChange={onChange}
          MenuProps={MenuProps}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((item: any) => (
                <Chip
                  key={item}
                  label={options.find((option) => option.id === item)?.name}
                />
              ))}
            </Box>
          )}>
          {options?.map((option) => (
            <MenuItem
              key={option.id}
              value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
        {!!error && (
          <FormHelperText sx={{ margin: 0, fontSize: '14px', color: 'red' }}>
            {error.message}
          </FormHelperText>
        )}
      </FormControl>
    </div>
  )
}
