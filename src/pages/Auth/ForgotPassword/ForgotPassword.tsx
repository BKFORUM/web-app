import { ChangeEvent, FC, useEffect, useState } from 'react'
import logo from '../../../assets/images/logobkforum.png'
import bgImage from '../../../assets/images/bg-login-default.jpg'
import TextFieldCustom from '@components/TextField'
import Button from '@components/Button'

interface Props {}

const ForgotPassword: FC<Props> = (): JSX.Element => {
  const [email, setEmail] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [isRequest, setIsRequest] = useState(true)
  const [isConfirm, setIsConfirm] = useState(false)
  const [isConfirmPassword, setIsConfirmPassword] = useState(false)

  const [timeLeft, setTimeLeft] = useState(60)

  let countdown: any
  useEffect(() => {
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

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handelRequest = () => {
    console.log(1111)
  }

  const handelConfirm = () => {
    setIsConfirm(false)
    setIsConfirmPassword(true)
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
          <h2 className="m-auto font-semibold text-center text-[28px] pt-3 pb-5">
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
            <div className="flex flex-col gap-3 w-full">
              <div className="flex justify-between">
                <span className="text-[14px] break-words font-medium text-gray-500 leading-0">
                  Mã khôi phục sẽ hết hiệu lực sau:
                </span>
                <span className="text-blue-500">{timeLeft}s</span>
              </div>
              <TextFieldCustom
                error={errorEmail}
                onChange={handleChangeEmail}
                value={email}
                placeholder="Mã khôi phục"
              />
              {timeLeft === 0 && (
                <p
                  onClick={() => handelRequest()}
                  className="text-right text-sm cursor-pointer hover:text-blue-400">
                  Gửi lại yêu cầu
                </p>
              )}
            </div>
          )}

          {isConfirmPassword && (
            <div className="flex-1 flex flex-col gap-4 min-w-[280px]">
              <TextFieldCustom
                error={errorEmail}
                onChange={handleChangeEmail}
                value={email}
                label="Nhập mật khẩu mới"
              />

              <TextFieldCustom
                error={errorEmail}
                onChange={handleChangeEmail}
                value={email}
                label="Nhập lại mật khẩu"
              />
            </div>
          )}

          {isRequest && (
            <Button
              className="mt-20 w-full"
              onClick={() => {
                setIsConfirm(true)
                setIsRequest(false)
                handelRequest()
              }}
              // disabled={isLoading}
              // loading={isLoading}
            >
              Gửi yêu cầu
            </Button>
          )}
          {isConfirm && (
            <>
              <Button
                className="mt-14 w-full"
                onClick={() => {
                  setIsConfirm(false)
                  setIsRequest(true)
                }}
                // disabled={isLoading}
                // loading={isLoading}
              >
                Nhập lại email nhận mã
              </Button>

              <Button
                className="mt-2 w-full"
                onClick={() => handelConfirm()}
                // disabled={isLoading}
                // loading={isLoading}
              >
                Xác thực
              </Button>
            </>
          )}
          {isConfirmPassword && (
            <Button
              className="mt-10 w-full"
              // disabled={isLoading}
              // loading={isLoading}
            >
              Xác thực
            </Button>
          )}
          {!isConfirmPassword && (
            <p className="mt-2 w-full text-center cursor-pointer text-blue-500">
              Đăng nhập
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
