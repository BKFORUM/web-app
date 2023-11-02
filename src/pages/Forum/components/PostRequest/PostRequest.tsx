import Button from '@components/Button'
import PostItem from '@components/PostItem'
import { IPostViewForum } from '@interfaces/IPost'
import { postActionSelector } from '@store/index'
import { useStoreActions } from 'easy-peasy'
import { FC, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router-dom'

interface Props {}

const PostRequest: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const { getAllPostByForum } = useStoreActions(postActionSelector)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dataPost, setDataPost] = useState<IPostViewForum[]>([])
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
          status: 'PENDING',
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
      setDataPost([])
      setPaginationModel((prev) => ({ ...prev, page: 0 }))
    }
  }, [id])

  const memoizedGetAllPostByForumData = useMemo(
    () => getAllPostByForumData,
    [paginationModel],
  )

  useEffect(() => {
    memoizedGetAllPostByForumData()
  }, [])

  return (
    <div>
      <div>
        <InfiniteScroll
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
              className="my-4 bg-white flex-flex-col gap-2 min-h-[100px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md ">
              <PostItem
                item={item}
                isRequest={true}
              />
              <div className="px-4 pb-4 flex justify-end w-full gap-4 ">
                <Button
                  typeButton="reject"
                  // onClick={() => setOpen(false)}
                >
                  Reject
                </Button>
                <Button
                  // onClick={handleExternalButtonClick}
                  typeButton="approve"
                  disabled={isLoading}
                  loading={isLoading}>
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default PostRequest
