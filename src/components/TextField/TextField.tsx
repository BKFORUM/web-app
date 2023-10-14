import TextField from '@mui/material/TextField'
export const TextFieldCustom = ({ error, onChange, label, value }: any) => {
  return (
    <TextField
      helperText={error ? error.message : null}
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
