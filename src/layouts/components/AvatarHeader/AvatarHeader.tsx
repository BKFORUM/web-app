import { Transition } from '@headlessui/react'
import { FC, Fragment, useEffect, useState } from 'react'
import { useClickOutside } from '@hooks/useClickOutside'
import { ArrowRightOnRectangleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from '@mui/material'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  authActionSelector,
  notifyActionSelector,
  userActionSelector,
  userStateSelector,
} from '@store/index'
import socket from '@utils/socket/socketConfig'

interface Props {}

const AvatarHeader: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const { setIsLoginSuccess, setIsLogoutSuccess } = useStoreActions(authActionSelector)
  const { setCurrentUserSuccess, setIsGetCurrentUserSuccess, setListFriendOnline } =
    useStoreActions(userActionSelector)
  const { currentUserSuccess, messageErrorUser, isGetCurrentUserSuccess } =
    useStoreState(userStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!isGetCurrentUserSuccess) {
      setNotifySetting({ show: true, status: 'error', message: messageErrorUser })
      setIsGetCurrentUserSuccess(true)
    }
  }, [isGetCurrentUserSuccess])

  let elementRef: any = useClickOutside(() => {
    if (open) {
      setOpen(false)
    }
  })
  const _logout = (): void => {
    setCurrentUserSuccess(null)
    setIsLoginSuccess(false)
    setIsLogoutSuccess(true)
    setListFriendOnline([])
    localStorage.removeItem('auth')
    navigate('/auth/login')
    if (socket) {
      socket.disconnect()
    }
  }
  return (
    <div className="relative">
      <div
        className="flex text-sm rounded-full focus:outline-none cursor-pointer"
        id="user-menu-button"
        onClick={() => setOpen(!open)}>
        <div className="relative">
          {open && (
            <img
              className="h-10 w-10 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2"
              src={currentUserSuccess?.avatarUrl}
              alt="avatar"
            />
          )}
          {!open && (
            <Tooltip title={<h1 className="text-sm">Account </h1>}>
              <img
                className="h-10 w-10 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2"
                src={currentUserSuccess?.avatarUrl}
                alt="avatar"
              />
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
        <ul
          ref={elementRef}
          onClick={() => {
            setOpen(!open)
          }}
          className={`absolute rounded right-2 top-[120%] z-50 py-0.5 bg-white border shadow-md w-auto`}
          style={{ minWidth: '17rem' }}>
          <li
            className="relative group list-none"
            onClick={() => navigate('/profile/' + currentUserSuccess?.id)}>
            <a className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-primary-400 cursor-pointer group-hover:opacity-50 ">
              <img
                className="h-10 w-10 rounded-full border border-gray-500 bg-gray-5  00 object-cover mr-2 inline"
                src={currentUserSuccess?.avatarUrl}
                alt="avatar"
              />
              <span className="font-semibold">{currentUserSuccess?.fullName}</span>
            </a>
          </li>
          <li className="relative list-none">
            <hr className="border-t border-gray-200 my-0" />
          </li>
          <li className="relative group list-none ">
            <a className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-primary-400 cursor-pointer group-hover:opacity-50 ">
              <Cog6ToothIcon className="inline w-4 h-4 mr-2 mb-0.5" />
              <span>Change Password</span>
            </a>
          </li>
          <li className="relative list-none">
            <hr className="border-t border-gray-200 my-0" />
          </li>
          <li className="relative group list-none">
            <a
              className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-primary-400 cursor-pointer text-red-600 group-hover:opacity-70"
              onClick={_logout}>
              <ArrowRightOnRectangleIcon className="inline w-4 h-4 text-red-600 mr-2 mb-0.5" />
              <span>Log out</span>
            </a>
          </li>
        </ul>
      </Transition>
    </div>
  )
}

export default AvatarHeader
