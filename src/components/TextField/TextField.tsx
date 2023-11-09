import TextField from '@mui/material/TextField'
export const TextFieldCustom = ({
  error,
  onChange,
  label,
  value,
  width,
  placeholder,
}: any) => {
  return (
    <TextField
      placeholder={placeholder || undefined}
      helperText={error ? error.message : null}
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
