import { FC } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

interface Props {
  error?: any
  onChange: any
  value: string
}

dayjs.extend(utc)

const DateTimePickerV2: FC<Props> = ({ error, onChange, value }: Props): JSX.Element => {
  const defaultValue = value === '' ? 'DD/MM/YYYY HH:mm' : value
  return (
    <div className="flex flex-col gap-1">
      <DateTimePicker
        sx={{
          '& .MuiInputBase-input': {
            paddingY: 1.5,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderRadius: '8px',
            border: !!error ? '1px solid red' : 'none',
          },
          backgroundColor: '#E6F0F6',
          borderRadius: '8px',
        }}
        format="DD/MM/YYYY HH:mm"
        value={dayjs(defaultValue)}
        onChange={onChange}
      />
      {!!error && <span className="text-red-600 text-sm">{error?.message}</span>}
    </div>
  )
}

export default DateTimePickerV2
