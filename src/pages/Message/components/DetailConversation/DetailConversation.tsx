import { conversationStateSelector, userStateSelector } from '@store/index'
import { useStoreState } from 'easy-peasy'
import { FC } from 'react'
import { IoPersonCircleOutline, IoChevronDownSharp } from 'react-icons/io5'
import { HiUserPlus } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import OptionGroup from '../OptionGroup'

interface Props {}

const DetailConversation: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const { currentConversation } = useStoreState(conversationStateSelector)
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const userProfile = currentConversation?.users.filter((user) => {
    return user.userId !== currentUserSuccess?.id
  })
  // console.log(currentConversation)

  return (
    <div
      className="col-span-2 border-l border-gray-300 flex flex-col py-4 items-center px-2 overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 62px)' }}>
      <div className="h-20 w-20 overflow-hidden rounded-full">
        <img
          className="h-full w-full object-cover"
          src={currentConversation?.avatarUrl}
          alt={currentConversation?.displayName}
        />
      </div>
      <span className="font-semibold text-lg">{currentConversation?.displayName}</span>
      {currentConversation?.type === 'CHAT' && (
        <div
          className="flex flex-col items-center justify-center mt-4"
          onClick={() => {
            if (userProfile) navigate('/profile/' + userProfile[0]?.userId)
          }}>
          <IoPersonCircleOutline className="h-8 w-8 p-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300" />
          <span className="text-sm">Trang cá nhân</span>
        </div>
      )}
      {currentConversation?.type === 'GROUP_CHAT' && !currentConversation.forumId && (
        <div
          className="flex flex-col items-center justify-center mt-4"
          // onClick={() => setIsOpenAddUser(true)}
        >
          <HiUserPlus className="h-8 w-8 p-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300" />
          <span className="text-sm">Mời</span>
        </div>
      )}

      <div className="mt-4 w-full px-2 py-1 flex justify-between items-center hover:bg-gray-200 cursor-pointer transition-all duration-200 rounded-md">
        <span>File phương tiện</span>
        <IoChevronDownSharp className="h-5 w-5 mr-4" />
      </div>

      {currentConversation?.type === 'GROUP_CHAT' && (
        <div className="w-full flex flex-col">
          <span className=" px-2 py-1">Thành viên của nhóm</span>
          <ul>
            {currentConversation.users.map((item, index) => (
              <li
                key={index}
                className="relative group list-none flex justify-between items-center py-1.5 px-2  text-left clear-both whitespace-nowrap rounded-md hover:bg-gray-200 hover:text-primary-400 cursor-pointer group-hover:opacity-80 transition-all duration-200   ">
                <a className="relative  w-full  flex ">
                  <img
                    className="h-8 w-8 flex-shrink rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
                    src={item.user.avatarUrl}
                    alt="avatar"
                  />
                  <span className="font-semibold text-sm">{item.user.fullName}</span>
                </a>
                <OptionGroup id={item.userId} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DetailConversation
