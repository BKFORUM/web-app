import TextField from '@mui/material/TextField'
export const TextFieldCustom = ({
  error,
  onChange,
  label,
  value,
  width,
  placeholder,
  type,
}: any) => {
  return (
    <TextField
      type={type || 'text'}
      placeholder={placeholder || undefined}
      helperText={error?.message || error || null}
      sx={{ width: width !== undefined ? '100%' : width }}
      size="small"
      error={!!error}
      onChange={onChange}
      value={value}
      fullWidth
      label={label}
      variant="standard"
    />
  )
}
