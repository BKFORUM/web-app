import { Transition } from '@headlessui/react'
import { FC, Fragment, useState } from 'react'
import test from '../../../assets/images/test.jpg'
import { useClickOutside } from '@hooks/useClickOutside'
import NotificationsIcon from '@mui/icons-material/Notifications'

// import { useNavigate } from 'react-router-dom'
import { Tooltip } from '@mui/material'

interface Props {}

const Notification: FC<Props> = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)
  let elementRef: any = useClickOutside(() => {
    if (open) {
      setOpen(false)
    }
  })

  return (
    <div className="relative">
      <div
        className="flex text-sm rounded-full focus:outline-none cursor-pointer"
        id="user-menu-button"
        onClick={() => setOpen(!open)}>
        <div className="relative">
          {open && (
            <NotificationsIcon
              className=" text-[#FEFE00] cursor-pointer"
              sx={{ fontSize: 28 }}
            />
          )}
          {!open && (
            <Tooltip title={<h1 className="text-sm">Notify</h1>}>
              <NotificationsIcon
                className=" text-[#FEFE00] cursor-pointer"
                sx={{ fontSize: 28 }}
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
          className={`absolute rounded right-2 top-[120%] z-50 py-0.5 px-2 bg-white border shadow-md`}
          style={{ width: '20rem' }}>
          <h4 className="p-2 text-xl font-medium">Notification</h4>
          <li className="flex p-2 hover:text-primary-400 cursor-pointer rounded-lg hover:bg-gray-200 transition-all duration-200 ">
            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-2 border border-gray-700 bg-gray-700">
              <img
                className="h-full w-full object-cover "
                src={test}
                alt="avatar"
              />
            </div>
            <p className="text-sm">
              <span className="font-medium">Trương Quang khang</span> đã nhắc đến bạn
              trong một bình luận
            </p>
          </li>
          <li className="flex p-2 hover:text-primary-400 cursor-pointer rounded-lg hover:bg-gray-200 transition-all duration-200 ">
            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-2 border border-gray-700 bg-gray-700">
              <img
                className="h-full w-full object-cover "
                src={test}
                alt="avatar"
              />
            </div>
            <p className="text-sm">
              <span className="font-medium">Trương Quang khang</span> đã nhắc đến bạn
              trong một bình luận
            </p>
          </li>
        </ul>
      </Transition>
    </div>
  )
}

export default Notification
