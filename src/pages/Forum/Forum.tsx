import { FC, useEffect, useState } from 'react'
import test from '../../assets/images/test.jpg'
import ModalCreatePost from '@components/ModalCreatePost/ModalCreatePost'
import { HiPencilAlt } from 'react-icons/hi'
import OptionForum from './components/OptionsForum'
import { useParams } from 'react-router-dom'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  forumActionSelector,
  notifyActionSelector,
  postActionSelector,
  postStateSelector,
  userStateSelector,
} from '@store/index'
import { IPostViewForum } from '@interfaces/IPost'
import { Box, Tab, Tabs } from '@mui/material'
import PostForum from './components/PostForum'
import TabPanel from '@layouts/components/TabPanel'
import { IForumDetail } from '@interfaces/IForum'
import ModalConfirm from '@components/ModalConfirm'

interface Props {}

const Forum: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { addPost, postImage, getAllPostByForum, deletePost, editPost } =
    useStoreActions(postActionSelector)
  const { postSelected } = useStoreState(postStateSelector)
  const { getForumById } = useStoreActions(forumActionSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)

  const [value, setValue] = useState(0)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [detailForum, setDetailForum] = useState<IForumDetail | null>(null)
  const [dataPost, setDataPost] = useState<IPostViewForum[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const getForumData = async (): Promise<void> => {
    if (id) {
      const res = await getForumById(id)
      setDetailForum(res)
    }
  }

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
        setDataPost([...dataPost, ...res.data])
      }
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0)
    if (id) {
      getForumData()
      setDataPost([])
      setPaginationModel({ ...paginationModel, page: 0 })
    }
  }, [id])

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
            setNotifySetting({
              show: true,
              status: 'success',
              message: 'Add post successfully',
            })
            setDataPost([])
            setPaginationModel({ page: 0, pageSize: 10 })
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
          setDataPost([])
          setPaginationModel({ page: 0, pageSize: 10 })
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
                  src={test}
                  alt="avatar"
                />
                <div>
                  <span className="font-bold text-2xl">{detailForum?.name}</span>
                  {detailForum?.moderator.id === currentUserSuccess?.id && (
                    <button className="mt-2 px-4 py-1 bg-[#E6F0F6] text-black rounded-2xl flex items-center hover:bg-blue-300 transition-all duration-200">
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
                label="Posts"
                {...a11yProps(0)}
              />
              <Tab
                label="Members"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
        </div>

        <div>
          <TabPanel
            value={value}
            index={0}>
            <div className="mx-72">
              <PostForum
                data={dataPost}
                paginationModel={paginationModel}
                setOpenModal={setOpenModal}
                setOpenModalDelete={setOpenModalDelete}
                setPaginationModel={setPaginationModel}
                totalRowCount={totalRowCount}
                moderatorId={detailForum?.moderator.id}
              />
            </div>
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

export default Forum
