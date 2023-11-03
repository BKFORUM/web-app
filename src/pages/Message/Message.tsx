import { FC, useEffect, useRef, useState } from 'react'
import test from '../../assets/images/test666.jpg'
import { useParams } from 'react-router-dom'
import {
  IoChatbubblesOutline,
  IoAddCircleSharp,
  IoImages,
  IoPawSharp,
  IoPersonCircleOutline,
  IoChevronDownSharp,
} from 'react-icons/io5'
import { HiUserPlus } from 'react-icons/hi2'
import { RiSendPlaneFill } from 'react-icons/ri'
import SearchInput from '@components/SearchInput'
import { Tooltip } from '@mui/material'
import OptionGroup from './components/OptionGroup'
import AddUserToGroup from '../../components/AddUserToGroup'
import InfiniteScroll from 'react-infinite-scroll-component'

interface Props {}

const fakeData = [
  {
    id: 1,
    name: 'Trương Quang Khang',
    image: test,
  },
  {
    id: 2,
    name: 'Nguyễn Văn Thịnh',
    image: test,
  },
  {
    id: 4,
    name: 'Nguyễn Phạm Nam Anh',
    image: test,
  },
  {
    id: 5,
    name: 'Nguyễn Thành Đạt',
    image: test,
  },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
  // {
  //   id: 5,
  //   name: 'Nguyễn Thành Đạt',
  //   image: test,
  // },
]
const Message: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const [inputSearch, setInputSearch] = useState<string>('')
  const [heightContent, setHeightContent] = useState<number | undefined>()
  const [isOpenAddUser, setIsOpenAddUser] = useState<boolean>(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const seendingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (searchRef.current && seendingRef.current) {
      const heightSearch = searchRef.current.scrollHeight
      const heightSeeding = seendingRef.current.scrollHeight
      const windowHeight = window.innerHeight
      const totalHeight = windowHeight - 61 - heightSearch - heightSeeding
      setHeightContent(totalHeight)
    }
  }, [id])

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }

  const handleAddUser = async (data: any): Promise<void> => {
    console.log(data)
  }

  const [items, setItems] = useState(Array.from({ length: 20 }))

  const fetchMoreData = () => {
    setTimeout(() => {
      setItems(items.concat(Array.from({ length: 20 })))
    }, 1500)
  }

  const style = {
    height: 30,
    border: '1px solid green',
    margin: 6,
    padding: 8,
  }
  return (
    <>
      <div className="flex h-full bg-white">
        {id === undefined ? (
          <div className="m-auto text-xl font-bold flex flex-col items-center gap-3">
            <IoChatbubblesOutline className="h-16 w-16 text-[#0001CB]" />
            <span>Chưa có đoạn chat được chọn</span>
          </div>
        ) : (
          <div className="grid grid-cols-8 flex-1">
            <div className="col-span-6 flex flex-col">
              <div
                className="pt-4 py-5 px-4 border-b border-gray-300 shadow"
                ref={searchRef}>
                <SearchInput
                  value={inputSearch}
                  setValue={handleChangeSearch}
                  width="100%"
                  size="small"
                />
              </div>

              <div
                id="scrollableDiv"
                style={{
                  maxHeight: heightContent !== undefined ? heightContent : '0',
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                }}>
                {/*Put the scroll bar always on the bottom*/}
                <InfiniteScroll
                  dataLength={items.length}
                  next={fetchMoreData}
                  style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                  inverse={true} //
                  hasMore={true}
                  loader={<h4>Loading...</h4>}
                  scrollableTarget="scrollableDiv">
                  {items.map((i, index) => (
                    <div
                      style={style}
                      key={index}>
                      div - #{index}
                    </div>
                  ))}
                </InfiniteScroll>
              </div>

              <div
                ref={seendingRef}
                className="mt-auto flex items-center px-4 py-3 gap-4  shadow-stone-400">
                <Tooltip title="Thêm ....">
                  <div>
                    <IoAddCircleSharp className="h-7 w-7 text-[#0001CB] cursor-pointer" />
                  </div>
                </Tooltip>
                <Tooltip title="Thêm ảnh">
                  <div>
                    <IoImages className="h-6 w-6 text-[#0001CB] cursor-pointer" />
                  </div>
                </Tooltip>
                <Tooltip title="Thêm chi chưa biết">
                  <div>
                    <IoPawSharp className="h-6 w-6 text-[#0001CB] cursor-pointer" />
                  </div>
                </Tooltip>
                <div className="relative flex-1">
                  <input
                    type="text"
                    className="w-full outline-none border border-gray-300 px-3 py-1.5 rounded-3xl"
                    placeholder="Aa"
                  />
                  <RiSendPlaneFill className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-[#0001CB] cursor-pointer" />
                </div>
              </div>
            </div>
            <div
              className="col-span-2 border-l border-gray-300 flex flex-col py-4 items-center px-2 overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 62px)' }}>
              <div className="h-20 w-20 overflow-hidden rounded-full">
                <img
                  className="h-full w-full object-cover"
                  src={test}
                  alt=""
                />
              </div>
              <span className="font-semibold text-lg">Trương Quang Khang</span>
              {id !== '3' && (
                <div className="flex flex-col items-center justify-center mt-4">
                  <IoPersonCircleOutline className="h-8 w-8 p-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300" />
                  <span className="text-sm">Trang cá nhân</span>
                </div>
              )}
              {id === '3' && (
                <div
                  className="flex flex-col items-center justify-center mt-4"
                  onClick={() => setIsOpenAddUser(true)}>
                  <HiUserPlus className="h-8 w-8 p-1 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300" />
                  <span className="text-sm">Mời</span>
                </div>
              )}

              <div className="mt-4 w-full px-2 py-1 flex justify-between items-center hover:bg-gray-200 cursor-pointer transition-all duration-200 rounded-md">
                <span>File phương tiện</span>
                <IoChevronDownSharp className="h-5 w-5 mr-4" />
              </div>

              <div className="w-full px-2 py-1 flex justify-between items-center hover:bg-gray-200 cursor-pointer transition-all duration-200 rounded-md">
                <span>File</span>
                <IoChevronDownSharp className="h-5 w-5 mr-4" />
              </div>

              {id === '3' && (
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
              )}
            </div>
          </div>
        )}
      </div>
      <AddUserToGroup
        isOpen={isOpenAddUser}
        setIsOpen={setIsOpenAddUser}
        id={id}
        handleAction={handleAddUser}
      />
    </>
  )
}

export default Message
