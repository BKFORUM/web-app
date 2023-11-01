import { FC, useState } from 'react'
import PostContent from '@components/PostContent'
import test from '../../assets/images/test.jpg'
import {
  HiOutlineHeart,
  HiMiniHeart,
  HiOutlineChatBubbleLeftEllipsis,
} from 'react-icons/hi2'
import { useLocation, useNavigate } from 'react-router-dom'
import { IPostViewForum } from '@interfaces/IPost'
import { formatDateLocalV2 } from '@utils/functions/formatDay'
import { useStoreState } from 'easy-peasy'
import { userStateSelector } from '@store/index'
import OptionPost from '@components/OptionPost'

interface Props {
  moderatorId?: string
  item: IPostViewForum
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalDelete: React.Dispatch<React.SetStateAction<boolean>>
}

const PostItem: FC<Props> = ({
  item,
  moderatorId,
  setOpenModal,
  setOpenModalDelete,
}: Props): JSX.Element => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { currentUserSuccess } = useStoreState(userStateSelector)

  const [isFavourite, setIsFavourite] = useState<boolean>(false)

  return (
    <div>
      {pathname.split('/')[1] === 'forums' ? (
        <div className="flex items-center justify-between  p-3 ">
          <div className="flex items-center cursor-pointer">
            <div
              onClick={() => navigate('/profile/' + item.user.id)}
              className="relative flex-shrink-0  mr-2 ">
              <img
                className="h-10 w-10 object-cover rounded-full border border-gray-500 bg-gray-500 "
                src={item.user.avatarUrl}
                alt="logo"
              />
            </div>
            <span className="text-base font-medium">
              {item.user.fullName}
              {moderatorId === item.user.id && (
                <span className="px-2 py-0.5 text-xs ml-3 bg-sky-200 rounded-xl">
                  Quản trị viên
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center">
            <span className="text-sm font-thin">{formatDateLocalV2(item.createdAt)}</span>
            {(moderatorId === currentUserSuccess?.id ||
              item.user.id === currentUserSuccess?.id) && (
              <OptionPost
                item={item}
                setOpenModal={setOpenModal}
                setOpenModalDelete={setOpenModalDelete}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex p-3 cursor-pointer justify-between">
          <div className="flex items-center">
            <div className="relative flex-shrink-0  mr-4 ">
              <div className="h-10 w-10 rounded-xl overflow-hidden border border-gray-700 bg-gray-700 ">
                <img
                  className="h-full w-full object-cover"
                  src={test}
                  alt="logo"
                />
              </div>
              <img
                onClick={() => navigate('/profile/' + item.user.id)}
                className="absolute right-[-20%] bottom-[-10%] h-[30px] w-[30px] object-cover rounded-full border border-gray-500 bg-gray-500 "
                src={item.user.avatarUrl}
                alt={item.user.fullName}
              />
            </div>
            <div className="block">
              <h6 className="text-base font-medium leading-[18px] ">{item.forum.name}</h6>
              <span className="text-sm font-medium leading-[0px]  text-gray-700">
                {item.user.fullName}
                {moderatorId === item.user.id && (
                  <span className="px-2 py-0.5 text-xs ml-3 bg-sky-200 rounded-xl">
                    Quản trị viên
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-thin">{formatDateLocalV2(item.createdAt)}</span>
            {(moderatorId === currentUserSuccess?.id ||
              item.user.id === currentUserSuccess?.id) && (
              <OptionPost
                item={item}
                setOpenModal={setOpenModal}
                setOpenModalDelete={setOpenModalDelete}
              />
            )}
          </div>
        </div>
      )}

      <div className="">
        <PostContent
          content={item.content}
          images={item.documents}
        />
      </div>

      <div className="mx-3 py-1 flex justify-around border-t border-gray-300 ">
        <div
          onClick={() => setIsFavourite(!isFavourite)}
          className={`${
            isFavourite ? 'text-red-600' : 'text-[#0001CB]'
          } cursor-pointer mr-12 transition-all duration-300 px-6 py-1.5 hover:bg-gray-200 rounded-md`}>
          {isFavourite && <HiMiniHeart className="h-6 w-6 inline mr-2" />}
          {!isFavourite && <HiOutlineHeart className="h-6 w-6 inline mr-2" />}
          <span>Yêu thích</span>
        </div>
        <div className="text-[#0001CB] cursor-pointer px-6 py-1.5 hover:bg-gray-200 rounded-md">
          <HiOutlineChatBubbleLeftEllipsis className="h-6 w-6 inline mr-2" />
          <span>Bình luận</span>
        </div>
      </div>
    </div>
  )
}

export default PostItem
