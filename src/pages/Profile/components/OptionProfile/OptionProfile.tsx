import { Transition } from '@headlessui/react'
import { FC, Fragment, useEffect, useState } from 'react'
import { useClickOutside } from '@hooks/useClickOutside'
import {
  BiSolidUserCheck,
  BiSolidUserPlus,
  BiSolidUserDetail,
  BiSolidUserX,
  BiSolidUserVoice,
} from 'react-icons/bi'
import { useStoreActions } from 'easy-peasy'
import { friendActionSelector } from '@store/index'
import { useParams } from 'react-router-dom'

interface Props {
  friendStatus?: string
}

const OptionProfile: FC<Props> = ({ friendStatus }: Props): JSX.Element => {
  const { id } = useParams()
  const { requestFriend, updateStatusFriend } = useStoreActions(friendActionSelector)

  const [statusFriend, setStatusFriend] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)

  let elementRef: any = useClickOutside(() => {
    if (open) {
      setOpen(false)
    }
  })

  useEffect(() => {
    if (friendStatus !== undefined) {
      setStatusFriend(friendStatus)
    }
  }, [id, friendStatus])

  const requestFriendUser = async (status: string): Promise<void> => {
    if (id) {
      if (status === 'NOT FRIEND') {
        const res = await requestFriend(id)
        if (res) {
          setStatusFriend('PENDING_SENT')
        }
      }

      if (status == 'DELETED') {
        const res = await updateStatusFriend({ id: id, status: 'DELETED' })
        if (res) {
          setStatusFriend('NOT FRIEND')
        }
      }

      if (status == 'PENDING_RECEIVED') {
        const res = await updateStatusFriend({ id: id, status: 'ACTIVE' })
        if (res) {
          setStatusFriend('ACTIVE')
        }
      }
    }
  }

  return (
    <div className="relative flex-shrink-0">
      <div
        className="flex text-sm rounded-full focus:outline-none "
        id="user-menu-button">
        <div className="relative flex-shrink">
          {statusFriend === 'ACTIVE' && (
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-1.5 bg-blue-600 rounded-md text-white hover:bg-blue-700 flex items-center gap-1.5">
              <BiSolidUserCheck className="h-5 w-5" />
              <span>Bạn bè</span>
            </button>
          )}

          {statusFriend === 'NOT FRIEND' && (
            <button
              onClick={() => requestFriendUser('NOT FRIEND')}
              className="px-4 py-1.5 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-all duration-300 flex items-center gap-1.5">
              <BiSolidUserPlus className="h-5 w-5" />
              <span>Thêm bạn bè</span>
            </button>
          )}

          {statusFriend === 'PENDING_RECEIVED' && (
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-1.5 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-all duration-300 flex items-center gap-1.5">
              <BiSolidUserDetail className="h-5 w-5" />
              <span>Phản hồi</span>
            </button>
          )}

          {statusFriend === 'PENDING_SENT' && (
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-1.5 bg-gray-500 rounded-md text-white hover:bg-gray-700 transition-all duration-300 flex items-center gap-1.5">
              <BiSolidUserVoice className="h-5 w-5" />
              <span>Đã gửi yêu cầu kết bạn</span>
            </button>
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
          className={`absolute rounded-md left-0 top-[120%] z-50 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] overflow-hidden`}
          style={{ minWidth: '4rem' }}>
          {statusFriend === 'ACTIVE' && (
            <li
              onClick={() => requestFriendUser('DELETED')}
              className="list-none px-2 py-1 cursor-pointer bg-slate-50 hover:bg-gray-200 flex gap-1.5 items-center">
              <BiSolidUserX className="h-5 w-5" />
              <span>Hủy kết bạn</span>
            </li>
          )}

          {statusFriend === 'PENDING_RECEIVED' && (
            <>
              <li
                onClick={() => requestFriendUser('PENDING_RECEIVED')}
                className="list-none px-2 py-1 cursor-pointer bg-slate-50 hover:bg-gray-200 flex gap-1.5 items-center">
                <BiSolidUserCheck className="h-5 w-5" />
                <span>Chấp nhận</span>
              </li>
              <li
                onClick={() => requestFriendUser('DELETED')}
                className="list-none px-2 py-1 cursor-pointer bg-slate-50 hover:bg-gray-200 flex gap-1.5 items-center">
                <BiSolidUserX className="h-5 w-5" />
                <span>Xóa lời mời</span>
              </li>
            </>
          )}

          {statusFriend === 'PENDING_SENT' && (
            <>
              <li
                onClick={() => requestFriendUser('DELETED')}
                className="list-none px-2 py-1 cursor-pointer bg-slate-50 hover:bg-gray-200 flex gap-1.5 items-center">
                <BiSolidUserX className="h-5 w-5" />
                <span>Hủy yều cầu</span>
              </li>
            </>
          )}
        </ul>
      </Transition>
    </div>
  )
}

export default OptionProfile
