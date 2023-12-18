import Button from '@components/Button'
import PostItem from '@components/PostItem'
import { pageMode } from '@interfaces/IClient'
import { IPostViewForum } from '@interfaces/IPost'
import {
  forumActionSelector,
  notifyActionSelector,
  postActionSelector,
  postStateSelector,
} from '@store/index'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { FC, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router-dom'

interface Props {}

const PostRequest: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const { getAllPostByForum, setIsUpdateStatusPostSuccess, updateStatusPost } =
    useStoreActions(postActionSelector)
  const { isUpdateStatusPostSuccess, messageError } = useStoreState(postStateSelector)
  const { setIsGetAllAgainForumById } = useStoreActions(forumActionSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dataPost, setDataPost] = useState<IPostViewForum[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)

  const getAllPostByForumData = async (): Promise<void> => {
    if (id && paginationModel) {
      const res = await getAllPostByForum({
        id: id,
        params: {
          skip: paginationModel.page * 10,
          take: paginationModel.pageSize,
          status: 'PENDING',
        },
      })
      if (res) {
        setTotalRowCount(res.totalRecords)
        setDataPost([...dataPost, ...res.data])
      }
    }
  }

  const handelAction = async (status: string, id: string): Promise<void> => {
    setIsLoading(true)
    const res = await updateStatusPost({ id: id, status: status })
    if (res) {
      setNotifySetting({
        show: true,
        status: 'success',
        message: `${status === 'ACTIVE' ? 'Approve' : 'Reject'} post successfully`,
      })
      if (status === 'ACTIVE') {
        setIsGetAllAgainForumById(true)
      }
      const newData = dataPost.filter((item) => {
        return item.id !== id
      })
      setDataPost(newData)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!isUpdateStatusPostSuccess) {
      setNotifySetting({
        show: true,
        status: 'error',
        message: messageError,
      })
      setIsUpdateStatusPostSuccess(true)
    }
  }, [isUpdateStatusPostSuccess])

  useEffect(() => {
    if (id) {
      setDataPost([])
      setPaginationModel({ page: 0, pageSize: 10 })
    }
  }, [id])

  useEffect(() => {
    getAllPostByForumData()
  }, [paginationModel])

  return (
    <div>
      <div>
        <InfiniteScroll
          dataLength={dataPost.length}
          next={() =>
            setPaginationModel((prevPaginationModel) => ({
              page: prevPaginationModel ? prevPaginationModel.page + 1 : 0,
              pageSize: 10,
            }))
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
                    <b>Đã hiển thị tất cả các bài viết của được yêu cầu của forum</b>
                  </p>
                )}

              {!isLoading &&
                paginationModel !== null &&
                dataPost.length === totalRowCount &&
                dataPost.length === 0 && (
                  <p className="text-center pt-3 pb-6">
                    <b>Forum hiện tại chưa có bài viết nào được yêu cầu</b>
                  </p>
                )}
            </>
          }>
          {dataPost.map((item, index) => (
            <div key={index}>
              <div className="my-4 bg-white flex-flex-col gap-2 min-h-[100px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md ">
                <PostItem
                  item={item}
                  isRequest={true}
                />
                <div className="px-4 pb-4 flex justify-center w-full gap-4 mt-4 ">
                  <Button
                    typeButton="reject"
                    className="px-3 py-1.5"
                    disabled={isLoading}
                    onClick={() => handelAction('DELETED', item.id)}>
                    Reject
                  </Button>
                  <Button
                    onClick={() => handelAction('ACTIVE', item.id)}
                    typeButton="approve"
                    className="px-3 py-1.5"
                    disabled={isLoading}>
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default PostRequest
