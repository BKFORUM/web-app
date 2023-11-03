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
import defaultAvatar from '../../assets/images/default_forum.png'
import PostRequest from './components/PostRequest'
import MemberRequest from './components/MemberRequest'
import EventsForum from './components/EventsForum'
import { pageMode } from '@interfaces/IClient'

interface Props {}

const Forum: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { addPost, postImage, getAllPostByForum, deletePost, editPost } =
    useStoreActions(postActionSelector)
  const { postSelected } = useStoreState(postStateSelector)
  const { getForumById, editForum, setIsGetAllAgainForumById } =
    useStoreActions(forumActionSelector)
  const { isGetAllAgainForumById } = useStoreState(forumStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const { setIsGetAllAgain } = useStoreActions(userActionSelector)

  const [value, setValue] = useState(0)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [openModalEditForum, setOpenModalEditForum] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [detailForum, setDetailForum] = useState<IForumDetail | null>(null)
  const [dataPost, setDataPost] = useState<IPostViewForum[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)

  const getForumData = async (): Promise<void> => {
    if (id) {
      const res = await getForumById(id)
      setDetailForum(res)
    }
  }

  const getAllPostByForumData = async (): Promise<void> => {
    if (id && paginationModel) {
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
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    if (id) {
      setValue(0)
      getForumData()
      setDataPost([])
      setPaginationModel({ page: 0, pageSize: 10 })
    }
  }, [id])

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
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
      setOpenModalEditForum(false)
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
      setOpenModalEditForum(false)
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
      <div className="flex-1 flex flex-col ">
        <div className="bg-white px-20 pt-4  min-h-[20px]">
          <div className="flex justify-between items-center border-b border-gray-400 pb-4">
            <div className="relative group list-none ">
              <a className="relative flex items-center w-full   text-left clear-both whitespace-nowrap rounded-md">
                <img
                  className="h-32 w-32 rounded-full border border-gray-700 bg-gray-700 object-cover mr-4 inline"
                  src={detailForum?.avatarUrl || defaultAvatar}
                  alt="avatar"
                />
                <div>
                  <span className="font-bold text-2xl">{detailForum?.name}</span>
                  {detailForum?.moderator.id === currentUserSuccess?.id && (
                    <button
                      onClick={() => setOpenModalEditForum(true)}
                      className="mt-2 px-4 py-1 bg-[#E6F0F6] text-black rounded-2xl flex items-center hover:bg-blue-300 transition-all duration-200">
                      <HiPencilAlt className="h-6 w-6 mr-2" />
                      <span>Edit profile</span>
                    </button>
                  )}
                </div>
              </a>
            </div>

            <OptionForum />
          </div>
          <Box sx={{ borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example">
              <Tab
                sx={{ textTransform: 'none' }}
                label="Posts"
                {...a11yProps(0)}
              />
              <Tab
                sx={{ textTransform: 'none' }}
                label="Members"
                {...a11yProps(1)}
              />
              <Tab
                sx={{ textTransform: 'none' }}
                label="Events"
                {...a11yProps(2)}
              />
              {detailForum?.moderator.id === currentUserSuccess?.id && (
                <Tab
                  sx={{ textTransform: 'none' }}
                  label="Members request"
                  {...a11yProps(3)}
                />
              )}
              {detailForum?.moderator.id === currentUserSuccess?.id && (
                <Tab
                  sx={{ textTransform: 'none' }}
                  label="Posts request"
                  {...a11yProps(4)}
                />
              )}
            </Tabs>
          </Box>
        </div>

        <div className="mx-72">
          <TabPanel
            value={value}
            index={0}>
            <PostForum
              data={dataPost}
              paginationModel={paginationModel}
              setOpenModal={setOpenModal}
              setOpenModalDelete={setOpenModalDelete}
              setPaginationModel={setPaginationModel}
              totalRowCount={totalRowCount}
              moderatorId={detailForum?.moderator.id}
            />
          </TabPanel>

          <TabPanel
            value={value}
            index={1}>
            <MembersForum
              users={detailForum?.users}
              moderator={detailForum?.moderator}
            />
          </TabPanel>

          <TabPanel
            value={value}
            index={2}>
            <EventsForum />
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
