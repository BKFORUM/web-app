import { FC, useEffect, useState } from 'react'
import ModalCreatePost from '@components/ModalCreatePost/ModalCreatePost'
import PostItem from '@components/PostItem'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  notifyActionSelector,
  postActionSelector,
  postStateSelector,
  userActionSelector,
  userStateSelector,
} from '@store/index'
import AutocompleteCustom from '@components/Autocomplete/Autocomplete'
import { IOption, IUserForumResponse } from '@interfaces/IForum'
import UserActive from '../../components/UserActive'
import ModalConfirm from '@components/ModalConfirm'
import { IPostViewForum } from '@interfaces/IPost'
import InfiniteScroll from 'react-infinite-scroll-component'

interface Props {}

const HomePage: FC<Props> = (): JSX.Element => {
  const { getAllForumByUser, setIsGetAllAgain } = useStoreActions(userActionSelector)
  const { currentUserSuccess, isGetAllAgain } = useStoreState(userStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const { addPost, postImage, deletePost, editPost, getAllPost, setPostSelected } =
    useStoreActions(postActionSelector)
  const { postSelected } = useStoreState(postStateSelector)

  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [forumSelected, setForumSelected] = useState('')
  const [error, setError] = useState('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [dataForum, setDataForum] = useState<IOption[]>([])
  const [dataPost, setDataPost] = useState<IPostViewForum[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const getAllForumByUserData = async (): Promise<void> => {
    if (currentUserSuccess?.id) {
      const res = await getAllForumByUser(currentUserSuccess.id)
      if (res) {
        const option = res.map((item: IUserForumResponse) => {
          return { id: item.id, name: item.name }
        })
        setDataForum(option)
      }
    }
  }

  const getAllPostData = async (): Promise<void> => {
    const res = await getAllPost({
      skip: paginationModel.page * 10,
      take: paginationModel.pageSize,
    })
    if (res) {
      setTotalRowCount(res.totalRecords)
      setDataPost([...dataPost, ...res.data])
    }
  }

  useEffect(() => {
    getAllPostData()
  }, [paginationModel])

  useEffect(() => {
    if (isGetAllAgain) {
      getAllForumByUserData()
      setIsGetAllAgain(false)
    }
  }, [isGetAllAgain])

  useEffect(() => {
    getAllForumByUserData()
  }, [currentUserSuccess?.id])

  const handleChange = (value: string): void => {
    setForumSelected(value)
  }

  const handleCreatePost = (): void => {
    if (forumSelected === '') {
      setError('Vui lòng chọn forum trước khi viết bài')
      return
    }
    setError('')
    setPostSelected(null)
    setOpenModal(true)
  }

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
            forumId: forumSelected,
            content: data.content,
            documents: resImage,
          })
          if (res) {
            if (
              currentUserSuccess &&
              currentUserSuccess.forums.some((item) => item.id === forumSelected)
            ) {
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
          forumId: forumSelected,
          content: data.content,
        })
        if (res) {
          if (
            currentUserSuccess &&
            currentUserSuccess.forums.some((item) => item.id === forumSelected)
          ) {
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

  return (
    <>
      <div className="grid grid-cols-10 pt-6 flex-1">
        <div className="col-span-7 ml-40 mr-16 ">
          <div className="relative flex-1 flex gap-2 items-center px-6 py-6 bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
            <div className=" flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-2 border border-gray-700 bg-gray-700">
              <img
                className="w-full h-full "
                src={currentUserSuccess?.avatarUrl}
                alt={currentUserSuccess?.fullName}
              />
            </div>
            <input
              onClick={() => handleCreatePost()}
              className="bg-slate-100 cursor-pointer px-4 py-2.5 rounded-3xl w-[200px] text-left flex-auto mr-2 hover:bg-slate-300 transition-all duration-300"
              type="button"
              value="Viết bài tại đây...."
            />
            <AutocompleteCustom
              value={forumSelected}
              onChange={handleChange}
              placeholder="Select forum"
              options={dataForum}
              width="250px"
            />

            {forumSelected === '' && (
              <span className="absolute text-red-500 bottom-0 text-sm left-1/2 -translate-x-1/2">
                {error}
              </span>
            )}
          </div>

          <div>
            <InfiniteScroll
              style={{ overflow: 'hidden' }}
              dataLength={dataPost.length}
              next={() =>
                setPaginationModel({
                  page: paginationModel.page + 1,
                  pageSize: 10,
                })
              }
              hasMore={dataPost.length !== totalRowCount}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }>
              {dataPost.map((item, index) => (
                <div
                  key={index}
                  className="my-4 bg-white min-h-[100px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md ">
                  <PostItem
                    item={item}
                    // moderatorId={moderatorId}
                    setOpenModal={setOpenModal}
                    setOpenModalDelete={setOpenModalDelete}
                  />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </div>

        <div className="col-span-3 px-4 ">
          <UserActive />
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

export default HomePage
