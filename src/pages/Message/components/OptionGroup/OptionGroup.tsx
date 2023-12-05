import { Transition } from '@headlessui/react'
import { FC, Fragment, useEffect, useState } from 'react'
import { useClickOutside } from '@hooks/useClickOutside'
import {
  HiEllipsisHorizontal,
  HiOutlineUserCircle,
  // HiOutlineUserMinus,
} from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  conversationActionSelector,
  conversationStateSelector,
  notifyActionSelector,
  // userStateSelector,
} from '@store/index'
// import { IConversation } from '@interfaces/IConversation'
// import { useNavigate } from 'react-router-dom'
interface Props {
  id: string
}

const OptionGroup: FC<Props> = ({ id }: Props): JSX.Element => {
  const navigate = useNavigate()
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const {
    // deleteMemberOfConversation,
    setIsDeleteMemberOfConversationSuccess,
    // setCurrentConversation,
    // setListConversation,
  } = useStoreActions(conversationActionSelector)
  const {
    messageError,
    isDeleteMemberOfConversationSuccess,
    // currentConversation,
    // listConversation,
  } = useStoreState(conversationStateSelector)
  // const { currentUserSuccess } = useStoreState(userStateSelector)

  const [open, setOpen] = useState<boolean>(false)
  let elementRef: any = useClickOutside(() => {
    if (open) {
      setOpen(false)
    }
  })

  // const handleDeleteMember = async (userId: string): Promise<void> => {
  //   const res = await deleteMemberOfConversation({
  //     conversationId: currentConversation?.id,
  //     userId: userId,
  //   })
  //   if (res) {
  //     if (userId === currentUserSuccess?.id) {
  //       const newList = listConversation.filter((item) => {
  //         return item.id !== currentConversation?.id
  //       })
  //       setListConversation(newList)
  //       setCurrentConversation(null)
  //       navigate('/message')
  //     } else {
  //       const newUsers = currentConversation?.users.filter(
  //         (user) => user.userId !== userId,
  //       )
  //       const upDateConversation = {
  //         ...currentConversation,
  //         users: newUsers,
  //       } as IConversation
  //       setCurrentConversation(upDateConversation)
  //     }
  //   }
  // }

  useEffect(() => {
    if (!isDeleteMemberOfConversationSuccess) {
      setNotifySetting({
        show: true,
        status: 'error',
        message: messageError,
      })
      setIsDeleteMemberOfConversationSuccess(true)
    }
  }, [isDeleteMemberOfConversationSuccess])

  return (
    <div className="relative">
      <div
        className="flex text-sm rounded-full focus:outline-none cursor-pointer"
        id="user-menu-button"
        onClick={() => setOpen(!open)}>
        <HiEllipsisHorizontal className="h-8 w-8" />
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
          className={`absolute rounded right-0 top-[100%] z-50 py-0.5 bg-white border shadow-md`}
          style={{ width: '12rem' }}>
          <li
            onClick={() => {
              navigate('/profile/' + id)
            }}
            className="list-none flex gap-2 items-center py-1.5 px-2 cursor-pointer hover:bg-gray-200 transition-all duration-200 ">
            <HiOutlineUserCircle className="w-5 h-5" />
            <span>Trang cá nhân</span>
          </li>
          {/* {!currentConversation?.forumId && (
            <li
              onClick={() => handleDeleteMember(id)}
              className="list-none flex gap-2 text-red-500 items-center py-1.5 px-2 cursor-pointer hover:bg-gray-200 transition-all duration-200 ">
              <HiOutlineUserMinus className="w-5 h-5" />
              <span>Xóa thành viên</span>
            </li>
          )} */}
        </ul>
      </Transition>
    </div>
  )
}

export default OptionGroup
