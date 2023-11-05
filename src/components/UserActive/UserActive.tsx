import { FC, useEffect } from 'react'
import avatartest from '../../assets/images/avatartest.jpg'
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'
import socket from '@utils/socket/socketConfig'

interface Props {}

const UserActive: FC<Props> = (): JSX.Element => {
  console.log(socket)
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server')
    })
    socket.on('connect_error', (err) => console.log(err))
    socket.on('connect_failed', (err) => console.log(err))
    socket.on('disconnect', (err) => console.log(err))
  }, [])
  return (
    <div className="bg-white px-1  py-3 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
      <div className="flex items-center gap-2 px-3 text-[#0001CB] mb-2">
        <HiOutlineChatBubbleLeftRight className="w-8 h-8  " />
        <span className="font-medium">Đang hoạt động</span>
      </div>
      <li className="relative group list-none ">
        <a className="relative block w-full py-1.5 px-3  text-left clear-both whitespace-nowrap rounded-md hover:bg-gray-200 hover:text-primary-400 cursor-pointer group-hover:opacity-80 transition-all duration-200 ">
          <img
            className="h-10 w-10 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
            src={avatartest}
            alt="avatar"
          />
          <span
            title="online"
            className="flex justify-center absolute left-10 bottom-2  text-center bg-green-500 border border-white w-[10px] h-[10px] rounded-full"></span>
          <span className="font-semibold">Trương Quang Khang</span>
        </a>
      </li>
      <li className="relative group list-none ">
        <a className="relative block w-full py-1.5 px-3  text-left clear-both whitespace-nowrap rounded-md hover:bg-gray-200 hover:text-primary-400 cursor-pointer group-hover:opacity-80 transition-all duration-200 ">
          <img
            className="h-10 w-10 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
            src={avatartest}
            alt="avatar"
          />
          <span
            title="online"
            className="flex justify-center absolute left-10 bottom-2  text-center bg-green-500 border border-white w-[10px] h-[10px] rounded-full"></span>
          <span className="font-semibold">Trương Quang Khang</span>
        </a>
      </li>
      <li className="relative group list-none ">
        <a className="relative block w-full py-1.5 px-3  text-left clear-both whitespace-nowrap rounded-md hover:bg-gray-200 hover:text-primary-400 cursor-pointer group-hover:opacity-80 transition-all duration-200 ">
          <img
            className="h-10 w-10 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
            src={avatartest}
            alt="avatar"
          />
          <span
            title="online"
            className="flex justify-center absolute left-10 bottom-2  text-center bg-green-500 border border-white w-[10px] h-[10px] rounded-full"></span>
          <span className="font-semibold">Trương Quang Khang</span>
        </a>
      </li>
      <li className="relative group list-none ">
        <a className="relative block w-full py-1.5 px-3  text-left clear-both whitespace-nowrap rounded-md hover:bg-gray-200 hover:text-primary-400 cursor-pointer group-hover:opacity-80 transition-all duration-200 ">
          <img
            className="h-10 w-10 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
            src={avatartest}
            alt="avatar"
          />
          <span
            title="online"
            className="flex justify-center absolute left-10 bottom-2  text-center bg-green-500 border border-white w-[10px] h-[10px] rounded-full"></span>
          <span className="font-semibold">Trương Quang Khang</span>
        </a>
      </li>
      <li className="relative group list-none ">
        <a className="relative block w-full py-1.5 px-3  text-left clear-both whitespace-nowrap rounded-md hover:bg-gray-200 hover:text-primary-400 cursor-pointer group-hover:opacity-80 transition-all duration-200 ">
          <img
            className="h-10 w-10 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
            src={avatartest}
            alt="avatar"
          />
          <span
            title="online"
            className="flex justify-center absolute left-10 bottom-2  text-center bg-green-500 border border-white w-[10px] h-[10px] rounded-full"></span>
          <span className="font-semibold">Trương Quang Khang</span>
        </a>
      </li>
    </div>
  )
}

export default UserActive
