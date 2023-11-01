import { FC } from 'react'
import { Controller } from 'react-hook-form'

interface IProps {
  name: string
  control: any
  placeholder?: string
  disabled?: boolean
}

const CustomTextInput = ({
  error,
  onChange,
  value,
  placeholder,
  disabled,
}: any): JSX.Element => {
  return (
    <div className="flex flex-col gap-1">
      <input
        disabled={disabled}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-3 py-2.5 bg-[#E6F0F6] rounded-md outline-none ${
          !!error && 'border border-red-600'
        } ${disabled && 'cursor-not-allowed text-gray-400'}`}
      />
      {!!error && <span className="text-red-600 text-sm">{error?.message}</span>}
    </div>
  )
}

const TextFieldV2: FC<IProps> = ({
  name,
  control,
  placeholder,
  disabled,
}: IProps): JSX.Element => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <CustomTextInput
          disabled={disabled}
          error={error}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
        />
      )}
    />
  )
}

export default TextFieldV2
