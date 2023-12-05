import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { IEvent } from '@interfaces/IEvent'
import TextFieldV2 from '@components/TextFieldV2'
import DateTimePickerV2 from '@components/DateTimePickerV2'
import RichTextEditTor from '@components/RichTextEditor'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import MultiImageV2 from '@components/MultiImageV2'
import Button from '@components/Button'
import { IDocuments } from '@interfaces/IPost'
import htmlToDraft from 'html-to-draftjs'

interface Props {
  loading: boolean
  item?: IEvent
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleAction?: (data: any) => Promise<void>
}

interface Image {
  name: string
  fileUrl: string
}

const schema = yup.object().shape({
  displayName: yup.string().required('Name is valid!'),
  location: yup.string().required('Location of birth is valid!'),
  startAt: yup
    .string()
    .required('Start Time is required!')
    .test({
      name: 'start-time-check',
      exclusive: true,
      message: 'Start Time must be less than End Time',
      test: function (value) {
        const { endAt } = this.parent
        return !endAt || new Date(value) < new Date(endAt)
      },
    })
    .test({
      name: 'start-time-future-check',
      message: 'Start Time must be in the future',
      test: function (value) {
        const currentTime = new Date()
        return new Date(value) > currentTime
      },
    }),
  endAt: yup
    .string()
    .required('End Time is required!')
    .test({
      name: 'end-time-check',
      exclusive: true,
      message: 'End Time must be greater than Start Time',
      test: function (value) {
        const { startAt } = this.parent
        return !startAt || new Date(value) > new Date(startAt)
      },
    }),
  content: yup.string().required('Description is valid!'),
})

const ModalAddEditEvent: FC<Props> = ({
  open,
  setOpen,
  item,
  handleAction,
  loading,
}): JSX.Element => {
  const ImageRef: any = useRef()
  const [Images, setImages] = useState<Image[]>([])
  const [FileImages, setFileImages] = useState<File[]>([])
  const [imageEdit, setImageEdit] = useState<IDocuments[]>([])
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const defaultValues: IEvent = {
    id: item?.id || '',
    displayName: item?.displayName || '',
    location: item?.location || '',
    startAt: item?.startAt || '',
    endAt: item?.endAt || '',
    content: item?.content || '',
  }

  const { handleSubmit, control, setValue, watch, clearErrors } = useForm<IEvent>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: IEvent) => {
    handleAction &&
      handleAction({ ...data, FileImages: FileImages, imageEdit: imageEdit })
  }

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState)
    if (editorState.getCurrentContent().hasText()) {
      const dataHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()))
      setValue('content', dataHTML)
    } else {
      setValue('content', '')
    }
  }

  const _deleteImage = (image: any) => {
    const newImage = Images.filter((file: any) => file.name !== image.name)
    setImages(newImage)
    const newFileImages = FileImages.filter(
      (file: any) => file.name.split('.')[0] !== image.name,
    )
    setFileImages(newFileImages)
    if (item) {
      const newImageEdit = imageEdit.filter((file: any) => file.fileName !== image.name)
      setImageEdit(newImageEdit)
    }
  }

  const handleFileChange = (file: any) => {
    const newFiles: any = Array.from(file)
    let newImages: any = [...Images]
    newImages = [...newFiles, ...Images]
    setFileImages(newImages)
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

  const descriptionValue = watch('content')
  console.log(descriptionValue)

  useEffect(() => {
    if (descriptionValue !== '') {
      clearErrors('content')
    }
  }, [editorState])

  useEffect(() => {
    if (item) {
      const contentBlock = htmlToDraft(item.content)
      const { contentBlocks, entityMap } = contentBlock
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      const newEditorState = EditorState.createWithContent(contentState)
      setTimeout(() => {
        setEditorState(newEditorState)
        setValue('content', item.content)
      }, 50)
      if (item.documents !== undefined) {
        const image = item.documents.map((data) => {
          return { fileUrl: data.fileUrl, name: data.fileName }
        })
        setImageEdit(item.documents)
        if (image.length > 0) {
          setImages(image)
        }
      }
    }
  }, [item])
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
                <Dialog.Panel className="relative max-w-[600px] flex flex-col rounded-xl bg-white text-left  shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center shadow py-3 ">
                    {!item ? 'Add' : 'Edit'} Event
                  </Dialog.Title>
                  <div>
                    <form
                      action=""
                      className={`flex flex-col gap-2 max-h-[550px] overflow-auto px-4 py-2`}
                      onSubmit={handleSubmit(onSubmit)}>
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor=""
                          className="font-semibold text-gray-700">
                          Name <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name="displayName"
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

                      <div className="grid grid-cols-2 justify-between gap-4 ">
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor=""
                            className="font-semibold text-gray-700">
                            Start time <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name="startAt"
                            control={control}
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <DateTimePickerV2
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
                            Start time <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name="endAt"
                            control={control}
                            render={({
                              field: { onChange, value },
                              fieldState: { error },
                            }) => (
                              <DateTimePickerV2
                                error={error}
                                onChange={onChange}
                                value={value}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor=""
                          className="font-semibold text-gray-700">
                          Location <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name="location"
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
                          Description <span className="text-red-600">*</span>
                        </label>

                        <Controller
                          name="content"
                          control={control}
                          render={({ field: {}, fieldState: { error } }) => (
                            <RichTextEditTor
                              editorState={editorState}
                              onEditorStateChange={onEditorStateChange}
                              error={error}
                              type="events"
                            />
                          )}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor=""
                          className="font-semibold text-gray-700">
                          Image
                        </label>
                        <div className="grid gap-1">
                          <MultiImageV2
                            listImage={Images}
                            deleteImage={_deleteImage}
                            handleFileChange={handleFileChange}
                            InputRef={ImageRef}
                          />
                        </div>
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

export default ModalAddEditEvent
