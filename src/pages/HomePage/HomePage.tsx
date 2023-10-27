import { FC, useState } from 'react'
import Selected from '@components/Select'
import test from '../../assets/images/test.jpg'
import ModalCreatePost from '@components/ModalCreatePost/ModalCreatePost'
import avatartest from '../../assets/images/avatartest.jpg'
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'
import PostItem from '@components/PostItem'

interface Props {}

const HomePage: FC<Props> = (): JSX.Element => {
  const [forumSelected, setForumSelected] = useState('')
  const [error, setError] = useState('')
  const [openModal, setOpenModal] = useState<boolean>(false)

  const handleChange = (value: any): void => {
    setForumSelected(value?.target.value)
  }

  const handleCreatePost = (): void => {
    if (forumSelected === '') {
      setError('Vui lòng chọn forum trước khi viết bài')
      return
    }
    setError('')
    setOpenModal(true)
  }
  return (
    <>
      <div className="grid grid-cols-10 pt-6 flex-1">
        <div className="col-span-7 ml-52 mr-16 ">
          <div className="relative flex-1 flex gap-2 items-center px-6 py-6 bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
            <div className=" flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-2 border border-gray-700 bg-gray-700">
              <img
                className="w-full h-full "
                src={test}
                alt="avatar"
              />
            </div>
            <input
              onClick={() => handleCreatePost()}
              className="bg-gray-200 cursor-pointer px-4 py-2.5 rounded-3xl w-[200px] text-left flex-auto mr-2 hover:bg-gray-300 transition-all duration-300"
              type="button"
              value="Viết bài tại đây...."
            />
            <Selected
              value={forumSelected}
              onChange={handleChange}
              empty="Select forum"
              width="180px"
            />

            {forumSelected === '' && (
              <span className="absolute text-red-500 bottom-0 text-sm left-1/2 -translate-x-1/2">
                {error}
              </span>
            )}
          </div>

          <div className="my-4   bg-white min-h-[100px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md ">
            <PostItem />
          </div>
        </div>

        <div className="col-span-3 px-4 ">
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
        </div>
      </div>

      <ModalCreatePost
        open={openModal}
        setOpen={setOpenModal}
      />
    </>
  )
}

export default HomePage
