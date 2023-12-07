import PostItem from '@components/PostItem'
import { pageMode } from '@interfaces/IClient'
import { IPostViewForum } from '@interfaces/IPost'
import { postActionSelector, userStateSelector } from '@store/index'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { FC } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

interface Props {
  moderatorId?: string
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalDelete: React.Dispatch<React.SetStateAction<boolean>>
  data: IPostViewForum[]
  totalRowCount: number
  setPaginationModel: React.Dispatch<React.SetStateAction<pageMode | null>>
  paginationModel: pageMode | null
  yourStatus?: string
}

const PostForum: FC<Props> = ({ ...props }: Props): JSX.Element => {
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { setPostSelected } = useStoreActions(postActionSelector)
  return (
    <div>
      {props?.yourStatus === 'ACTIVE' && (
        <div className="mt-4 relative flex-1 flex gap-2 items-center px-6 py-6 bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md z-10">
          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden mr-2 border border-gray-400 bg-gray-400">
            <img
              className="w-full h-full "
              src={currentUserSuccess?.avatarUrl}
              alt={currentUserSuccess?.fullName}
            />
          </div>
          <input
            onClick={() => {
              props.setOpenModal(true)
              setPostSelected(null)
            }}
            className="bg-gray-200 cursor-pointer px-4 py-2.5 rounded-3xl w-[200px] text-left flex-auto mr-2 hover:bg-gray-300 transition-all duration-300 z-10"
            type="button"
            value="Viết bài tại đây...."
          />
        </div>
      )}

      <div>
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={props.data.length}
          next={() =>
            props.setPaginationModel((prevPaginationModel) => ({
              page: prevPaginationModel ? prevPaginationModel.page + 1 : 0,
              pageSize: 10,
            }))
          }
          hasMore={props.data.length !== props.totalRowCount}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }>
          {props.data.map((item, index) => (
            <div
              key={index}
              className="my-4 bg-white min-h-[100px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md ">
              <PostItem
                item={item}
                moderatorId={props.moderatorId}
                setOpenModal={props.setOpenModal}
                setOpenModalDelete={props.setOpenModalDelete}
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default PostForum
