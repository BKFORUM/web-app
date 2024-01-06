import { Transition } from '@headlessui/react'
import { FC, Fragment, useEffect, useState } from 'react'
import { useClickOutside } from '@hooks/useClickOutside'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { HiOutlineSpeakerphone, HiOutlineCheck } from 'react-icons/hi'
import { Tooltip } from '@mui/material'
import socket from '@utils/socket/socketConfig'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  eventActionSelector,
  notificationActionSelector,
  notificationStateSelector,
  notifyActionSelector,
  postActionSelector,
  postStateSelector,
  userStateSelector,
} from '@store/index'
import { pageMode } from '@interfaces/IClient'
import { INotification } from '@interfaces/INotify'
import InfiniteScroll from 'react-infinite-scroll-component'
import { dayComparedToThePast } from '@utils/functions/formatDay'
import notfoundData from '../../../assets/images/notFoundSearch.jpg'
import { IPostViewForum } from '@interfaces/IPost'
import ModalDetailPost from '@components/ModalDetailPost'
import { useNavigate } from 'react-router-dom'
import { IEvent } from '@interfaces/IEvent'
import ModalDetailEvent from '@components/ModalDetailEvent'

interface Props {}

const Notification: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const {
    getAllNotification,
    updateNotification,
    setListNotification,
    setTotalRowCount,
    readAllNotification,
  } = useStoreActions(notificationActionSelector)
  const { listNotification, totalRowCount } = useStoreState(notificationStateSelector)
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { getPostById, likePost, unLikePost, setGetPostByIdSuccess } =
    useStoreActions(postActionSelector)
  const { isGetPostByIdSuccess, messageError } = useStoreState(postStateSelector)
  const { getEventById } = useStoreActions(eventActionSelector)
  const { setNotifySetting, setNotifyRealtime } = useStoreActions(notifyActionSelector)
  const { subscribeToEvent, unSubscribeToEvent } = useStoreActions(eventActionSelector)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)
  const [countLike, setCountLike] = useState<number>(0)
  const [openModalPostDetail, setOpenModalPostDetail] = useState<boolean>(false)
  const [openModalEventDetail, setOpenModalEventDetail] = useState<boolean>(false)
  const [postSelected, setPostSelected] = useState<IPostViewForum | null>(null)
  const [eventSelected, setEventSelected] = useState<IEvent>()
  const [isFavourite, setIsFavourite] = useState<boolean>(false)
  const [isUnsubscribed, setIsUnsubscribed] = useState<boolean>(false)
  const [numberNotRead, setNumberNotRead] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false)
  let elementRef: any = useClickOutside(() => {
    if (open) {
      setOpen(false)
    }
  })

  const handleFavouritePost = async (): Promise<void> => {
    if (postSelected) {
      if (isFavourite) {
        const res = await unLikePost(postSelected?.id)
        if (res) {
          setCountLike((prev) => prev - 1)
          setIsFavourite(false)
        }
      } else {
        const res = await likePost(postSelected?.id)
        if (res) {
          setCountLike((prev) => prev + 1)
          setIsFavourite(true)
        }
      }
    }
  }

  const getAllNotificationModal = async (): Promise<void> => {
    if (paginationModel) {
      setIsLoading(true)
      const res = await getAllNotification({
        skip: paginationModel.page * 10,
        take: paginationModel.pageSize,
      })
      if (res) {
        setTotalRowCount(res.totalRecords)
        setListNotification([...listNotification, ...res.data])
        setNumberNotRead(res?.totalUnreadNotifications)
      }
      setIsLoading(false)
    }
  }

  const handleActionSubscribed = async (): Promise<void> => {
    if (eventSelected && eventSelected.isSubscriber) {
      const res = await unSubscribeToEvent(String(eventSelected.id))
      if (res) {
        setIsUnsubscribed(false)
      }
    } else {
      const res = await subscribeToEvent(String(eventSelected?.id))
      if (res) {
        setIsUnsubscribed(true)
      }
    }
  }

  const handleRead = async (item: INotification): Promise<void> => {
    if (!item.readAt) {
      const res = await updateNotification(item.id)
      if (res) {
        setNumberNotRead(numberNotRead - 1)
        var now = new Date()
        const newData = listNotification.map((notify: INotification) =>
          notify.id === item.id ? { ...notify, readAt: now.toISOString() } : notify,
        )
        setListNotification(newData)
      }
    }
    if (item.modelName === 'post') {
      const res = await getPostById(item.modelId)
      if (res && res.status !== 'DELETED') {
        setPostSelected(res)
        setOpenModalPostDetail(true)
      }
      if (res.status === 'DELETED') {
        setNotifySetting({
          show: true,
          status: 'error',
          message: 'The post has been rejected ',
        })
      }
    }

    if (item.modelName === 'forum') {
      navigate('/forums/' + item.modelId)
    }

    if (item.modelName === 'friendship') {
      navigate('/profile/' + item.sender.id)
    }

    if (item.modelName === 'event') {
      const res = await getEventById(item.modelId)
      if (res) {
        setEventSelected(res)
        setIsUnsubscribed(res.isSubscriber)
        setOpenModalEventDetail(true)
      }
    }
  }

  const handleNewNotification = (response: INotification) => {
    setNotifyRealtime({ show: true, notify: response, type: 'notify' })
    setNumberNotRead(numberNotRead + 1)
    let newData
    if (listNotification.length >= 10 && listNotification.length < totalRowCount) {
      newData = [
        response,
        ...listNotification.slice(0, listNotification.length - 1),
        ...listNotification.slice(listNotification.length),
      ] as INotification[]
    } else {
      newData = [response, ...listNotification] as INotification[]
    }
    setTotalRowCount(totalRowCount + 1)
    setListNotification(newData)
  }

  const handleReadAllNotifications = async () => {
    const res = await readAllNotification()
    if (res) {
      var now = new Date()
      const newData = listNotification.map((notification: INotification) =>
        notification.readAt === null
          ? { ...notification, readAt: now.toISOString() }
          : notification,
      )

      setListNotification(newData)
      setNumberNotRead(0)
    }
  }

  useEffect(() => {
    if (!isGetPostByIdSuccess) {
      setNotifySetting({
        show: true,
        status: 'error',
        message: messageError,
      })
      setGetPostByIdSuccess(true)
    }
  }, [isGetPostByIdSuccess])

  useEffect(() => {
    getAllNotificationModal()
  }, [paginationModel])

  useEffect(() => {
    setListNotification([])
    setPaginationModel({ page: 0, pageSize: 10 })
  }, [currentUserSuccess?.id])

  useEffect(() => {
    socket.on('onLikeCreated', handleNewNotification)

    socket.on('onCommentCreated', handleNewNotification)

    socket.on('onRequestForumCreated', handleNewNotification)

    socket.on('onRequestForumApproved', handleNewNotification)

    socket.on('onPostRequestCreated', handleNewNotification)

    socket.on('onPostRequestApproved', handleNewNotification)

    socket.on('onFriendRequestCreated', handleNewNotification)

    socket.on('onFriendRequestApproved', handleNewNotification)

    socket.on('onUpcomingEvent', handleNewNotification)
  }, [listNotification, numberNotRead, socket])

  useEffect(() => {
    if (postSelected) {
      setIsFavourite(!postSelected.likedAt ? false : true)
      setCountLike(postSelected._count.likes)
    }
  }, [postSelected])

  return (
    <div className="relative">
      <div
        className="flex text-sm rounded-full focus:outline-none cursor-pointer"
        id="user-menu-button"
        onClick={() => setOpen(!open)}>
        <div className="relative">
          {open && (
            <div className="relative">
              <NotificationsIcon
                className=" text-[#FEFE00] cursor-pointer"
                sx={{ fontSize: 28 }}
              />
              {numberNotRead > 0 && (
                <span className="absolute top-[-20%] right-[-10%] flex justify-center items-center text-[12px] bg-red-500 h-5 w-5  text-white rounded-full">
                  {numberNotRead}
                </span>
              )}
            </div>
          )}
          {!open && (
            <Tooltip title={<h1 className="text-sm">Notify</h1>}>
              <div className="relative">
                <NotificationsIcon
                  className=" text-[#FEFE00] cursor-pointer"
                  sx={{ fontSize: 28 }}
                />
                {numberNotRead > 0 && (
                  <span className="absolute top-[-20%] right-[-10%] flex justify-center items-center text-[12px] bg-red-500 h-5 w-5  text-white rounded-full">
                    {numberNotRead}
                  </span>
                )}
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      <Transition
        show={open}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <div
          ref={elementRef}
          className={`absolute rounded right-2 top-[120%] z-50 py-0.5 px-1.5 bg-white border shadow-md`}
          style={{ width: '20rem' }}>
          <div className="flex justify-between items-center">
          <h4 className="p-2 text-xl font-medium">Thông báo</h4>
            <div>
              <Tooltip title="Đánh dấu tất cả đã đọc">
                <div
                  onClick={() => {
                    numberNotRead > 0 && handleReadAllNotifications()
                  }}>
                  <HiOutlineCheck className="cursor-pointer h-5 w-5 mr-2 hover:text-green-500" />
                </div>
              </Tooltip>
            </div>
          </div>
          <div
            id="scrollableDiv"
            style={{
              maxHeight: 'calc(100vh - 120px)',
              overflow: 'auto',
            }}>
            <InfiniteScroll
              dataLength={listNotification.length}
              next={() =>
                setPaginationModel((prevPaginationModel) => ({
                  page: prevPaginationModel ? prevPaginationModel.page + 1 : 0,
                  pageSize: 10,
                }))
              }
              hasMore={listNotification.length !== totalRowCount}
              loader={
                isLoading && (
                  <>
                    <div className="flex gap-2 p-2 animate-pulse">
                      <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                      <div className="flex flex-col gap-2 flex-1 w-full">
                        <div className="h-4 w-full flex-1 flex-grow rounded-md bg-slate-200"></div>
                        <div className="h-2 w-8 rounded-md bg-slate-200"></div>
                      </div>
                    </div>

                    <div className="flex gap-2 p-2 animate-pulse">
                      <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                      <div className="flex flex-col gap-2 flex-1 w-full">
                        <div className="h-4 w-full flex-1 flex-grow rounded-md bg-slate-200"></div>
                        <div className="h-2 w-8 rounded-md bg-slate-200"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 p-2 animate-pulse">
                      <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                      <div className="flex flex-col gap-2 flex-1 w-full">
                        <div className="h-3.5 w-full flex-1 flex-grow rounded-md bg-slate-200"></div>
                        <div className="h-2 w-8 rounded-md bg-slate-200"></div>
                      </div>
                    </div>
                  </>
                )
              }
              scrollableTarget="scrollableDiv"
              endMessage={
                <>
                  {!isLoading && listNotification.length === 0 && totalRowCount === 0 && (
                    <div className="flex flex-col items-center pb-4 ">
                      <div className="h-32 w-32 m-auto">
                        <img
                          className="h-full w-full"
                          src={notfoundData}
                          alt=""
                        />
                      </div>
                      <span className="font-medium">Bạn chưa có thông báo nào</span>
                    </div>
                  )}
                  {!isLoading &&
                    listNotification.length > 0 &&
                    totalRowCount === listNotification.length && (
                      <p className="text-center font-medium py-2 ">
                        Đã hiện thị tất cả các thông báo
                      </p>
                    )}
                </>
              }>
              {listNotification.length > 0 &&
                listNotification.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleRead(item)
                      setOpen(!open)
                    }}
                    className="relative flex p-2 hover:text-primary-400 cursor-pointer rounded-lg hover:bg-gray-200 transition-all duration-200 ">
                    {item.sender !== null ? (
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mt-1 mr-2 border border-gray-700 bg-gray-700">
                        <img
                          className="h-full w-full object-cover  "
                          src={item.sender.avatarUrl}
                          alt="avatar"
                        />
                      </div>
                    ) : (
                      <HiOutlineSpeakerphone className=" mr-2 p-1.5  h-10 w-10" />
                    )}
                    <p className={`flex flex-col text-sm mr-0.5`}>
                      <span className="font-bold line-clamp-3">
                        {item.sender?.fullName}&nbsp;
                        <span className={`${item.readAt && 'font-normal'}`}>
                          {item.content.trim()}
                        </span>
                      </span>

                      <span
                        className={`text-xs ${
                          !item.readAt ? 'text-blue-500' : 'font-thin'
                        }`}>
                        {dayComparedToThePast(item.createdAt)}
                      </span>
                    </p>
                    {!item.readAt && (
                      <span
                        title="not read"
                        className="flex flex-shrink-0 ml-auto transform translate-y-[18px] bg-blue-500 border border-white w-[10px] h-[10px] rounded-full"></span>
                    )}
                  </li>
                ))}
            </InfiniteScroll>
          </div>
        </div>
      </Transition>

      {openModalPostDetail && (
        <ModalDetailPost
          item={postSelected}
          open={openModalPostDetail}
          setOpen={setOpenModalPostDetail}
          isFavourite={isFavourite}
          setIsFavourite={handleFavouritePost}
          countLike={countLike}
        />
      )}

      {openModalEventDetail && (
        <ModalDetailEvent
          open={openModalEventDetail}
          setOpen={setOpenModalEventDetail}
          item={eventSelected}
          isUnsubscribed={isUnsubscribed}
          handleAction={handleActionSubscribed}
        />
      )}
    </div>
  )
}

export default Notification
