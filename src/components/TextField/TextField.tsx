import TextField from '@mui/material/TextField'
export const TextFieldCustom = ({ error, onChange, label, value, width }: any) => {
  return (
    <TextField
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
