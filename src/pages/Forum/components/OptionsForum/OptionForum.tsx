import { Transition } from '@headlessui/react'
import { FC, Fragment, useEffect, useState } from 'react'
import { useClickOutside } from '@hooks/useClickOutside'
import { HiChevronDown, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  forumActionSelector,
  forumStateSelector,
  notifyActionSelector,
  userActionSelector,
  userStateSelector,
} from '@store/index'
import { useNavigate } from 'react-router-dom'
interface Props {
  yourStatus?: string
  id?: string
  modId?: string
}

const OptionForum: FC<Props> = ({ id, yourStatus, modId }: Props): JSX.Element => {
  const navigate = useNavigate()
  const { exitForum, setIsExitForumSuccess, requestOnForum, updateStatusUserFromForum } =
    useStoreActions(forumActionSelector)
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { messageErrorForum, isEditForumSuccess } = useStoreState(forumStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const { setIsGetAllAgain } = useStoreActions(userActionSelector)

  const [status, setStatus] = useState<string | undefined>(yourStatus)
  const [open, setOpen] = useState<boolean>(false)
  let elementRef: any = useClickOutside(() => {
    if (open) {
      setOpen(false)
    }
  })

  useEffect(() => {
    setStatus(yourStatus)
  }, [yourStatus])

  const handleExitForum = async (): Promise<void> => {
    if (id) {
      const res = await exitForum(id)
      if (res) {
        setNotifySetting({
          show: true,
          status: 'success',
          message: 'Exit forum successfully',
        })
        setIsGetAllAgain(true)
        navigate('/')
      }
    }
  }

  const requestForumUser = async (id: string, status: string): Promise<void> => {
    if (status === 'NOT_MEMBER') {
      const res = await requestOnForum(id)
      if (res) {
        setStatus('PENDING')
      }
    } else {
      const res = await updateStatusUserFromForum({
        id: id,
        userId: currentUserSuccess?.id,
        status: 'DELETED',
      })
      if (res) {
        setStatus('NOT_MEMBER')
      }
    }
  }

  useEffect(() => {
    if (!isEditForumSuccess) {
      setNotifySetting({
        show: true,
        status: 'error',
        message: messageErrorForum,
      })
      setIsExitForumSuccess(true)
    }
  }, [isEditForumSuccess])
  return (
    <div className="relative">
      <div
        className="flex text-sm rounded-full focus:outline-none"
        id="user-menu-button"
        onClick={() => setOpen(!open)}>
        {status === 'ACTIVE' && (
          <div
            className={`relative border-2 border-gray-600 px-4 py-2 rounded-2xl flex items-center ${
              modId !== currentUserSuccess?.id &&
              'hover:bg-gray-200 transition-all duration-200 cursor-pointer'
            } `}>
            <span className="text-base mr-4">Đã tham gia</span>
            <HiChevronDown className="h-5 w-5" />
          </div>
        )}

        {status === 'PENDING' && (
          <div
            onClick={() => requestForumUser(id || '', 'DELETED')}
            className="relative border border-gray-600 px-4 py-2 rounded-2xl flex items-center bg-gray-300 hover:bg-gray-400 text-black/80 transition-all duration-200   ">
            <span className="text-base mr-4">Đã gửi yêu cầu tham gia</span>
          </div>
        )}

        {status === 'NOT_MEMBER' && (
          <div
            onClick={() => requestForumUser(id || '', 'NOT_MEMBER')}
            className="relative border border-gray-200 px-4 py-2 rounded-2xl flex items-center bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200   ">
            <span className="text-base mr-4">Gửi yêu cầu tham gia</span>
          </div>
        )}
      </div>
      {status === 'ACTIVE' && modId !== currentUserSuccess?.id && (
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
            className={`absolute rounded right-0 top-[100%] z-50 py-0.5 bg-white border shadow-md`}
            style={{ minWidth: '14rem' }}>
            <li
              onClick={() => handleExitForum()}
              className="list-none flex gap-2 text-red-500 items-center py-2 px-2 cursor-pointer hover:bg-gray-200 transition-all duration-200 ">
              <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
              <span>Rời khỏi</span>
            </li>
          </ul>
        </Transition>
      )}
    </div>
  )
}

export default OptionForum
