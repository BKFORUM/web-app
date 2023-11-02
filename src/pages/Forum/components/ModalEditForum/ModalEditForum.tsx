import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import TextFieldV2 from '@components/TextFieldV2'
import Selected from '@components/Select'
import MultiImage from '@components/MultiImage'
import Button from '@components/Button'
import { IFormDataForum, IForumDetail, IOption, ITopic } from '@interfaces/IForum'
import { Type } from '@commom/enum'
import { useParams } from 'react-router-dom'
import MultiSelect from '@components/MultiSelect'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { forumActionSelector, userStateSelector } from '@store/index'

interface Props {
  forum: IForumDetail | null
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleAction: (data: any) => Promise<void>
  isLoading: boolean
}

interface Image {
  name: string
  fileUrl: string
}

const optionTypes: IOption[] = [
  {
    id: Type.HOMEROOM,
    name: Type.HOMEROOM,
  },
  {
    id: Type.TOPIC,
    name: Type.TOPIC,
  },
]

const schema = yup.object().shape({
  name: yup.string().required('Name không được để trống !!!'),
  moderatorId: yup.string().required('Moderator không được để trống !!!'),
  type: yup.string().required('Type không được để trống !!!'),
  topicIds: yup.array().when('type', {
    is: (val: string) => val === 'TOPIC',
    then: () =>
      yup
        .array()
        .of(yup.string())
        .min(1, 'Please select at least one option')
        .required('Please select at least one option'),
    otherwise: () => yup.array().transform((current) => current || []),
  }),
})

const ModalEditForum: FC<Props> = ({
  open,
  setOpen,
  handleAction,
  forum,
  isLoading,
}: Props): JSX.Element => {
  const { id } = useParams()
  const ImageRef: any = useRef()
  const formRef = useRef<HTMLFormElement>(null)
  const { getAllTopic } = useStoreActions(forumActionSelector)
  const { currentUserSuccess } = useStoreState(userStateSelector)

  const [Images, setImages] = useState<Image[]>([])
  const [FileImages, setFileImages] = useState<File[]>([])
  const [messErrorImage, setMessErrorImage] = useState<string>('')
  const lengthTopic = forum?.topics?.length || 0
  const typeTmp = lengthTopic === 0 ? 'HOMEROOM' : 'TOPIC'
  const defaultValues: IFormDataForum = {
    id: id || '',
    name: forum?.name || '',
    moderatorId: (forum?.moderator?.id || currentUserSuccess?.id || '').toString(),
    type: typeTmp || '',
    topicIds:
      (forum?.topics?.map((item: any) => item.topic.id.toString()) as string[]) || [],
  }
  const { handleSubmit, control, watch, setValue } = useForm<IFormDataForum>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema) as any,
  })

  const [optionsTopic, setOptionsTopic] = useState<IOption[]>([])

  const getAllTopicForum = async (): Promise<void> => {
    const res = await getAllTopic()
    if (res) {
      const data = res.map((item: ITopic) => {
        return {
          id: item.id,
          name: item.name,
        }
      })
      setOptionsTopic(data)
    }
  }

  const selectedType = watch('type')

  useEffect(() => {
    if (selectedType === 'HOMEROOM') setValue('topicIds', [])
  }, [selectedType])

  const onSubmit = async (data: IFormDataForum) => {
    handleAction({ ...data, avatarUrl: FileImages })
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
    getAllTopicForum()
    if (forum !== null && forum?.avatarUrl !== null) {
      const imagePreview: Image[] = [
        {
          name: forum?.name || '',
          fileUrl: forum?.avatarUrl || '',
        },
      ]
      setImages(imagePreview)
    }
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
                <Dialog.Panel className="relative w-full max-w-[700px] flex flex-col transform  rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col gap-2 relative">
                    <h2 className="m-auto text-xl font-semibold">
                      {!forum ? 'Add' : 'Edit'} Forum
                    </h2>
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
                        className="col-span-3  flex flex-col gap-2  overflow-y-auto"
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-1 ">
                          <label
                            htmlFor=""
                            className="font-semibold text-gray-700">
                            Name <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name="name"
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
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor=""
                            className="font-semibold text-gray-700">
                            Type<span className="text-red-600"> *</span>
                          </label>
                          <Controller
                            name="type"
                            control={control}
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <Selected
                                onChange={onChange}
                                value={value}
                                error={error}
                                options={optionTypes}
                                empty="Select Type"
                              />
                            )}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor=""
                            className="font-semibold text-gray-700">
                            Moderator<span className="text-red-600"> *</span>
                          </label>
                          <div>
                            <TextFieldV2
                              value={currentUserSuccess?.fullName}
                              disabled={true}
                            />
                          </div>
                        </div>

                        {selectedType === 'TOPIC' && (
                          <div className="flex flex-col gap-1">
                            <label
                              htmlFor=""
                              className="font-semibold text-gray-700">
                              Categories<span className="text-red-600"> *</span>
                            </label>
                            <Controller
                              name="topicIds"
                              control={control}
                              render={({
                                field: { onChange, value },
                                fieldState: { error },
                              }) => (
                                <MultiSelect
                                  onChange={onChange}
                                  value={value}
                                  options={optionsTopic}
                                  error={error}
                                />
                              )}
                            />
                          </div>
                        )}
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

export default ModalEditForum
