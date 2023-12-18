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
import { pageMode } from '@interfaces/IClient'

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
  const [paginationModel, setPaginationModel] = useState<null | pageMode>(null)

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
    if (paginationModel) {
      const res = await getAllPost({
        skip: paginationModel.page * 10,
        take: paginationModel.pageSize,
      })
      if (res) {
        setTotalRowCount(res.totalRecords)
        setDataPost([...dataPost, ...res.data])
      }
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
    setPaginationModel({ page: 0, pageSize: 10 })
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
                  page: (paginationModel && paginationModel.page + 1) || 0,
                  pageSize: 10,
                })
              }
              hasMore={dataPost.length !== totalRowCount}
              loader={
                isLoading && (
                  <div className="relative py-8">
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
                )
              }
              endMessage={
                <>
                  {!isLoading &&
                    dataPost.length === totalRowCount &&
                    dataPost.length !== 0 && (
                      <p className="text-center pt-3 pb-6">
                        <b>Đã hiển thị tất cả các bài viết</b>
                      </p>
                    )}

                  {!isLoading &&
                    paginationModel &&
                    dataPost.length === totalRowCount &&
                    dataPost.length === 0 && (
                      <p className="text-center pt-3 pb-6">
                        <b>Hiện tại chưa có bài viết nào</b>
                      </p>
                    )}
                </>
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
