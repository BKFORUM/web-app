import { conversationStateSelector } from '@store/index'
import { useStoreState } from 'easy-peasy'
import { FC } from 'react'
import { IoPersonCircleOutline, IoChevronDownSharp } from 'react-icons/io5'
// import { HiUserPlus } from 'react-icons/hi2'
// import OptionGroup from '../OptionGroup'

interface Props {}

// const fakeData = [
//   {
//     id: 1,
//     name: 'Trương Quang Khang',
//     image: '../../assets/images/test666.jpg',
//   },
//   {
//     id: 2,
//     name: 'Nguyễn Văn Thịnh',
//     image: '../../assets/images/test666.jpg',
//   },
//   {
//     id: 4,
//     name: 'Nguyễn Phạm Nam Anh',
//     image: '../../assets/images/test666.jpg',
//   },
//   {
//     id: 5,
//     name: 'Nguyễn Thành Đạt',
//     image: '../../assets/images/test666.jpg',
//   },
// ]

const DetailConversation: FC<Props> = (): JSX.Element => {
  const { currentConversation } = useStoreState(conversationStateSelector)

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
      {/* {id !== '3' && ( */}
      <div
        className="flex flex-col items-center justify-center mt-4"
        // onClick={() =>navigate('/profile/' + currentConversation?.lastMessage?.userId) }
      >
        <IoPersonCircleOutline className="h-8 w-8 p-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300" />
        <span className="text-sm">Trang cá nhân</span>
      </div>
      {/* )} */}
      {/* {id === '3' && (
        <div
          className="flex flex-col items-center justify-center mt-4"
          // onClick={() => setIsOpenAddUser(true)}
        >
          <HiUserPlus className="h-8 w-8 p-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300" />
          <span className="text-sm">Mời</span>
        </div>
      )} */}

      <div className="mt-4 w-full px-2 py-1 flex justify-between items-center hover:bg-gray-200 cursor-pointer transition-all duration-200 rounded-md">
        <span>File phương tiện</span>
        <IoChevronDownSharp className="h-5 w-5 mr-4" />
      </div>

      <div className="w-full px-2 py-1 flex justify-between items-center hover:bg-gray-200 cursor-pointer transition-all duration-200 rounded-md">
        <span>File</span>
        <IoChevronDownSharp className="h-5 w-5 mr-4" />
      </div>

      {/* {id === '3' && (
        <div className="w-full flex flex-col">
          <span className=" px-2 py-1">Thành viên của nhóm</span>
          <ul>
            {fakeData.map((item, index) => (
              <li
                key={index}
                className="relative group list-none flex justify-between items-center py-1.5 px-2  text-left clear-both whitespace-nowrap rounded-md hover:bg-gray-200 hover:text-primary-400 cursor-pointer group-hover:opacity-80 transition-all duration-200   ">
                <a className="relative block w-full ">
                  <img
                    className="h-8 w-8 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
                    src={item.image}
                    alt="avatar"
                  />
                  <span className="font-semibold text-sm">{item.name}</span>
                </a>
                <OptionGroup />
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  )
}

export default DetailConversation
