import { Transition } from '@headlessui/react'
import { FC, Fragment, useEffect, useState } from 'react'
import { useClickOutside } from '@hooks/useClickOutside'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Tooltip } from '@mui/material'
import socket from '@utils/socket/socketConfig'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
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

interface Props {}

const Notification: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const {
    getAllNotification,
    updateNotification,
    setListNotification,
    setTotalRowCount,
  } = useStoreActions(notificationActionSelector)
  const { listNotification, totalRowCount } = useStoreState(notificationStateSelector)
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { getPostById, likePost, unLikePost, setGetPostByIdSuccess } =
    useStoreActions(postActionSelector)
  const { isGetPostByIdSuccess, messageError } = useStoreState(postStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)
  const [countLike, setCountLike] = useState<number>(0)
  const [openModalPostDetail, setOpenModalPostDetail] = useState<boolean>(false)
  const [postSelected, setPostSelected] = useState<IPostViewForum | null>(null)
  const [isFavourite, setIsFavourite] = useState<boolean>(false)
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
  }

  const handleNewNotification = (response: INotification) => {
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
    socket.on('connect', () => {
      console.log(socket.id)
    })
    socket.on('connect_error', (err) => console.log(err))
    setListNotification([])
    setPaginationModel({ page: 0, pageSize: 10 })
  }, [currentUserSuccess?.id])

  useEffect(() => {
    socket.on('onLikeCreated', handleNewNotification)

    socket.on('onCommentCreated', handleNewNotification)

    socket.on('onRequestForumCreated', handleNewNotification) // user request to forum

    socket.on('onRequestForumApproved', handleNewNotification) // moderator approve request user

    socket.on('onPostRequestCreated', handleNewNotification) // user request post to forum

    socket.on('onPostRequestApproved', handleNewNotification) // moderator approve request post of user

    socket.on('onFriendRequestCreated', handleNewNotification)

    socket.on('onFriendRequestApproved', handleNewNotification)
  }, [listNotification])

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
          onClick={() => {
            setOpen(!open)
          }}
          className={`absolute rounded right-2 top-[120%] z-50 py-0.5 px-1.5 bg-white border shadow-md`}
          style={{ width: '20rem' }}>
          <h4 className="p-2 text-xl font-medium">Notification</h4>
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
              loader={<div>{isLoading && <span>Loading...</span>}</div>}
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
                    onClick={() => handleRead(item)}
                    className="relative flex p-2 hover:text-primary-400 cursor-pointer rounded-lg hover:bg-gray-200 transition-all duration-200 ">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-2 border border-gray-700 bg-gray-700">
                      <img
                        className="h-full w-full object-cover "
                        src={item.sender.avatarUrl}
                        alt="avatar"
                      />
                    </div>
                    <p className={`flex flex-col text-sm mr-0.5`}>
                      <span className="font-bold line-clamp-3">
                        {item.sender.fullName}&nbsp;
                        <span className={`${item.readAt && 'font-normal'}`}>
                          {item.content}
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
    </div>
  )
}

export default Notification
