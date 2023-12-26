import { FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  IoChatbubblesOutline,
  IoAddCircleSharp,
  IoImages,
  IoPawSharp,
} from 'react-icons/io5'
import { RiSendPlaneFill } from 'react-icons/ri'
import { AiFillCaretDown } from 'react-icons/ai'
import SearchInput from '@components/SearchInput'
import { Tooltip } from '@mui/material'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  conversationActionSelector,
  conversationStateSelector,
  postActionSelector,
} from '@store/index'
import { IMessage } from '@interfaces/IConversation'
import { pageMode } from '@interfaces/IClient'
import { useDebounce } from '@hooks/useDebounce'
import ContentChat from './components/ContentChat'
import DetailConversation from './components/DetailConversation'
import notFoundSearch from '../../assets/images/notFoundSearch.jpg'
import { base64StringToBlob } from '@utils/functions/partBlobToFile'
import ViewImagePaste from './components/ViewImagePaste'

interface Props {}

const Message: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const {
    getConverSationById,
    addMessageToConversation,
    setIsGetAllMessagesAgain,
    setCurrentConverSationMessage,
    setTotalRowMessages,
  } = useStoreActions(conversationActionSelector)
  const {
    isGetAllMessagesAgain,
    currentConverSationMessage,
    totalRowMessages,
    isGetConverSationByIdSuccess,
  } = useStoreState(conversationStateSelector)
  const { postImage } = useStoreActions(postActionSelector)

  const searchRef = useRef<HTMLDivElement>(null)
  const seendingRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [inputSearch, setInputSearch] = useState<string>('')
  const [inputText, setInputText] = useState<string>('')
  const [heightContent, setHeightContent] = useState<number | undefined>()
  const [loading, setIsLoading] = useState<boolean | null>(null)
  const [loadingImage, setIsLoadingImage] = useState<boolean>(false)

  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)
  const [checkNext, setCheckNext] = useState<boolean>(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const getDetailConversation = async (): Promise<void> => {
    if (id && paginationModel) {
      setIsLoading(true)
      const res = await getConverSationById({
        id: id,
        params: {
          search: inputSearch,
          skip: paginationModel.page * 15,
          take: paginationModel.pageSize + 5,
        },
      })
      if (res) {
        setTotalRowMessages(res.totalRecords)
        setCurrentConverSationMessage([...currentConverSationMessage, ...res.data])
        const check = res.data.length === 15
        setCheckNext(check)
      }
      setIsLoading(false)
    }
  }

  const debouncedInputValue = useDebounce(inputSearch, 500)

  useEffect(() => {
    setCurrentConverSationMessage([])
    setPaginationModel({ page: 0, pageSize: 10 })
  }, [debouncedInputValue])

  useEffect(() => {
    if (isGetAllMessagesAgain) {
      setCurrentConverSationMessage([])
      setPaginationModel({ page: 0, pageSize: 10 })
      setIsGetAllMessagesAgain(false)
    }
  }, [isGetAllMessagesAgain])

  useEffect(() => {
    getDetailConversation()
  }, [paginationModel])

  useEffect(() => {
    if (searchRef.current && seendingRef.current && contentRef.current) {
      const heightSearch = searchRef.current.scrollHeight
      const heightSeeding = seendingRef.current.scrollHeight
      const windowHeight = window.innerHeight
      const totalHeight = windowHeight - 61 - heightSearch - heightSeeding
      setHeightContent(totalHeight)
      contentRef.current.scrollTo(0, 0)
    }

    if (id) {
      setCurrentConverSationMessage([])
      setPaginationModel({ page: 0, pageSize: 10 })
    }
  }, [id])

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }

  const setNewData = (res: any, type: string) => {
    const newDataRow = {
      id: res?.id,
      content: res?.content,
      type: type,
      author: res?.author,
    }
    setTotalRowMessages(totalRowMessages + 1)
    let newData
    if (
      currentConverSationMessage.length >= 10 &&
      currentConverSationMessage.length < totalRowMessages
    ) {
      newData = [
        newDataRow,
        ...currentConverSationMessage.slice(0, currentConverSationMessage.length - 1),
        ...currentConverSationMessage.slice(currentConverSationMessage.length),
      ] as IMessage[]
    } else {
      newData = [newDataRow, ...currentConverSationMessage] as IMessage[]
    }
    setCurrentConverSationMessage(newData)
  }

  const handleAddMessage = async (): Promise<void> => {
    if (id && inputText.trim().length > 0) {
      const res = await addMessageToConversation({
        id: id,
        content: inputText,
        type: 'TEXT',
      })
      if (res) {
        setNewData(res, 'TEXT')
        setInputText('')
      }
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (imageFile !== null) {
        handleAddImageMessage(imageFile)
        setImageFile(null)
      } else {
        handleAddMessage()
      }
    }
  }

  const handleAddImageMessage = async (file: File): Promise<void> => {
    if (file) {
      setIsLoadingImage(true)
      const formData = new FormData()
      formData.append(`documents`, file)
      const resImage = await postImage(formData)
      if (resImage) {
        const res = await addMessageToConversation({
          id: id,
          content: resImage[0]?.fileUrl,
          type: 'IMAGE',
        })
        if (res) {
          setNewData(res, 'IMAGE')
        }
      }
      setIsLoadingImage(false)
    }
  }

  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = (event.clipboardData || (event as any).originalEvent.clipboardData)
      .items

    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile()
        if (blob) {
          const reader = new FileReader()
          reader.onload = () => {
            if (reader.result) {
              const base64String = reader.result.toString()
              const blob = base64StringToBlob(base64String)
              if (blob) {
                const file = new File([blob], 'image.png', { type: 'image/png' })
                setImageFile(file)
              }
            }
          }
          reader.readAsDataURL(blob as Blob)
        }
      }
    }
  }

  return (
    <>
      {isGetConverSationByIdSuccess === false && totalRowMessages === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <div className="h-52 w-52">
            <img
              className="h-full w-full"
              src={notFoundSearch}
              alt="not found search"
            />
          </div>
          <span>We're sorry. We were not able to find a match</span>
        </div>
      )}
      {isGetConverSationByIdSuccess && (
        <div className="flex h-full bg-white">
          {id === undefined ? (
            <div className="m-auto text-xl font-bold flex flex-col items-center gap-3">
              <IoChatbubblesOutline className="h-16 w-16 text-[#0001CB]" />
              <span>Chưa có đoạn chat được chọn</span>
            </div>
          ) : (
            <div className="grid grid-cols-8 flex-1">
              <div className="col-span-6 flex flex-col">
                <div
                  className="pt-4 py-5 px-4 border-b border-gray-300 shadow"
                  ref={searchRef}>
                  <SearchInput
                    value={inputSearch}
                    setValue={handleChangeSearch}
                    width="100%"
                    size="small"
                  />
                </div>

                <div
                  id="scrollableDivContentChat"
                  ref={contentRef}
                  style={{
                    maxHeight: heightContent !== undefined ? heightContent : '0',
                    overflow: 'auto',
                    flexDirection: 'column-reverse',
                  }}>
                  <ContentChat
                    checkNext={checkNext}
                    data={currentConverSationMessage}
                    heightContent={heightContent}
                    loading={loading}
                    paginationModel={paginationModel}
                    setPaginationModel={setPaginationModel}
                    totalRowCount={totalRowMessages}
                    loadingImage={loadingImage}
                  />
                </div>

                <div
                  ref={seendingRef}
                  className="mt-auto flex items-center px-4 py-3 gap-4  shadow-stone-400">
                  <Tooltip title="Thêm ....">
                    <div>
                      <IoAddCircleSharp className="h-7 w-7 text-[#0001CB] cursor-pointer" />
                    </div>
                  </Tooltip>
                  <Tooltip title="Thêm ảnh">
                    <div>
                      <label htmlFor="AddImageMessage">
                        <IoImages className="h-6 w-6 text-[#0001CB] cursor-pointer" />
                      </label>
                      <input
                        id="AddImageMessage"
                        type="file"
                        accept="image/jpeg, image/png, image/gif"
                        className="hidden"
                        multiple={false}
                        onChange={(e) => {
                          const files = e.target.files
                          if (files && files.length > 0 && files[0] !== null) {
                            const selectedFile = files[0]
                            handleAddImageMessage(selectedFile)
                          }
                        }}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip title="Thêm chi chưa biết">
                    <div>
                      <IoPawSharp className="h-6 w-6 text-[#0001CB] cursor-pointer" />
                    </div>
                  </Tooltip>
                  <div
                    onPaste={handlePaste}
                    className="relative flex-1">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full outline-none border border-gray-300 px-3 py-1.5 rounded-3xl"
                      placeholder="Aa"
                    />
                    <RiSendPlaneFill
                      onClick={() => handleAddMessage()}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-[#0001CB] cursor-pointer"
                    />

                    {imageFile && (
                      <div className="absolute top-[-224px] right-1/2 translate-x-1/2 h-[220px] w-[220px] bg-slate-100 rounded-md p-2">
                        <ViewImagePaste
                          imageFile={imageFile}
                          setImageFile={setImageFile}
                        />
                      </div>
                    )}
                    {imageFile && (
                      <AiFillCaretDown className="absolute top-[-12px] right-1/2 translate-x-1/2 h-7 w-7 text-gray-200" />
                    )}
                  </div>
                </div>
              </div>
              <DetailConversation />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Message
