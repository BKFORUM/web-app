import { formatDateFormDateLocal } from '@utils/functions/formatDay'
import { FC } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlinePhone,
} from 'react-icons/hi'
import { AiOutlineMan, AiOutlineWoman } from 'react-icons/ai'
import { MdOutlinePermContactCalendar } from 'react-icons/md'
import { GrUserSettings } from 'react-icons/gr'
import { ICurrentUser } from '@interfaces/IUser'
import { IPostViewForum } from '@interfaces/IPost'
import PostItem from '@components/PostItem'
import { pageMode } from '@interfaces/IClient'

interface Props {
  user?: ICurrentUser
  dataPost: IPostViewForum[]
  setPaginationModel: React.Dispatch<React.SetStateAction<pageMode | null>>
  paginationModel: pageMode | null
  totalRowCount: number
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalDelete: React.Dispatch<React.SetStateAction<boolean>>
}

const PostProfile: FC<Props> = ({
  user,
  dataPost,
  setPaginationModel,
  paginationModel,
  totalRowCount,
  setOpenModal,
  setOpenModalDelete,
}: Props): JSX.Element => {
  return (
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
            <span className="text-base font-semibold ml-4">{user?.faculty.name}</span>
          </div>
          <div className="flex items-center">
            <HiOutlinePhone className="w-6 h-6 " />
            <span className="text-base font-semibold ml-4">{user?.phoneNumber}</span>
          </div>
        </div>
      </div>

      <div className="col-span-4 ">
        <InfiniteScroll
          dataLength={dataPost.length}
          next={() =>
            setPaginationModel((prevPaginationModel) => ({
              page: prevPaginationModel ? prevPaginationModel.page + 1 : 0,
              pageSize: 10,
            }))
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
                setOpenModal={setOpenModal}
                setOpenModalDelete={setOpenModalDelete}
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default PostProfile
