import SearchInput from '@components/SearchInput'
import { FC, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  conversationActionSelector,
  conversationStateSelector,
  userStateSelector,
} from '@store/index'
import { pageMode } from '@interfaces/IClient'
import InfiniteScroll from 'react-infinite-scroll-component'
import { dayComparedToThePast } from '@utils/functions/formatDay'
import default_forum from '../../../assets/images/default_forum.png'
import { IConversation } from '@interfaces/IConversation'
import { BiMessageAdd } from 'react-icons/bi'
import { Tooltip } from '@mui/material'
import ModalAddGroupChat from '@components/ModalAddGroupChat'
import { useDebounce } from '@hooks/useDebounce'

interface Props {}
const SidebarMessage: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    getAllConverSation,
    setCurrentConversation,
    setListConversation,
    setIsReadConversation,
  } = useStoreActions(conversationActionSelector)
  const { listConversation } = useStoreState(conversationStateSelector)
  const { listFriendOnline } = useStoreState(userStateSelector)

  const [inputSearch, setInputSearch] = useState<string>('')
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)
  const [loading, setIsLoading] = useState<boolean>(false)
  const [openModalAddConversation, setOpenModalAddConversation] = useState<boolean>(false)

  const getAllConversationPage = async (): Promise<void> => {
    setIsLoading(true)
    if (paginationModel) {
      const res = await getAllConverSation({
        search: inputSearch,
        skip: paginationModel.page * 10,
        take: paginationModel.pageSize,
      })
      if (res) {
        setTotalRowCount(res.totalRecords)
        const newData: IConversation[] = res?.data.map((item: IConversation) => {
          return {
            ...item,
            isRead: true,
          }
        })
        setListConversation([...listConversation, ...newData])
      }
    }
    setIsLoading(false)
  }

  // const handleNewMessage = (response: IMessage) => {
  //   console.log(response)
  //   if (
  //     response?.author.id !== currentUserSuccess?.id &&
  //     response?.conversationId === id
  //   ) {
  //     setCurrentConverSationMessage([response, ...currentConverSationMessage])
  //   }
  //   const getConversationAdd = listConversation.find((item) => {
  //     return item.id === response.conversationId
  //   })

  //   if (getConversationAdd) {
  //     const newConversation = {
  //       ...getConversationAdd,
  //       isRead: id === response.conversationId,
  //       lastMessage: response,
  //     }
  //     const newList = listConversation.filter((item) => {
  //       return item.id !== response.conversationId
  //     })
  //     setListConversation([newConversation, ...newList])

  //     if (
  //       pathname.split('/')[1] !== 'message' &&
  //       currentUserSuccess?.id !== response.author.id
  //     ) {
  //       console.log(111111)
  //       setNotifyRealtime({ show: true, message: newConversation, type: 'message' })
  //     }
  //   }
  // }

  // useEffect(() => {
  //   socket.on('onMessage', handleNewMessage)
  //   return () => {
  //     socket.off('onMessage', handleNewMessage)
  //   }
  // }, [id, currentUserSuccess?.id, listConversation])

  const debounce = useDebounce(inputSearch, 500)

  useEffect(() => {
    setListConversation([])
    setPaginationModel({ page: 0, pageSize: 10 })
  }, [debounce])

  useEffect(() => {
    getAllConversationPage()
  }, [paginationModel])

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }
  return (
    <>
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="px-3 py-2 text-2xl font-bold">Chat</h2>
          <Tooltip title="Tạo đoạn chat">
            <div>
              <BiMessageAdd
                onClick={() => setOpenModalAddConversation(true)}
                className="mr-3 h-6 w-6 cursor-pointer hover:text-blue-800"
              />
            </div>
          </Tooltip>
        </div>
        <div className="px-3 pb-3 shadow">
          <SearchInput
            value={inputSearch}
            setValue={handleChangeSearch}
            width="100%"
            size="small"
          />
        </div>

        <div
          id="scrollableDiv"
          style={{
            maxHeight: 'calc(100vh - 160px)',
            overflowY: 'auto',
          }}>
          <InfiniteScroll
            // style={{ overflowX: 'hidden' }}
            dataLength={listConversation.length}
            next={() =>
              setPaginationModel((prevPaginationModel) => ({
                page: prevPaginationModel ? prevPaginationModel.page + 1 : 0,
                pageSize: 10,
              }))
            }
            hasMore={listConversation.length !== totalRowCount}
            loader={<div>{loading && <span>Loading...</span>}</div>}
            scrollableTarget="scrollableDiv"
            endMessage={
              <div>
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
                {/* {data.length === totalRowCount && data.length > 0 && paginationModel && (
              <p style={{ textAlign: 'center', marginTop: 12 }}>
                <b>Đúng! Bạn đã nhìn thấy tất cả kết quả tìm kiếm</b>
              </p>
            )} */}
              </div>
            }>
            <ul className="flex flex-col mt-2 gap-1 pl-2 pt-1 ">
              {listConversation.length > 0 &&
                listConversation.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      navigate('/message/' + item.id), setCurrentConversation(item)
                      if (!item.isRead) {
                        setIsReadConversation(item.id)
                      }
                    }}
                    className={`flex px-2 py-1  transition-all duration-200 rounded-md cursor-pointer
                ${id === item?.id ? 'bg-sky-100' : 'hover:bg-gray-200'}
                `}>
                    <a className="relative flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 "
                        src={item?.avatarUrl || default_forum}
                        alt="avatar"
                      />
                      {item.type === 'CHAT' &&
                        listFriendOnline.some(
                          (user) =>
                            user.id === item.users[0].userId ||
                            user.id === item.users[1].userId,
                        ) && (
                          <span
                            title="online"
                            className="flex ml-auto flex-shrink-0 absolute bottom-1 right-1.5 bg-green-500 border border-white w-[11px] h-[11px] rounded-full"></span>
                        )}
                    </a>
                    <div className="flex flex-col w-full ">
                      <span className="font-semibold whitespace-nowrap truncate ">
                        {item?.displayName}
                      </span>
                      <div
                        className={`flex items-center gap-2 ${
                          !item.isRead && 'font-semibold'
                        }`}>
                        <span className={` text-sm max-w-[125px] break-words truncate `}>
                          {item.lastMessage?.content}
                        </span>
                        <span className=" text-xs">
                          {item?.lastMessage &&
                            dayComparedToThePast(item.lastMessage.createdAt)}
                        </span>
                      </div>
                    </div>

                    {!item.isRead && (
                      <span
                        title="not read"
                        className="flex ml-auto flex-shrink-0  transform translate-y-[18px] bg-blue-500 border border-white w-[10px] h-[10px] rounded-full"></span>
                    )}
                  </li>
                ))}
            </ul>
          </InfiniteScroll>
        </div>
      </div>

      {openModalAddConversation && (
        <ModalAddGroupChat
          open={openModalAddConversation}
          setOpen={setOpenModalAddConversation}
        />
      )}
    </>
  )
}

// {
//   item.isOnline && (
//     <span
//       title="online"
//       className="flex justify-center absolute left-11 bottom-2  text-center bg-green-500 border border-white w-[10px] h-[10px] rounded-full"></span>
//   )
// }

export default SidebarMessage
