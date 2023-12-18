import { FC, useEffect, useState } from 'react'
import SmsIcon from '@mui/icons-material/Sms'
import AvatarHeader from '../AvatarHeader/AvatarHeader'
// import { HiOutlinePlusCircle } from 'react-icons/hi2'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Tooltip from '@mui/material/Tooltip'
import Notification from '../Notification'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ModalEditForum from '@pages/Forum/components/ModalEditForum'
import { useStoreActions, useStoreState } from 'easy-peasy'
import logoBk from '../../../assets/images/logobkforum.png'
import {
  conversationActionSelector,
  conversationStateSelector,
  forumActionSelector,
  forumStateSelector,
  notifyActionSelector,
  postActionSelector,
  searchActionSelector,
  userActionSelector,
  userStateSelector,
} from '@store/index'
import SearchInput from '@components/SearchInput'
import { IUserData } from '@interfaces/IUser'
import socket from '@utils/socket/socketConfig'
import { IMessage } from '@interfaces/IConversation'
interface Props {}

const Header: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { pathname } = useLocation()
  const { setTextSearch } = useStoreActions(searchActionSelector)
  const { addForum, setIsAddForumSuccess } = useStoreActions(forumActionSelector)
  const { isAddForumSuccess, messageErrorForum } = useStoreState(forumStateSelector)
  const { postImage } = useStoreActions(postActionSelector)
  const { setNotifySetting, setNotifyRealtime } = useStoreActions(notifyActionSelector)
  const { setListFriendOnline } = useStoreActions(userActionSelector)
  const { listFriendOnline, currentUserSuccess } = useStoreState(userStateSelector)
  const { setCurrentConverSationMessage, setListConversation } = useStoreActions(
    conversationActionSelector,
  )
  const { currentConverSationMessage, listConversation } = useStoreState(
    conversationStateSelector,
  )

  const searchParams = new URLSearchParams(window.location.search)
  const search = searchParams.get('search')

  const [openModalEditForum, setOpenModalEditForum] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [inputSearch, setInputSearch] = useState<string>(search !== null ? search : '')

  const addQueryParam = (valueSearch: string): void => {
    if (valueSearch !== '') {
      const queryParams = new URLSearchParams()
      queryParams.set('search', valueSearch.trim())
      const newURL = `/search?${queryParams.toString()}`
      navigate(newURL)
    }
  }

  const handleAddForum = async (data: any): Promise<void> => {
    setIsLoading(true)
    if (data.avatarUrl.length === 0) {
      const { avatarUrl, ...others } = data
      const res = await addForum(others)
      if (res) {
        setNotifySetting({
          show: true,
          status: 'success',
          message: 'Add forum successfully',
        })
      }
      setIsLoading(false)
      setOpenModalEditForum(false)
    } else {
      const formData = new FormData()
      formData.append(`documents`, data?.avatarUrl[0])
      const resImage = await postImage(formData)
      if (resImage) {
        const { id, ...others } = data
        const res = await addForum({ ...others, avatarUrl: resImage[0].fileUrl })
        if (res) {
          setNotifySetting({
            show: true,
            status: 'success',
            message: 'Add forum successfully',
          })
        }
      }
      setIsLoading(false)
      setOpenModalEditForum(false)
    }
  }

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addQueryParam(inputSearch)
      setTextSearch(inputSearch)
    }
  }
  const getAllFriendOnline = (response: IUserData[]) => {
    // console.log('getAllFriendOnline', response)
    setListFriendOnline(response)
  }

  const AddFiendOnline = (response: IUserData) => {
    // console.log('AddFiendOnline', response)
    if (listFriendOnline.every((user) => user.id !== response.id))
      setListFriendOnline([...listFriendOnline, response])
  }

  const deleteFriendOffline = (response: IUserData) => {
    // console.log('deleteFriendOffline', response)
    const newData = listFriendOnline.filter((user) => {
      return user.id !== response.id
    })
    setListFriendOnline(newData)
  }

  const handleNewMessage = (response: IMessage) => {
    console.log(response)
    const location = pathname.split('/')[1]

    if (location !== 'message') {
      setNotifyRealtime({ show: true, message: response, type: 'message' })
    } else {
      if (
        response?.author.id !== currentUserSuccess?.id &&
        response?.conversationId === id
      ) {
        setCurrentConverSationMessage([response, ...currentConverSationMessage])
      }
      const getConversationAdd = listConversation.find((item) => {
        return item.id === response.conversationId
      })

      if (getConversationAdd) {
        const newConversation = {
          ...getConversationAdd,
          isRead: id === response.conversationId,
          lastMessage: response,
        }
        const newList = listConversation.filter((item) => {
          return item.id !== response.conversationId
        })
        setListConversation([newConversation, ...newList])
      }
    }
  }

  useEffect(() => {
    socket.on('onMessage', handleNewMessage)
    return () => {
      socket.off('onMessage', handleNewMessage)
    }
  }, [id, currentUserSuccess?.id, listConversation, socket])

  useEffect(() => {
    socket.emit('onGetOnlineFriends', {})

    socket.on('onGetOnlineFriends', getAllFriendOnline)
  }, [socket])

  useEffect(() => {
    socket.on('onFriendOnline', AddFiendOnline)

    socket.on('onFriendOffline', deleteFriendOffline)
  }, [listFriendOnline, socket])

  useEffect(() => {
    if (search !== null) {
      setTextSearch(search)
      addQueryParam(search)
    }
  }, [])

  useEffect(() => {
    if (!isAddForumSuccess) {
      setNotifySetting({ show: true, status: 'error', message: messageErrorForum })
      setIsAddForumSuccess(true)
    }
  }, [isAddForumSuccess])

  return (
    <>
      <div className="h-[60px] bg-[#0001CB] flex justify-between items-center px-3 fixed top-0 right-0 left-0 z-[50] ">
        <div
          className="h-16 cursor-pointer"
          onClick={() => navigate('/')}>
          <img
            className="w-full h-full"
            src={logoBk}
            alt="logoBk"
          />
        </div>
        <div>
          <SearchInput
            value={inputSearch}
            setValue={handleChangeSearch}
            width="320px"
            size="small"
            handleKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex gap-6 items-center pr-8">
          <Tooltip title={<h1 className="text-sm">Add Forum</h1>}>
            <AddCircleOutlineIcon
              onClick={() => setOpenModalEditForum(true)}
              className=" text-[#FEFE00] cursor-pointer"
              sx={{ fontSize: 28 }}
            />
          </Tooltip>
          <Tooltip title={<h1 className="text-sm">Message</h1>}>
            <SmsIcon
              onClick={() => navigate('/message')}
              className=" text-[#FEFE00] cursor-pointer"
              sx={{ fontSize: 28 }}
            />
          </Tooltip>

          <Notification />

          <AvatarHeader />
        </div>
      </div>
      {openModalEditForum && (
        <ModalEditForum
          forum={null}
          open={openModalEditForum}
          setOpen={setOpenModalEditForum}
          handleAction={handleAddForum}
          isLoading={isLoading}
        />
      )}
    </>
  )
}

export default Header
