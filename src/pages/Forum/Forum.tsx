import { FC, useEffect, useState } from 'react'
import test from '../../assets/images/test.jpg'
import ModalCreatePost from '@components/ModalCreatePost/ModalCreatePost'
import avatartest from '../../assets/images/avatartest.jpg'
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineUserCircle,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2'
import PostItem from '@components/PostItem'
import OptionForum from './components/OptionsForum'
import { useParams } from 'react-router-dom'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { notifyActionSelector, postActionSelector, userStateSelector } from '@store/index'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IPostViewForum } from '@interfaces/IPost'

interface Props {}

const Forum: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { addPost, postImage, getAllPostByForum } = useStoreActions(postActionSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [data, setData] = useState<IPostViewForum[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const getAllPostByForumData = async (): Promise<void> => {
    if (id) {
      const res = await getAllPostByForum({
        id: id,
        params: {
          skip: paginationModel.page * 10,
          take: paginationModel.pageSize,
          status: 'ACTIVE',
        },
      })
      if (res) {
        setTotalRowCount(res.totalRecords)
        setData([...data, ...res.data])
      }
    }
  }

  useEffect(() => {
    getAllPostByForumData()
  }, [paginationModel])

  const handleAction = async (data: any): Promise<void> => {
    setIsLoading(true)
    const formData = new FormData()
    for (let i = 0; i < data?.files?.length; i++) {
      formData.append(`documents`, data.files[i])
    }
    if (data.files?.length > 0) {
      const resImage = await postImage(formData)
      if (resImage) {
        const res = await addPost({
          forumId: id,
          content: data.content,
          documents: resImage,
        })
        if (res) {
          setNotifySetting({
            show: true,
            status: 'success',
            message: 'Add post successfully',
          })
        }
      }
      setIsLoading(false)
      setOpenModal(false)
    } else {
      const res = await addPost({
        forumId: id,
        content: data.content,
      })
      if (res) {
        setNotifySetting({
          show: true,
          status: 'success',
          message: 'Add post successfully',
        })
      }
      setIsLoading(false)
      setOpenModal(false)
    }
  }

  const handleCreatePost = (): void => {
    setOpenModal(true)
  }
  return (
    <>
      <div className="grid grid-cols-10 pt-6 flex-1">
        <div className="col-span-7 ml-52 mr-16 ">
          <div className="flex justify-between items-center bg-white p-4 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md min-h-[20px]">
            <div className="relative group list-none ">
              <a className="relative block w-full   text-left clear-both whitespace-nowrap rounded-md">
                <img
                  className="h-14 w-14 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
                  src={test}
                  alt="avatar"
                />
                <span className="font-semibold text-xl">Lớp sinh hoạt 20TCLC_DT4</span>
              </a>
            </div>

            <OptionForum />
          </div>
          <div className=" mt-4 relative flex-1 flex gap-2 items-center px-6 py-6 bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-2 border border-gray-400 bg-gray-400">
              <img
                className="w-full h-full "
                src={currentUserSuccess?.avatarUrl}
                alt={currentUserSuccess?.fullName}
              />
            </div>
            <input
              onClick={() => handleCreatePost()}
              className="bg-gray-200 cursor-pointer px-4 py-2.5 rounded-3xl w-[200px] text-left flex-auto mr-2 hover:bg-gray-300 transition-all duration-300"
              type="button"
              value="Viết bài tại đây...."
            />
          </div>
          <div>
            <InfiniteScroll
              dataLength={data.length}
              next={() =>
                setPaginationModel({ page: paginationModel.page + 1, pageSize: 10 })
              }
              hasMore={data.length !== totalRowCount}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }>
              {data.map((item, index) => (
                <div
                  key={index}
                  className="my-4 bg-white min-h-[100px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md ">
                  <PostItem item={item} />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </div>

        <div className="col-span-3 px-4 ">
          <div className="bg-white px-1  py-3 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
            <div className="flex items-center gap-2 px-3 text-[#0001CB] mb-2">
              <HiOutlineChatBubbleLeftRight className="w-7 h-7  " />
              <span className="font-medium">Nội quy</span>
            </div>
            <ul className="pl-8 font-medium">
              <li>Cấm văn tục, chữi thề, ngôn ngữ không phù hợp</li>
              <li>Cấm chia sẽ những vấn đề nhạy cảm</li>
              <li>Cấm seeding</li>
            </ul>
          </div>

          <div className="bg-white mt-4 px-1  py-3 h-[180px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
            <div className="flex items-center gap-2 px-3 text-[#0001CB] mb-2">
              <HiOutlineUserCircle className="w-7 h-7  " />
              <span className="font-medium">Quản trị viên</span>
            </div>
            <li className="relative group list-none ">
              <a className="relative block w-full py-1.5 px-3  text-left clear-both whitespace-nowrap rounded-md hover:bg-gray-200 hover:text-primary-400 cursor-pointer group-hover:opacity-80 transition-all duration-200 ">
                <img
                  className="h-10 w-10 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 inline"
                  src={avatartest}
                  alt="avatar"
                />
                <span className="font-semibold">Trương Quang Khang</span>
              </a>
            </li>
          </div>

          <div className="bg-white mt-4 px-1  py-3 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
            <div className="flex items-center gap-2 px-3 text-[#0001CB] mb-2">
              <HiOutlineCog6Tooth className="w-7 h-7  " />
              <span className="font-medium">Công cụ quản trị viên</span>
            </div>
            <ul className=" flex flex-col">
              <li className="list-none px-4 py-1 hover:bg-gray-200 transition-all duration-200 cursor-pointer rounded-md">
                Phê duyệt thanh viên được yêu cầu
              </li>
              <li className="list-none px-4 py-1 hover:bg-gray-200 transition-all duration-200 cursor-pointer rounded-md">
                Phê duyệt bài viết được yêu cầu
              </li>
              <li className="list-none px-4 py-1 hover:bg-gray-200 transition-all duration-200 cursor-pointer rounded-md">
                Xóa thành viên khỏi forum
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ModalCreatePost
        open={openModal}
        setOpen={setOpenModal}
        handleAction={handleAction}
        isLoading={isLoading}
      />
    </>
  )
}

export default Forum
