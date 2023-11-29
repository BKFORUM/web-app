import { FC, useEffect } from 'react'
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'
import socket from '@utils/socket/socketConfig'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { userActionSelector, userStateSelector } from '@store/index'
import { IUserData } from '@interfaces/IUser'

interface Props {}

const UserActive: FC<Props> = (): JSX.Element => {
  const { setListFriendOnline } = useStoreActions(userActionSelector)
  const { listFriendOnline } = useStoreState(userStateSelector)
  const getAllFriendOnline = (response: IUserData[]) => {
    setListFriendOnline(response)
  }

  const AddFiendOnline = (response: IUserData) => {
    if (listFriendOnline.every((user) => user.id !== response.id))
      setListFriendOnline([...listFriendOnline, response])
  }

  const deleteFriendOffline = (response: IUserData) => {
    const newData = listFriendOnline.filter((user) => {
      return user.id !== response.id
    })
    setListFriendOnline(newData)
  }

  useEffect(() => {
    socket.emit('onGetOnlineFriends', {})

    socket.on('onGetOnlineFriends', getAllFriendOnline)
  }, [])

  useEffect(() => {
    socket.on('onFriendOnline', AddFiendOnline)

    socket.on('onFriendOffline', deleteFriendOffline)
  }, [listFriendOnline])
  return (
    <div className="bg-white px-1 w-72 fixed top-[82px] right-10 py-3 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
      <div className="flex items-center gap-2 px-3 text-[#0001CB] mb-2">
        <HiOutlineChatBubbleLeftRight className="w-8 h-8  " />
        <span className="font-medium">Đang hoạt động</span>
      </div>

      {listFriendOnline.map((user, index) => (
        <li
          key={index}
          className="relative group list-none ">
          <a className="relative block w-full py-1.5 px-3  text-left clear-both whitespace-nowrap rounded-md hover:bg-gray-200 hover:text-primary-400 cursor-pointer group-hover:opacity-80 transition-all duration-200 ">
            <img
              className="h-10 w-10 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
              src={user.avatarUrl}
              alt="avatar"
            />
            <span
              title="online"
              className="flex justify-center absolute left-10 bottom-2  text-center bg-green-500 border border-white w-[10px] h-[10px] rounded-full"></span>
            <span className="font-semibold">{user.fullName}</span>
          </a>
        </li>
      ))}
    </div>
  )
}

export default UserActive
