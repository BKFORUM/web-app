import { ChangeEvent, FC, useEffect, useState } from 'react'
import logo from '../../../assets/images/logobkforum.png'
import bgImage from '../../../assets/images/bg-login-default.jpg'
import TextFieldCustom from '@components/TextField'
import Button from '@components/Button'
import { useNavigate } from 'react-router-dom'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { authActionSelector, authStateSelector } from '@store/index'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'

interface Props {}

interface IDataResetPassword {
  password: string
  confirmPassword: string
  code: string
}

const defaultValues: IDataResetPassword = {
  password: '',
  confirmPassword: '',
  code: '',
}

const schema = yup.object().shape({
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  code: yup.string().required('Code is required'),
})

const ForgotPassword: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const { forgotPassword, resetPassword, setIsResetPasswordSuccess } =
    useStoreActions(authActionSelector)

  const { messageError, isResetPasswordSuccess } = useStoreState(authStateSelector)

  const { handleSubmit, control, setError, reset } = useForm<IDataResetPassword>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  })

  const [email, setEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [isRequest, setIsRequest] = useState(true)
  const [isConfirm, setIsConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    let countdown: any
    if (isConfirm) {
      countdown = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1
          } else {
            clearInterval(countdown)
            return 0
          }
        })
      }, 1000)
    } else {
      setTimeLeft(60)
    }
    return () => clearInterval(countdown)
  }, [isConfirm])

  useEffect(() => {
    setErrorEmail('')
  }, [email])

  useEffect(() => {
    if (!isResetPasswordSuccess) {
      setError('code', {
        type: 'server',
        message: messageError,
      })
      setIsResetPasswordSuccess(true)
    }
  }),
    [isResetPasswordSuccess]

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handelRequest = async (): Promise<void> => {
    if (email === '') {
      setErrorEmail('Email is required')
      return
    }

    const regex = /[0-9]{9}@sv1.dut.udn.vn/
    const matches = email.match(regex)
    if (!matches) {
      setErrorEmail('Email is not valid. Please use format: 123456789@sv1.dut.udn.vn')
      return
    }
    setIsLoading(true)
    const res = await forgotPassword({ email: email })
    if (res) {
      setIsConfirm(true)
      setIsRequest(false)
    }
    setIsLoading(false)
  }

  const onSubmit = async (data: IDataResetPassword): Promise<void> => {
    setIsLoading(true)
    const res = await resetPassword({
      email: email,
      token: data.code,
      password: data.password,
    })

    if (res && isResetPasswordSuccess) {
      navigate('/auth/login')
    }
    setIsLoading(false)
  }
  return (
    <div className="h-screen relative">
      <div className="h-screen">
        <div className="w-full h-full overflow-hidden lg:block xs:hidden ">
          <img
            className="w-full h-full object-cover"
            src={bgImage}
            alt="bgImage"
          />
        </div>
        <div className="lg:hidden xs:block bg-gradient-to-b from-[#B1C7FF] via-[#606CE7] to-[#0001CB] w-full min-h-screen z-0"></div>
      </div>
      <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center ">
        <div>
          <img
            src={logo}
            alt="logo"
          />
        </div>
        <div
          className="bg-white max-w-[450px]   z-50 mt-5 rounded-[25px]  p-8
        shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]">
          <h2 className="m-auto font-semibold text-center text-[28px] pt-1 pb-3">
            Khôi phục mật khẩu
          </h2>
          {isRequest && (
            <div>
              <label className="text-[14px] break-words font-medium text-gray-500 leading-0">
                Nhập email của bạn chúng tôi sẽ gửi mã khôi phục cho bạn
              </label>
              <TextFieldCustom
                error={errorEmail}
                onChange={handleChangeEmail}
                value={email}
              />
            </div>
          )}

          {isConfirm && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-2 w-full min-w-[300px]">
              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextFieldCustom
                    type="password"
                    error={error}
                    onChange={onChange}
                    value={value}
                    label="Nhập mật khẩu mới *"
                  />
                )}
              />

              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextFieldCustom
                    type="password"
                    error={error}
                    onChange={onChange}
                    value={value}
                    label="Nhập lại khẩu mới *"
                  />
                )}
              />
              <div className="mt-2">
                <div className="flex justify-between">
                  <span className="text-[14px] break-words font-medium text-gray-500 leading-0">
                    Mã khôi phục sẽ hết hiệu lực sau:
                  </span>
                  <span className="text-blue-500">{timeLeft}s</span>
                </div>
                <Controller
                  name="code"
                  control={control}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <TextFieldCustom
                      error={error}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
                {timeLeft === 0 && (
                  <p
                    onClick={() => handelRequest()}
                    className="text-right text-sm cursor-pointer hover:text-blue-400">
                    Gửi lại yêu cầu
                  </p>
                )}
              </div>
              <div>
                <Button
                  className="mt-8 w-full"
                  onClick={() => {
                    setIsConfirm(false)
                    setIsRequest(true)
                    setEmail('')
                    reset()
                  }}>
                  Nhập lại email nhận mã
                </Button>

                <Button
                  className="mt-2 w-full"
                  disabled={isLoading}
                  loading={isLoading}>
                  Xác thực
                </Button>
              </div>
            </form>
          )}

          {isRequest && (
            <Button
              className="mt-20 w-full"
              onClick={() => {
                handelRequest()
              }}
              disabled={isLoading}
              loading={isLoading}>
              Gửi yêu cầu
            </Button>
          )}

          <p
            onClick={() => navigate('/auth/login')}
            className="mt-2 w-full text-center cursor-pointer text-blue-500">
            Đăng nhập
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
