import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import TextFieldCustom from '@components/TextField'
import Button from '@components/Button'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { authActionSelector, authStateSelector, notifyActionSelector } from '@store/index'

interface Props {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface IDataChangePassword {
  password: string
  newPassword: string
  confirmPassword: string
}

const defaultValues: IDataChangePassword = {
  password: '',
  newPassword: '',
  confirmPassword: '',
}

const schema = yup.object().shape({
  password: yup.string().required('Password is required'),
  newPassword: yup.string().required('New Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
})

const ModalChangePassword: FC<Props> = ({ open, setOpen }: Props): JSX.Element => {
  const { setIsChangePasswordSuccess, changePassword } =
    useStoreActions(authActionSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const { isChangePasswordSuccess, messageError } = useStoreState(authStateSelector)

  const { handleSubmit, control } = useForm<IDataChangePassword>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  })

  const [loading, setLoading] = useState<boolean>(false)

  const onSubmit = async (data: IDataChangePassword): Promise<void> => {
    setLoading(true)
    const res = await changePassword({
      newPassword: data.newPassword,
      oldPassword: data.password,
    })

    if (res) {
      setNotifySetting({
        show: true,
        status: 'success',
        message: 'Change password successfully',
      })
    }
    setLoading(false)
    setOpen(false)
  }

  useEffect(() => {
    if (!isChangePasswordSuccess) {
      setNotifySetting({
        show: true,
        status: 'error',
        message: messageError,
      })
      setIsChangePasswordSuccess(true)
    }
  }, [isChangePasswordSuccess])

  return (
    <div>
      <Transition
        appear
        show={open}
        as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="relative w-full max-w-md flex flex-col transform  rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col gap-2 relative">
                    <h2 className="m-auto text-xl font-semibold">Thay đổi mật khẩu</h2>
                    <span
                      className="absolute top-0 right-0 text-xl text-gray-500 cursor-pointer"
                      onClick={() => setOpen(false)}>
                      X
                    </span>
                  </div>
                  <div className="mt-2.5">
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col gap-2 w-full px-2">
                      <Controller
                        name="password"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <TextFieldCustom
                            type="password"
                            error={error}
                            onChange={onChange}
                            value={value}
                            label="Nhập mật khẩu cũ *"
                          />
                        )}
                      />

                      <Controller
                        name="newPassword"
                        control={control}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <TextFieldCustom
                            type="password"
                            error={error}
                            onChange={onChange}
                            value={value}
                            label="Nhập mật khẩu mới *"
                          />
                        )}
                      />
                      <div className="mt-2">
                        <Controller
                          name="confirmPassword"
                          control={control}
                          render={({
                            field: { onChange, value },
                            fieldState: { error },
                          }) => (
                            <TextFieldCustom
                              type="password"
                              label="Nhập lại khẩu mới *"
                              error={error}
                              onChange={onChange}
                              value={value}
                            />
                          )}
                        />
                      </div>
                      <div className="mt-8 mb-4  flex justify-center w-full ">
                        <Button
                          typeButton="primary"
                          type="submit"
                          disabled={loading}
                          loading={loading}>
                          Save
                        </Button>

                        <Button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="ml-4 transition-all duration-300 bg-gray-500 hover:bg-gray-800 text-white px-6 py-1.5 shadow rounded-2xl border-none">
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default ModalChangePassword
