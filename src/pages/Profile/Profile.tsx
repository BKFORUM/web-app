import { FC, useEffect, useState } from 'react'
import {
  HiPencilAlt,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlinePhone,
} from 'react-icons/hi'
import { AiOutlineMan, AiOutlineWoman } from 'react-icons/ai'
import { MdOutlinePermContactCalendar } from 'react-icons/md'
import { GrUserSettings } from 'react-icons/gr'
import { Box, Tab, Tabs } from '@mui/material'
import TabPanel from '@layouts/components/TabPanel'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  notifyActionSelector,
  postActionSelector,
  postStateSelector,
  userActionSelector,
} from '@store/index'
import { useParams } from 'react-router-dom'
import { ICurrentUser } from '@interfaces/IUser'
import { formatDateFormDateLocal } from '@utils/functions/formatDay'
import { IPostViewForum } from '@interfaces/IPost'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostItem from '@components/PostItem'
import { IUserForumResponse } from '@interfaces/IForum'
import ForumUserItem from './components/ForumUserItem'
import ModalCreatePost from '@components/ModalCreatePost/ModalCreatePost'
import ModalConfirm from '@components/ModalConfirm'

interface Props {}

const Profile: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const { getUserById, getAllForumByUser } = useStoreActions(userActionSelector)
  const { getAllPostByUser, deletePost } = useStoreActions(postActionSelector)
  const { postSelected } = useStoreState(postStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)

  const [value, setValue] = useState(0)
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [user, setUser] = useState<ICurrentUser>()
  const [data, setData] = useState<IPostViewForum[]>([])
  const [dataForum, setDataForum] = useState<IUserForumResponse[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const getAllPostByUserData = async (): Promise<void> => {
    if (id) {
      const res = await getAllPostByUser({
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

  const getAllForumByUserData = async (): Promise<void> => {
    if (id) {
      const res = await getAllForumByUser(id)
      if (res) {
        console.log(res)
        setDataForum(res)
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllForumByUserData(), getAllPostByUserData()])
    }
    fetchData()
  }, [paginationModel])

  const getProfile = async (): Promise<void> => {
    if (id) {
      const res = await getUserById(id)
      setUser(res)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  const handleAction = async (data: any): Promise<void> => {
    console.log(data)
  }

  const handleDelete = async (): Promise<void> => {
    setIsLoading(true)
    if (postSelected?.id !== undefined) {
      const res = await deletePost(postSelected?.id)
      if (res) {
        setNotifySetting({
          show: true,
          status: 'success',
          message: 'Delete post successfully',
        })
        const updatedPosts = data.filter((post) => post.id !== postSelected?.id)
        setData(updatedPosts)
      }
      setIsLoading(false)
      setOpenModalDelete(false)
    }
  }

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <>
      <div className="bg-white sm:px-0 lg:px-60 pt-8 flex flex-col">
        <div className="container mx-auto">
          <div className="flex items-center gap-8 border-b border-gray-300 pb-6 flex-1 ">
            <div className="h-40 w-40 overflow-hidden">
              <img
                className="h-full w-full border border-gray-300 rounded-full"
                src={user?.avatarUrl}
                alt={user?.fullName}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <h4 className="text-2xl font-semibold mr-4 mb-1">{user?.fullName}</h4>
                <button className="px-4 py-1 bg-[#E6F0F6] text-black rounded-2xl flex items-center hover:bg-blue-300 transition-all duration-200">
                  <HiPencilAlt className="h-6 w-6 mr-2" />
                  <span>Edit profile</span>
                </button>
              </div>
              <div>
                <span className="px-4 py-1 bg-[#E6F0F6] rounded-2xl">445 bạn bè</span>
              </div>
            </div>
          </div>

          <Box sx={{ borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example">
              <Tab
                label="Posts"
                {...a11yProps(0)}
              />
              <Tab
                label="Forums"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
        </div>
      </div>

      <div className="container mx-auto sm:px-0 lg:px-60">
        <TabPanel
          value={value}
          index={0}>
          <div className="grid grid-cols-6 gap-4 ">
            <div className="col-span-2">
              <div className="flex flex-col px-4 gap-6 bg-white rounded-md py-4 mt-4">
                <div className="flex items-center">
                  <MdOutlinePermContactCalendar className="w-7 h-7 " />
                  <span className="text-base font-semibold ml-4">
                    {formatDateFormDateLocal(String(user?.dateOfBirth))}
                  </span>
                </div>
                <div className="flex items-center">
                  {user?.gender === 'MALE' && <AiOutlineMan className="w-7 h-7 " />}
                  {user?.gender === 'FEMALE' && <AiOutlineWoman className="w-7 h-7 " />}
                  <span className="text-base font-semibold ml-4">{user?.gender}</span>
                </div>
                <div className="flex items-center">
                  <HiOutlineLocationMarker className="w-7 h-7 " />
                  <span className="text-base font-semibold ml-4">{user?.address}</span>
                </div>
                <div className="flex items-center">
                  <HiOutlineMail className="w-6 h-6 " />
                  <span className="text-base font-semibold ml-4 line-clamp-1 ">
                    {user?.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <GrUserSettings className="w-6 h-6 ml-0.5 " />
                  <span className="text-base font-semibold ml-4">{user?.type}</span>
                </div>
                <div className="flex items-center">
                  <HiOutlineOfficeBuilding className="w-6 h-6 " />
                  <span className="text-base font-semibold ml-4">
                    {user?.faculty.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <HiOutlinePhone className="w-6 h-6 " />
                  <span className="text-base font-semibold ml-4">
                    {user?.phoneNumber}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-span-4 ">
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
                    <PostItem
                      item={item}
                      setOpenModal={setOpenModal}
                      setOpenModalDelete={setOpenModalDelete}
                    />
                  </div>
                ))}
              </InfiniteScroll>
            </div>
          </div>
        </TabPanel>

        <TabPanel
          value={value}
          index={1}>
          <ForumUserItem dataForum={dataForum} />
        </TabPanel>
      </div>

      <ModalCreatePost
        postSelected={postSelected}
        open={openModal}
        setOpen={setOpenModal}
        handleAction={handleAction}
        isLoading={isLoading}
      />

      <ModalConfirm
        open={openModalDelete}
        handleClose={() => {
          setOpenModalDelete(false)
        }}
        handleDelete={handleDelete}
      />
    </>
  )
}

export default Profile
