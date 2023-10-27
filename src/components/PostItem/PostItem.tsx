import { FC, useState } from 'react'
import PostContent from '@components/PostContent'
import test from '../../assets/images/test.jpg'
import avatar from '../../assets/images/avatartest.jpg'
import {
  HiOutlineHeart,
  HiMiniHeart,
  HiOutlineChatBubbleLeftEllipsis,
} from 'react-icons/hi2'
import { useLocation } from 'react-router-dom'

interface Props {}

const PostItem: FC<Props> = (): JSX.Element => {
  const { pathname } = useLocation()
  const [isFavourite, setIsFavourite] = useState<boolean>(false)

  return (
    <div>
      {pathname.split('/')[1] === 'forums' ? (
        <div className="flex items-center  p-3 cursor-pointer">
          <div className="relative flex-shrink-0  mr-2 ">
            <img
              className="h-10 w-10 object-cover rounded-full border border-gray-500 bg-gray-500 "
              src={avatar}
              alt="logo"
            />
          </div>
          <span className="text-base font-medium">Trương Quang Khang</span>
        </div>
      ) : (
        <div className="flex  p-3 cursor-pointer">
          <div className="relative flex-shrink-0  mr-4 ">
            <div className="h-10 w-10 rounded-xl overflow-hidden border border-gray-700 bg-gray-700 ">
              <img
                className="h-full w-full object-cover"
                src={test}
                alt="logo"
              />
            </div>
            <img
              className="absolute right-[-20%] bottom-[-10%] h-[30px] w-[30px] object-cover rounded-full border border-gray-500 bg-gray-500 "
              src={avatar}
              alt="logo"
            />
          </div>
          <div className="block">
            <h6 className="text-base font-medium leading-[18px] ">Vì yêu mà đến</h6>
            <span className="text-sm font-medium leading-[0px]  text-gray-700">
              Trương Quang Khang
            </span>
          </div>
        </div>
      )}

      <div className="">
        <PostContent />
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
