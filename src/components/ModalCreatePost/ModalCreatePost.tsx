import RichTextEditTor from '@components/RichTextEditor'
import { Dialog, Transition } from '@headlessui/react'
import { Tooltip } from '@mui/material'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { FaRegImages, FaRegSmile } from 'react-icons/fa'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import MultiImage from '@components/MultiImage'
import Button from '@components/Button'
import { IDocuments, IPostViewForum } from '@interfaces/IPost'
import htmlToDraft from 'html-to-draftjs'

interface Props {
  postSelected: IPostViewForum | null
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleAction: (data: any) => Promise<void>
  isLoading: boolean
}

interface Image {
  name: string
  fileUrl: string
}

const ModalCreatePost: FC<Props> = ({
  open,
  setOpen,
  handleAction,
  isLoading,
  postSelected,
}: Props): JSX.Element => {
  const ImageRef: any = useRef()
  const [step, setStep] = useState('post')
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [Images, setImages] = useState<Image[]>([])
  const [FileImages, setFileImages] = useState<File[]>([])
  const [imageEdit, setImageEdit] = useState<IDocuments[]>([])

  useEffect(() => {
    if (postSelected) {
      const contentBlock = htmlToDraft(postSelected.content)
      const { contentBlocks, entityMap } = contentBlock
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      const editorState = EditorState.createWithContent(contentState)
      setEditorState(editorState)
      const image = postSelected.documents.map((item) => {
        return { fileUrl: item.fileUrl, name: item.fileName }
      })
      setImageEdit(postSelected.documents)
      if (image.length > 0) {
        setStep('image')
        setImages(image)
      }
    }
  }, [postSelected, open])

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState)
  }

  const _deleteImage = (image: any) => {
    const newImage = Images.filter((file: any) => file.name !== image.name.split('.')[0])
    setImages(newImage)
    const newFileImages = FileImages.filter(
      (file: any) => file.name !== image.name.split('.')[0],
    )
    setFileImages(newFileImages)
    if (postSelected) {
      const newImageEdit = imageEdit.filter(
        (file: any) => file.fileName !== image.name.split('.')[0],
      )
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

  const handleCreatePost = async (): Promise<void> => {
    const dataHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    handleAction({ content: dataHTML, files: FileImages, imageEdit: imageEdit })
  }

  useEffect(() => {
    if (!open) {
      setEditorState(EditorState.createEmpty())
      setImages([])
      setStep('')
    }
  }, [open])

  return (
    <>
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
                  <Dialog.Panel className="relative w-full max-w-[520px] flex flex-col transform  rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 text-center  ">
                      {!postSelected ? 'Tạo' : 'Chỉnh sửa'} bài viết
                    </Dialog.Title>
                    <span
                      onClick={() => setOpen(false)}
                      className="absolute right-6 cursor-pointer top-[16px] text-lg text-gray-400">
                      X
                    </span>
                    <div className="max-h-[500px] overflow-auto">
                      <div className="mt-4 ">
                        <RichTextEditTor
                          editorState={editorState}
                          onEditorStateChange={onEditorStateChange}
                          height={step === 'image' ? '100px' : '200px'}
                        />
                      </div>

                      {step === 'image' && (
                        <div className="relative mt-4 px-3 py-1 border border-gray-300 rounded-md">
                          <div className="relative">
                            <h4 className="text-leftr font-semibold">Upload Image</h4>
                            <span
                              onClick={() => setStep('')}
                              className="text-gray-500 absolute top-0 right-0 cursor-pointer">
                              X
                            </span>
                          </div>
                          <div className="mt-2 ">
                            <MultiImage
                              listImage={Images}
                              deleteImage={_deleteImage}
                              handleFileChange={handleFileChange}
                              InputRef={ImageRef}
                              // disable={!isActionEdit && !!params?.id}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-4 rounded-md border border-gray-200 p-4 ">
                      <span>Thêm vào bài viết của bạn</span>
                      <Tooltip title="Hình ảnh">
                        <div>
                          <FaRegImages
                            className="ml-4 w-6 h-6 cursor-pointer text-emerald-500"
                            onClick={() => setStep('image')}
                          />
                        </div>
                      </Tooltip>
                      <Tooltip title="Icon">
                        <div>
                          <FaRegSmile className="w-6 h-6 cursor-pointer text-amber-300" />
                        </div>
                      </Tooltip>
                    </div>

                    <Button
                      loading={isLoading}
                      disabled={!!editorState.getCurrentContent().hasText() === false}
                      className={`mt-4 flex justify-center rounded-md border border-transparent bg-blue-400 hover:bg-blue-400 px-4 py-2 text-base font-medium text-blue-900 ${
                        !!editorState.getCurrentContent().hasText()
                          ? 'hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                          : 'cursor-not-allowed'
                      } `}
                      onClick={() => handleCreatePost()}>
                      {!postSelected ? 'Đăng' : 'Lưu'}
                    </Button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </>
  )
}

export default ModalCreatePost
