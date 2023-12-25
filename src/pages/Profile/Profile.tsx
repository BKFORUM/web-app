import { FC, useEffect, useState } from 'react'
import { HiPencilAlt } from 'react-icons/hi'

import { Box, Tab, Tabs } from '@mui/material'
import TabPanel from '@layouts/components/TabPanel'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  // friendActionSelector,
  notifyActionSelector,
  postActionSelector,
  postStateSelector,
  userActionSelector,
  userStateSelector,
} from '@store/index'
import { useParams } from 'react-router-dom'
import { ICurrentUser } from '@interfaces/IUser'
import { IPostViewForum } from '@interfaces/IPost'
import { IUserForumResponse } from '@interfaces/IForum'
import ForumUserItem from './components/ForumUserItem'
import ModalCreatePost from '@components/ModalCreatePost/ModalCreatePost'
import ModalConfirm from '@components/ModalConfirm'
import ModalEditUser from './components/ModalEditUser'
import PostProfile from './components/PostProfile'
import { pageMode } from '@interfaces/IClient'
import { formatDateLocal } from '@utils/functions/formatDay'
import OptionProfile from './components/OptionProfile'

interface Props {}

const Profile: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const { getUserById, getAllForumByUser, editEdit, setCurrentUserSuccess } =
    useStoreActions(userActionSelector)
  const { getAllPostByUser, deletePost, editPost, postImage } =
    useStoreActions(postActionSelector)
  const { postSelected } = useStoreState(postStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const { currentUserSuccess } = useStoreState(userStateSelector)
  // const {getFriendMe} = useStoreActions(friendActionSelector)

  const [value, setValue] = useState(0)
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openModalEditUser, setOpenModalEditUser] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [user, setUser] = useState<ICurrentUser>()
  const [dataPost, setDataPost] = useState<IPostViewForum[]>([])
  const [dataForum, setDataForum] = useState<IUserForumResponse[]>([])
  // const [listFriend, setListFriend] = useState<IUserData[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)

  const getAllPostByUserData = async (): Promise<void> => {
    if (id && paginationModel) {
      setIsLoading(true)
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
        setDataPost([...dataPost, ...res.data])
      }
      setIsLoading(false)
    }
  }

  const getAllForumByUserData = async (): Promise<void> => {
    if (id) {
      const res = await getAllForumByUser(id)
      if (res) {
        setDataForum(res)
      }
    }
  }

  // const getAllFriendMe = async (): Promise<void> => {
  //   if (id) {
  //     const res = await getFriendMe()
  //     if (res) {
  //       setListFriend()
  //     }
  //   }
  // }

  useEffect(() => {
    getAllPostByUserData()
  }, [paginationModel])

  const getProfile = async (): Promise<void> => {
    if (id) {
      const res = await getUserById(id)
      setUser(res)
      if (id === currentUserSuccess?.id) {
        setCurrentUserSuccess(res)
      }
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    if (id) {
      setDataPost([])
      setPaginationModel({ page: 0, pageSize: 10 })
      const fetchData = async () => {
        await Promise.all([getProfile(), getAllForumByUserData()])
      }
      fetchData()
    }
  }, [id])

  const handleAction = async (data: any): Promise<void> => {
    setIsLoading(true)
    const formData = new FormData()
    for (let i = 0; i < data?.files?.length; i++) {
      formData.append(`documents`, data.files[i])
    }

    const newUrls = data?.imageEdit.map((image: any) => {
      return { fileUrl: image.fileUrl, fileName: image.fileName }
    })

    if (postSelected) {
      if (data.files?.length > 0) {
        const resImage = await postImage(formData)
        if (resImage) {
          const res = await editPost({
            id: postSelected.id,
            content: data.content,
            documents: [...resImage, ...newUrls],
          })
          if (res) {
            setNotifySetting({
              show: true,
              status: 'success',
              message: 'Edit post successfully',
            })
            const updatedPosts = dataPost.map((post: IPostViewForum) =>
              post.id === postSelected.id
                ? { ...post, content: data.content, documents: [...resImage, ...newUrls] }
                : post,
            )
            setDataPost(updatedPosts)
          }
          setIsLoading(false)
          setOpenModal(false)
        }
      } else {
        const res = await editPost({
          id: postSelected.id,
          content: data.content,
          documents: newUrls,
        })
        if (res) {
          setNotifySetting({
            show: true,
            status: 'success',
            message: 'Edit post successfully',
          })
          const updatedPosts = dataPost.map((post: IPostViewForum) =>
            post.id === postSelected.id
              ? { ...post, content: data.content, documents: [...newUrls] }
              : post,
          )
          setDataPost(updatedPosts)
        }
        setIsLoading(false)
        setOpenModal(false)
      }
    }
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
        const updatedPosts = dataPost.filter((post) => post.id !== postSelected?.id)
        setDataPost(updatedPosts)
      }
      setIsLoading(false)
      setOpenModalDelete(false)
    }
  }

  const handleEditUser = async (data: any): Promise<void> => {
    const newData = { ...data, dateOfBirth: formatDateLocal(data.dateOfBirth) }
    if (data?.avatarUrl.length === 0) {
      const res = await editEdit({
        ...newData,
        avatarUrl: user?.avatarUrl,
      })
      if (res) {
        setNotifySetting({
          show: true,
          status: 'success',
          message: 'Edit user successfully',
        })
        getProfile()
        setOpenModalEditUser(false)
      }
    } else {
      const formData = new FormData()
      formData.append(`documents`, data?.avatarUrl[0])
      const resImage = await postImage(formData)
      if (resImage) {
        const res = await editEdit({
          ...newData,
          avatarUrl: resImage[0]?.fileUrl,
        })
        if (res) {
          setNotifySetting({
            show: true,
            status: 'success',
            message: 'Edit user successfully',
          })
          getProfile()
          setOpenModalEditUser(false)
        }
      }
    }
  }

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <>
      <div className="bg-white sm:px-0 xl:px-60 pt-8 flex flex-col">
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
              </div>
              <div>
                {currentUserSuccess?.id === user?.id ? (
                  <button
                    onClick={() => setOpenModalEditUser(true)}
                    className="px-4 py-1 bg-[#E6F0F6] text-black rounded-2xl flex items-center hover:bg-blue-300 transition-all duration-200">
                    <HiPencilAlt className="h-6 w-6 mr-2" />
                    <span>Edit profile</span>
                  </button>
                ) : (
                  <>
                    <OptionProfile friendStatus={user?.friendStatus}></OptionProfile>
                  </>
                )}
              </div>
            </div>
          </div>

          <Box sx={{ borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example">
              <Tab
                sx={{ textTransform: 'none' }}
                label="Bài viết"
                {...a11yProps(0)}
              />
              <Tab
                sx={{ textTransform: 'none' }}
                label="Forums"
                {...a11yProps(1)}
              />

              <Tab
                sx={{ textTransform: 'none' }}
                label="Bạn bè"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
        </div>
      </div>
      <div className="sm:container sm:mx-auto sm:px-0 xl:px-60 ">
        <TabPanel
          value={value}
          index={0}>
          <PostProfile
            user={user}
            dataPost={dataPost}
            paginationModel={paginationModel}
            setOpenModal={setOpenModal}
            setOpenModalDelete={setOpenModalDelete}
            setPaginationModel={setPaginationModel}
            totalRowCount={totalRowCount}
            isLoading={isLoading}
          />
        </TabPanel>

        <TabPanel
          value={value}
          index={1}>
          <ForumUserItem
            dataForum={dataForum}
            idUser={user?.id}
          />
        </TabPanel>
      </div>
      {openModal && (
        <ModalCreatePost
          postSelected={!postSelected ? null : postSelected}
          open={openModal}
          setOpen={setOpenModal}
          handleAction={handleAction}
          isLoading={isLoading}
        />
      )}
      <ModalConfirm
        open={openModalDelete}
        handleClose={() => {
          setOpenModalDelete(false)
        }}
        handleDelete={handleDelete}
      />
      {openModalEditUser && (
        <ModalEditUser
          user={user}
          isLoading={isLoading}
          open={openModalEditUser}
          handleAction={handleEditUser}
          setOpen={setOpenModalEditUser}
        />
      )}
    </>
  )
}

export default Profile
