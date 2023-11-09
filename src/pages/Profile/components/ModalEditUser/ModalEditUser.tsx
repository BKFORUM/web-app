import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import TextFieldV2 from '@components/TextFieldV2'
import DateTimePicker from '@components/DateTimePicker'
import Selected from '@components/Select'
import MultiImage from '@components/MultiImage'
import { ICurrentUser, IUserData } from '@interfaces/IUser'
import Button from '@components/Button'
import { IOption } from '@interfaces/IForum'
import { Gender } from '@commom/enum'

interface Props {
  user: ICurrentUser | undefined
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleAction: (data: any) => Promise<void>
  isLoading: boolean
}

interface Image {
  name: string
  fileUrl: string
}

const optionsGender: IOption[] = [
  {
    id: Gender.MALE,
    name: Gender.MALE,
  },
  {
    id: Gender.FEMALE,
    name: Gender.FEMALE,
  },
]

const schema = yup.object().shape({
  fullName: yup.string().required('Name is valid!'),
  dateOfBirth: yup.string().required('Date of birth is valid!'),
  gender: yup.string().required('Gender is valid!'),
  type: yup.string().required('Role is valid!'),
  email: yup
    .string()
    .matches(
      /[0-9]{9}@sv1.dut.udn.vn/,
      'Invalid email format. Please use the format: 123456789@sv1.dut.udn.vn',
    )
    .required('Email is required'),
  phoneNumber: yup.string().required('Phone number is valid!'),
})

const ModalEditUser: FC<Props> = ({
  open,
  setOpen,
  handleAction,
  user,
  isLoading,
}: Props): JSX.Element => {
  const ImageRef: any = useRef()
  const formRef = useRef<HTMLFormElement>(null)
  const [Images, setImages] = useState<Image[]>([])
  const [FileImages, setFileImages] = useState<File[]>([])
  const [messErrorImage, setMessErrorImage] = useState<string>('')
  const defaultValues: IUserData = {
    id: user?.id || '',
    fullName: user?.fullName || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth || '',
    facultyName: user?.faculty.name || '',
    type: user?.type || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
  }
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IUserData>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: IUserData) => {
    if (Images.length === 0) {
      setMessErrorImage('Avatar không dc để trống')
      return
    } else {
      handleAction({ ...data, avatarUrl: FileImages })
    }
  }

  const _deleteImage = (image: any) => {
    const newImage = Images.filter((file: any) => file.name !== image.name)
    setImages(newImage)
    const newFileImages = FileImages.filter(
      (file: any) => file.name.split('.')[0] !== image.name,
    )
    setFileImages(newFileImages)
  }

  const handleFileChange = (file: any) => {
    setFileImages(file)
    const newFiles: any = Array.from(file)
    let newImages = [...newFiles]
    const newImagePreview: any = newImages.map((fileImage: any) => {
      if (fileImage.size) {
        return {
          name: fileImage.name.split('.')[0],
          fileUrl: URL.createObjectURL(fileImage),
        }
      }
      return fileImage
    })
    setImages(newImagePreview)
  }

  const handleExternalButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      )
    }
  }

  useEffect(() => {
    setMessErrorImage('')
  }, [Images])

  useEffect(() => {
    const imagePreview: Image[] = [
      {
        name: user?.fullName || '',
        fileUrl: user?.avatarUrl || '',
      },
    ]
    setImages(imagePreview)
  }, [])
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
                <Dialog.Panel className="relative w-full max-w-[800px] flex flex-col transform  rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col gap-2 relative">
                    <h2 className="m-auto text-xl font-semibold">Edit user</h2>
                    <span
                      className="absolute top-0 right-0 text-xl text-gray-500 cursor-pointer"
                      onClick={() => setOpen(false)}>
                      X
                    </span>

                    <div className="grid grid-cols-5 gap-4">
                      <div className="col-span-2 flex flex-col ">
                        <label
                          htmlFor=""
                          className="font-semibold text-gray-700">
                          Avatar<span className="text-red-600">*</span>
                        </label>
                        <MultiImage
                          single={true}
                          listImage={Images}
                          deleteImage={_deleteImage}
                          handleFileChange={handleFileChange}
                          InputRef={ImageRef}
                        />
                        {messErrorImage !== '' && (
                          <span className="text-sm text-red-500">{messErrorImage}</span>
                        )}
                      </div>
                      <form
                        ref={formRef}
                        className={`col-span-3 flex flex-col gap-2 ${
                          !!errors && Object.keys(errors).length > 2
                            ? 'h-[500px] overflow-scroll '
                            : 'h-auto'
                        }`}
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2  gap-2 items-center ">
                          <div className="flex flex-col">
                            <label
                              htmlFor=""
                              className="font-semibold text-gray-700">
                              Name <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              name="fullName"
                              control={control}
                              render={({
                                field: { onChange, value },
                                fieldState: { error },
                              }) => (
                                <TextFieldV2
                                  error={error}
                                  onChange={onChange}
                                  value={value}
                                />
                              )}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label
                              htmlFor=""
                              className="font-semibold text-gray-700">
                              Date of birth <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              name="dateOfBirth"
                              control={control}
                              render={({
                                field: { onChange, value },
                                fieldState: { error },
                              }) => (
                                <DateTimePicker
                                  error={error}
                                  onChange={onChange}
                                  value={value}
                                />
                              )}
                            />
                          </div>

                          <div className="flex flex-col">
                            <label
                              htmlFor=""
                              className="font-semibold text-gray-700">
                              Gender <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              name="gender"
                              control={control}
                              render={({
                                field: { onChange, value },
                                fieldState: { error },
                              }) => (
                                <Selected
                                  error={error}
                                  onChange={onChange}
                                  value={value}
                                  options={optionsGender}
                                  empty="Select gender"
                                />
                              )}
                            />
                          </div>

                          <div className="flex flex-col">
                            <label
                              htmlFor=""
                              className="font-semibold text-gray-700">
                              Role <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              name="type"
                              control={control}
                              render={({
                                field: { onChange, value },
                                fieldState: { error },
                              }) => (
                                <TextFieldV2
                                  error={error}
                                  onChange={onChange}
                                  value={value}
                                  disabled={true}
                                />
                              )}
                            />
                          </div>

                          <div className="flex flex-col ">
                            <label
                              htmlFor=""
                              className="font-semibold text-gray-700">
                              Faculty <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              name="facultyName"
                              control={control}
                              render={({
                                field: { onChange, value },
                                fieldState: { error },
                              }) => (
                                <TextFieldV2
                                  error={error}
                                  onChange={onChange}
                                  value={value}
                                  disabled={true}
                                />
                              )}
                            />
                          </div>

                          <div className="flex flex-col ">
                            <label
                              htmlFor=""
                              className="font-semibold text-gray-700">
                              Phone Number <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              name="phoneNumber"
                              control={control}
                              render={({
                                field: { onChange, value },
                                fieldState: { error },
                              }) => (
                                <TextFieldV2
                                  error={error}
                                  onChange={onChange}
                                  value={value}
                                />
                              )}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col ">
                          <label
                            htmlFor=""
                            className="font-semibold text-gray-700">
                            Email <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name="email"
                            control={control}
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <TextFieldV2
                                error={error}
                                onChange={onChange}
                                value={value}
                                disabled={true}
                              />
                            )}
                          />
                        </div>

                        <div className="flex flex-col ">
                          <label
                            htmlFor=""
                            className="font-semibold text-gray-700">
                            Address
                          </label>
                          <Controller
                            name="address"
                            control={control}
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <TextFieldV2
                                error={error}
                                onChange={onChange}
                                value={value}
                              />
                            )}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="mt-8 mb-4  flex justify-center w-full ">
                    <Button
                      onClick={handleExternalButtonClick}
                      typeButton="primary"
                      type="submit"
                      disabled={isLoading}
                      loading={isLoading}>
                      Save
                    </Button>

                    <Button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="ml-4 transition-all duration-300 bg-gray-500 hover:bg-gray-800 text-white px-6 py-1.5 shadow rounded-2xl border-none">
                      Cancel
                    </Button>
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

export default ModalEditUser
