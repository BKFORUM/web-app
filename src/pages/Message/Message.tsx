import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  IoChatbubblesOutline,
  IoAddCircleSharp,
  IoImages,
  IoPawSharp,
  IoPersonCircleOutline,
  IoChevronDownSharp,
} from 'react-icons/io5'
import { HiUserPlus } from 'react-icons/hi2'
import { RiSendPlaneFill } from 'react-icons/ri'
import SearchInput from '@components/SearchInput'
import { Tooltip } from '@mui/material'
import OptionGroup from './components/OptionGroup'
// import AddUserToGroup from '../../components/AddUserToGroup'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  conversationActionSelector,
  conversationStateSelector,
  userStateSelector,
} from '@store/index'
import { IMessage } from '@interfaces/IConversation'
import { pageMode } from '@interfaces/IClient'
import { useDebounce } from '@hooks/useDebounce'
import socket from '@utils/socket/socketConfig'
import { formatDateLocalV2 } from '@utils/functions/formatDay'

interface Props {}

const fakeData = [
  {
    id: 1,
    name: 'Trương Quang Khang',
    image: '../../assets/images/test666.jpg',
  },
  {
    id: 2,
    name: 'Nguyễn Văn Thịnh',
    image: '../../assets/images/test666.jpg',
  },
  {
    id: 4,
    name: 'Nguyễn Phạm Nam Anh',
    image: '../../assets/images/test666.jpg',
  },
  {
    id: 5,
    name: 'Nguyễn Thành Đạt',
    image: '../../assets/images/test666.jpg',
  },
]
const Message: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getConverSationById, addMessageToConversation } = useStoreActions(
    conversationActionSelector,
  )
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { currentConversation } = useStoreState(conversationStateSelector)

  const searchRef = useRef<HTMLDivElement>(null)
  const seendingRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [inputSearch, setInputSearch] = useState<string>('')
  const [inputText, setInputText] = useState<string>('')
  const [heightContent, setHeightContent] = useState<number | undefined>()
  const [loading, setIsLoading] = useState<boolean>(false)
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)
  const [data, setData] = useState<IMessage[]>([])
  const [checkNext, setCheckNext] = useState<boolean>(false)

  console.log(navigate)

  // const [isOpenAddUser, setIsOpenAddUser] = useState<boolean>(false)

  const handleNewMessage = useCallback(
    (response: any) => {
      if (response?.author.id !== currentUserSuccess?.id) {
        setData((prevData) => [response, ...prevData])
      }
    },
    [currentUserSuccess?.id],
  )

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server')
    })

    socket.on('connect_error', (err) => console.log(err))

    socket.emit('onConversationJoin', { id: id })

    socket.on('onMessage', handleNewMessage)

    return () => {
      socket.off('onMessage', handleNewMessage)
    }
  }, [id, currentUserSuccess?.id])

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
        setTotalRowCount(res.totalRecords)
        setData([...data, ...res.data])
        const check = res.data.length === 15
        setCheckNext(check)
      }
      setIsLoading(false)
    }
  }

  const debouncedInputValue = useDebounce(inputSearch, 500)

  useEffect(() => {
    setData([])
    setPaginationModel({ page: 0, pageSize: 10 })
  }, [debouncedInputValue])

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
      setData([])
      setPaginationModel({ page: 0, pageSize: 10 })
    }
  }, [id])

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }

  // const handleAddUser = async (data: any): Promise<void> => {
  //   console.log(data)
  // }

  const handleAddMessage = async (): Promise<void> => {
    if (id) {
      const res = await addMessageToConversation({
        id: id,
        content: inputText,
        type: 'TEXT',
      })
      if (res) {
        const newDataRow = {
          id: res?.id,
          content: res?.content,
          type: 'TEXT',
          author: res?.author,
        }
        setTotalRowCount(totalRowCount + 1)
        const newData = [newDataRow, ...data.slice(0, 9), ...data.slice(10)] as IMessage[]
        setInputText('')
        setData(newData)
      }
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleAddMessage()
  }

  return (
    <>
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
                id="scrollableDiv"
                ref={contentRef}
                style={{
                  maxHeight: heightContent !== undefined ? heightContent : '0',
                  overflow: 'auto',
                  flexDirection: 'column-reverse',
                }}>
                <InfiniteScroll
                  dataLength={data.length}
                  next={() => {
                    if (checkNext) {
                      setPaginationModel((prevPaginationModel) => ({
                        page: prevPaginationModel ? prevPaginationModel.page + 1 : 0,
                        pageSize: 10,
                      }))
                    }
                  }}
                  hasMore={data.length !== totalRowCount}
                  height={heightContent !== undefined ? heightContent : '0'}
                  loader={<div>{loading && <span>Loading...</span>}</div>}
                  style={{ display: 'flex', flexDirection: 'column-reverse' }}
                  inverse={true}
                  endMessage={
                    <div>
                      {data.length === totalRowCount &&
                        data.length === 0 &&
                        paginationModel && (
                          <div>
                            <div className="flex justify-center ">
                              <img
                                className=" h-32 w-32 animate-[wiggle_1s_ease-in-out_infinite]"
                                src="../../assets/images/ingVT.png"
                                alt="Vẫy tay"
                              />
                            </div>
                            <p
                              style={{
                                textAlign: 'center',
                                marginBottom: 16,
                              }}>
                              <b>Hãy là người bắt đầu cuộc trò chuyện</b>
                            </p>
                          </div>
                        )}
                      {/* {paginationModel && !loading && data.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className="h-40 w-40">
                            <img
                              className="h-full w-full"
                              src={notFoundSearch}
                              alt="not found search"
                            />
                          </div>
                          <span className="font-medium">
                            We're sorry. We were not able to find a match
                          </span>
                        </div>
                      )} */}
                      {data.length === totalRowCount &&
                        data.length > 0 &&
                        paginationModel && (
                          <p style={{ textAlign: 'center', marginTop: 12 }}>
                            <b>Đúng! Bạn đã nhìn thấy tất cả tin nhắn</b>
                          </p>
                        )}
                    </div>
                  }
                  scrollableTarget="scrollableDiv">
                  {data.map((item, index) => (
                    <div
                      id={item.id}
                      key={index}
                      className="flex flex-col px-2">
                      <div
                        className={`flex gap-2 my-1.5 ${
                          item.author.id === currentUserSuccess?.id
                            ? 'justify-end'
                            : 'justify-start'
                        }`}>
                        {item.author.id !== currentUserSuccess?.id && (
                          <div className="mt-auto">
                            <div className="h-8 w-8 overflow-hidden">
                              <img
                                className="h-full w-full rounded-3xl border border-gray-200"
                                src={item.author.avatarUrl}
                                alt={item.author.fullName}
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col gap-2 text-xs ">
                          {item.author.id !== currentUserSuccess?.id && (
                            <span>{item.author.fullName}</span>
                          )}
                          <div>
                            <Tooltip title={formatDateLocalV2(item.createdAt)}>
                              <span
                                className={`text-base px-3 py-1 max-w-[300px] truncate leading-0 ${
                                  item.author.id === currentUserSuccess?.id
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-gray-100 text-black'
                                } rounded-2xl`}>
                                {item.content}
                              </span>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </InfiniteScroll>
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
                    <IoImages className="h-6 w-6 text-[#0001CB] cursor-pointer" />
                  </div>
                </Tooltip>
                <Tooltip title="Thêm chi chưa biết">
                  <div>
                    <IoPawSharp className="h-6 w-6 text-[#0001CB] cursor-pointer" />
                  </div>
                </Tooltip>
                <div className="relative flex-1">
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
                </div>
              </div>
            </div>
            <div
              className="col-span-2 border-l border-gray-300 flex flex-col py-4 items-center px-2 overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 62px)' }}>
              <div className="h-20 w-20 overflow-hidden rounded-full">
                <img
                  className="h-full w-full object-cover"
                  src={currentConversation?.avatarUrl}
                  alt={currentConversation?.displayName}
                />
              </div>
              <span className="font-semibold text-lg">
                {currentConversation?.displayName}
              </span>
              {id !== '3' && (
                <div
                  className="flex flex-col items-center justify-center mt-4"
                  // onClick={() =>navigate('/profile/' + currentConversation?.lastMessage?.userId) }
                >
                  <IoPersonCircleOutline className="h-8 w-8 p-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300" />
                  <span className="text-sm">Trang cá nhân</span>
                </div>
              )}
              {id === '3' && (
                <div
                  className="flex flex-col items-center justify-center mt-4"
                  // onClick={() => setIsOpenAddUser(true)}
                >
                  <HiUserPlus className="h-8 w-8 p-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300" />
                  <span className="text-sm">Mời</span>
                </div>
              )}

              <div className="mt-4 w-full px-2 py-1 flex justify-between items-center hover:bg-gray-200 cursor-pointer transition-all duration-200 rounded-md">
                <span>File phương tiện</span>
                <IoChevronDownSharp className="h-5 w-5 mr-4" />
              </div>

              <div className="w-full px-2 py-1 flex justify-between items-center hover:bg-gray-200 cursor-pointer transition-all duration-200 rounded-md">
                <span>File</span>
                <IoChevronDownSharp className="h-5 w-5 mr-4" />
              </div>

              {id === '3' && (
                <div className="w-full flex flex-col">
                  <span className=" px-2 py-1">Thành viên của nhóm</span>
                  <ul>
                    {fakeData.map((item, index) => (
                      <li
                        key={index}
                        className="relative group list-none flex justify-between items-center py-1.5 px-2  text-left clear-both whitespace-nowrap rounded-md hover:bg-gray-200 hover:text-primary-400 cursor-pointer group-hover:opacity-80 transition-all duration-200   ">
                        <a className="relative block w-full ">
                          <img
                            className="h-8 w-8 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
                            src={item.image}
                            alt="avatar"
                          />
                          <span className="font-semibold text-sm">{item.name}</span>
                        </a>
                        <OptionGroup />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* <AddUserToGroup
        isOpen={isOpenAddUser}
        setIsOpen={setIsOpenAddUser}
        id={id}
        handleAction={handleAddUser}
      /> */}
    </>
  )
}

export default Message
