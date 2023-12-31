import { FC, useEffect, useState } from 'react'
import ModalCreatePost from '@components/ModalCreatePost/ModalCreatePost'
import { HiPencilAlt } from 'react-icons/hi'
import OptionForum from './components/OptionsForum'
import { useParams } from 'react-router-dom'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  forumActionSelector,
  forumStateSelector,
  notifyActionSelector,
  postActionSelector,
  postStateSelector,
  userActionSelector,
  userStateSelector,
} from '@store/index'
import { IPostViewForum } from '@interfaces/IPost'
import { Box, Tab, Tabs } from '@mui/material'
import PostForum from './components/PostForum'
import TabPanel from '@layouts/components/TabPanel'
import { IForumDetail } from '@interfaces/IForum'
import ModalConfirm from '@components/ModalConfirm'
import ModalEditForum from './components/ModalEditForum'
import MembersForum from './components/MembersForum'
import PostRequest from './components/PostRequest'
import MemberRequest from './components/MemberRequest'
import EventsForum from './components/EventsForum'
import { pageMode } from '@interfaces/IClient'
import default_forum from '../../assets/images/default_forum.png'
import { IUserData } from '@interfaces/IUser'
import notFoundSearch from '../../assets/images/notFoundSearch.jpg'

interface Props {}

const Forum: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { addPost, postImage, getAllPostByForum, deletePost, editPost } =
    useStoreActions(postActionSelector)
  const { postSelected } = useStoreState(postStateSelector)
  const {
    getForumById,
    editForum,
    setIsGetAllAgainForumById,
    setListUserForum,
    setIsEditForumSuccess,
  } = useStoreActions(forumActionSelector)
  const { isGetAllAgainForumById, isEditForumSuccess, messageErrorForum } =
    useStoreState(forumStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const { setIsGetAllAgain } = useStoreActions(userActionSelector)

  const [value, setValue] = useState<null | number>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [openModalEditForum, setOpenModalEditForum] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [statusLoading, setStatusLoading] = useState<string>('')
  const [detailForum, setDetailForum] = useState<IForumDetail | null>(null)
  const [dataPost, setDataPost] = useState<IPostViewForum[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)

  const getForumData = async (): Promise<void> => {
    if (id) {
      setStatusLoading('LOADING')
      const res = await getForumById(id)
      if (res) {
        setDetailForum(res)
        const usersList = res?.users.map((userData: { user: IUserData }) => {
          return userData.user
        })
        setValue(res?.yourStatus === 'ACTIVE' ? 0 : 1)
        setListUserForum(usersList)
        setStatusLoading('LOADING_SUCCESS')
      } else {
        setStatusLoading('LOADING_FAIL')
      }
    }
  }

  const getAllPostByForumData = async (): Promise<void> => {
    if (id && paginationModel) {
      setIsLoading(true)
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
        setDataPost([...dataPost, ...res.data])
      }
      setIsLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    if (id) {
      getForumData()
      setDataPost([])
      setPaginationModel({ page: 0, pageSize: 10 })
    }
  }, [id])

  useEffect(() => {
    if (!isEditForumSuccess) {
      setNotifySetting({
        show: true,
        status: 'error',
        message: messageErrorForum,
      })
      setIsEditForumSuccess(true)
    }
  }, [isEditForumSuccess])

  useEffect(() => {
    if (isGetAllAgainForumById) {
      getForumData()
      setDataPost([])
      setPaginationModel({ page: 0, pageSize: 10 })
      setIsGetAllAgainForumById(false)
    }
  }, [isGetAllAgainForumById])

  useEffect(() => {
    getAllPostByForumData()
  }, [paginationModel])

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
    } else {
      if (data.files?.length > 0) {
        const resImage = await postImage(formData)
        if (resImage) {
          const res = await addPost({
            forumId: id,
            content: data.content,
            documents: resImage,
          })
          if (res) {
            if (detailForum?.moderator.id === currentUserSuccess?.id) {
              setNotifySetting({
                show: true,
                status: 'success',
                message: 'Add post successfully',
              })
              setDataPost([])
              setPaginationModel({ page: 0, pageSize: 10 })
            } else {
              setNotifySetting({
                show: true,
                status: 'success',
                message: 'Request post successfully',
              })
            }
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
          if (detailForum?.moderator.id === currentUserSuccess?.id) {
            setNotifySetting({
              show: true,
              status: 'success',
              message: 'Add post successfully',
            })
            setDataPost([])
            setPaginationModel({ page: 0, pageSize: 10 })
          } else {
            setNotifySetting({
              show: true,
              status: 'success',
              message: 'Request post successfully',
            })
          }
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

  const handleEditForum = async (data: any): Promise<void> => {
    setIsLoading(true)
    if (data.avatarUrl.length === 0) {
      const { avatarUrl, ...others } = data
      const res = await editForum(others)
      if (res) {
        setNotifySetting({
          show: true,
          status: 'success',
          message: 'Edit forum successfully',
        })
        getForumData()
        setIsGetAllAgain(true)
      }
      setIsLoading(false)
    } else {
      const formData = new FormData()
      formData.append(`documents`, data?.avatarUrl[0])
      const resImage = await postImage(formData)
      if (resImage) {
        const res = await editForum({ ...data, avatarUrl: resImage[0].fileUrl })
        if (res) {
          setNotifySetting({
            show: true,
            status: 'success',
            message: 'Edit forum successfully',
          })
          getForumData()
          setIsGetAllAgain(true)
        }
      }
      setIsLoading(false)
    }
    setOpenModalEditForum(false)
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
      {statusLoading === 'LOADING_SUCCESS' && (
        <div className="flex-1 flex flex-col ">
          <div className="bg-white px-20 pt-4  min-h-[20px]">
            <div className="flex justify-between items-center border-b border-gray-400 pb-4">
              <div className="relative group list-none ">
                <a className="relative flex items-center w-full   text-left clear-both whitespace-nowrap rounded-md">
                  <img
                    className="h-32 w-32 rounded-full border border-gray-700 bg-gray-700 object-cover mr-4 inline"
                    src={detailForum?.avatarUrl || default_forum}
                    alt="avatar"
                  />
                  <div>
                    <span className="font-bold text-2xl">{detailForum?.name}</span>
                    {detailForum?.moderator.id === currentUserSuccess?.id && (
                      <button
                        onClick={() => setOpenModalEditForum(true)}
                        className="mt-2 px-4 py-1 bg-[#E6F0F6] text-black rounded-2xl flex items-center hover:bg-blue-300 transition-all duration-200">
                        <HiPencilAlt className="h-6 w-6 mr-2" />
                        <span>Chỉnh sửa</span>
                      </button>
                    )}
                  </div>
                </a>
              </div>

              {detailForum && (
                <OptionForum
                  yourStatus={detailForum?.yourStatus}
                  modId={detailForum?.moderator.id}
                  id={id}
                />
              )}
            </div>
            <Box sx={{ borderColor: 'divider', position: 'relative' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example">
                <Tab
                  sx={{
                    textTransform: 'none',
                    display: detailForum?.yourStatus === 'ACTIVE' ? 'flex' : 'none',
                  }}
                  label="Bài viết"
                  {...a11yProps(0)}
                />

                <Tab
                  sx={{ textTransform: 'none' }}
                  label="Thành viên"
                  {...a11yProps(1)}
                />

                <Tab
                  sx={{
                    textTransform: 'none',
                    display: detailForum?.yourStatus === 'ACTIVE' ? 'flex' : 'none',
                  }}
                  label="Sự kiện"
                  {...a11yProps(2)}
                />
                {detailForum?.moderator.id === currentUserSuccess?.id && (
                  <Tab
                    sx={{ textTransform: 'none' }}
                    label="Phê duyệt thành viên"
                    {...a11yProps(3)}
                  />
                )}
                {detailForum?.moderator.id === currentUserSuccess?.id && (
                  <Tab
                    sx={{ textTransform: 'none' }}
                    label="Phê duyệt bài viết"
                    {...a11yProps(4)}
                  />
                )}
              </Tabs>
            </Box>
          </div>

          <div className="sm:mx-20 xl:mx-72 z-10">
            <TabPanel
              value={value}
              index={0}>
              <PostForum
                yourStatus={detailForum?.yourStatus}
                data={dataPost}
                paginationModel={paginationModel}
                setOpenModal={setOpenModal}
                setOpenModalDelete={setOpenModalDelete}
                setPaginationModel={setPaginationModel}
                totalRowCount={totalRowCount}
                moderatorId={detailForum?.moderator.id}
                isLoading={isLoading}
              />
            </TabPanel>

            <TabPanel
              value={value}
              index={1}>
              <MembersForum moderator={detailForum?.moderator} />
            </TabPanel>

            <TabPanel
              value={value}
              index={2}>
              <EventsForum moderator={detailForum?.moderator} />
            </TabPanel>

            <TabPanel
              value={value}
              index={3}>
              <MemberRequest />
            </TabPanel>

            <TabPanel
              value={value}
              index={4}>
              <PostRequest />
            </TabPanel>
          </div>
        </div>
      )}

      {statusLoading === 'LOADING_FAIL' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <div className="h-52 w-52">
            <img
              className="h-full w-full"
              src={notFoundSearch}
              alt="not found search"
            />
          </div>
          <span>We're sorry. We were not able to find a match</span>
        </div>
      )}

      {statusLoading === 'LOADING' && (
        <div className="relative items-center block h-full  bg-slate-200">
          <div
            role="status"
            className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <svg
              aria-hidden="true"
              className="w-10 h-10 text-gray-200 animate-spin fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {openModal && (
        <ModalCreatePost
          postSelected={!postSelected ? null : postSelected}
          open={openModal}
          setOpen={setOpenModal}
          handleAction={handleAction}
          isLoading={isLoading}
        />
      )}
      {openModalEditForum && (
        <ModalEditForum
          forum={detailForum}
          open={openModalEditForum}
          setOpen={setOpenModalEditForum}
          handleAction={handleEditForum}
          isLoading={isLoading}
        />
      )}
      {openModalDelete && (
        <ModalConfirm
          open={openModalDelete}
          handleClose={() => {
            setOpenModalDelete(false)
          }}
          handleDelete={handleDelete}
        />
      )}
    </>
  )
}

export default Forum
