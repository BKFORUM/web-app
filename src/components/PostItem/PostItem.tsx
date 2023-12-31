import { FC, useState } from 'react'
import PostContent from '@components/PostContent'
import {
  HiOutlineHeart,
  HiMiniHeart,
  HiOutlineChatBubbleLeftEllipsis,
} from 'react-icons/hi2'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { IPostViewForum, IUserLikePost } from '@interfaces/IPost'
import { formatDateLocalV2 } from '@utils/functions/formatDay'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { postActionSelector, userStateSelector } from '@store/index'
import OptionPost from '@components/OptionPost'
import ModalDetailPost from '@components/ModalDetailPost'
import default_forum from '../../assets/images/default_forum.png'

interface Props {
  moderatorId?: string
  item: IPostViewForum
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalDelete?: React.Dispatch<React.SetStateAction<boolean>>
  isRequest?: boolean
}

const PostItem: FC<Props> = ({
  item,
  moderatorId,
  setOpenModal,
  setOpenModalDelete,
  isRequest,
}: Props): JSX.Element => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { likePost, unLikePost } = useStoreActions(postActionSelector)

  const [isFavourite, setIsFavourite] = useState<boolean>(!item.likedAt ? false : true)
  const [listUserLike, setListUserLike] = useState<IUserLikePost[]>(item.likes)
  const [countLike, setCountLike] = useState<number>(item._count.likes)
  const [openModalPostDetail, setOpenModalPostDetail] = useState<boolean>(false)

  const handleFavouritePost = async (): Promise<void> => {
    if (isFavourite) {
      const res = await unLikePost(item.id)
      if (res) {
        setCountLike((prev) => prev - 1)
        setIsFavourite(false)
        const newData = listUserLike.filter(
          (user) => user.userId !== currentUserSuccess?.id,
        )
        setListUserLike(newData)
      }
    } else {
      const res = await likePost(item.id)
      if (res) {
        setCountLike((prev) => prev + 1)
        setIsFavourite(true)
        const { post, ...data } = res
        setListUserLike([data, ...listUserLike])
      }
    }
  }

  var checkProfile = false
  if (pathname.split('/')[1] === 'profile') {
    const { id } = useParams()
    if (id === currentUserSuccess?.id) checkProfile = true
  }
  if (pathname.split('/')[1] === '') {
    checkProfile = true
  }
  return (
    <>
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
              <span className="text-sm font-thin">
                {formatDateLocalV2(item.createdAt)}
              </span>
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
                <div
                  onClick={() => navigate(`/forums/${item.forum.id}`)}
                  className="h-10 w-10 rounded-xl overflow-hidden border border-gray-700 bg-gray-700 ">
                  <img
                    className="h-full w-full object-cover"
                    src={item.forum.avatarUrl || default_forum}
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
                <h6
                  onClick={() => navigate(`/forums/${item.forum.id}`)}
                  className="text-base font-medium leading-[18px] ">
                  {item.forum.name}
                </h6>
                <span className="text-sm font-medium leading-[0px]  text-gray-700">
                  <span onClick={() => navigate('/profile/' + item.user.id)}>
                    {item.user.fullName}
                  </span>
                  {(moderatorId === item.user.id ||
                    item.user.id === item.forum.modId) && (
                    <span className="px-2 py-0.5 text-xs ml-3 bg-sky-200 rounded-xl">
                      Quản trị viên
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-thin">
                {formatDateLocalV2(item.updatedAt)}
              </span>
              {(moderatorId === currentUserSuccess?.id ||
                item.user.id === currentUserSuccess?.id) &&
                checkProfile && (
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
        {!isRequest && (
          <div className="relative mx-3 py-1 flex justify-around border-t border-gray-300 mt-3">
            <div className="group">
              <div
                onClick={() => handleFavouritePost()}
                className={`${
                  isFavourite ? 'text-red-600' : 'text-[#0001CB]'
                } cursor-pointer mr-12 transition-all duration-300 px-6 py-1.5 hover:bg-gray-200 rounded-md`}>
                {isFavourite && <HiMiniHeart className="h-6 w-6 inline mr-2" />}
                {!isFavourite && <HiOutlineHeart className="h-6 w-6 inline mr-3" />}

                {countLike > 0 && (
                  <span className="text-[#0001CB] mr-1.5 text-sm font-semibold">
                    {countLike}
                  </span>
                )}

                {!isFavourite && <span>Yêu thích</span>}
              </div>
              {listUserLike.length > 0 && (
                <div
                  className="absolute z-[100] overflow-auto bg-black/70 top-full max-h-[200px]  
                flex flex-col flex-grow-0 left-0 px-2 py-1 w-auto rounded-md text-slate-100
                opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 pointer-events-none">
                  {listUserLike.map((user, index) => (
                    <p
                      key={index}
                      className="w-full text-sm">
                      {user.user.fullName}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div
              onClick={() => setOpenModalPostDetail(true)}
              className="text-[#0001CB] cursor-pointer px-6 py-1.5 hover:bg-gray-200 rounded-md">
              <HiOutlineChatBubbleLeftEllipsis className="h-6 w-6 inline mr-3" />
              {item._count.comments > 0 && (
                <span className="text-[#0001CB] mr-1.5 text-sm font-semibold ">
                  {item._count.comments}
                </span>
              )}
              <span>Bình luận</span>
            </div>
          </div>
        )}
      </div>
      {openModalPostDetail && (
        <ModalDetailPost
          item={item}
          open={openModalPostDetail}
          setOpen={setOpenModalPostDetail}
          isFavourite={isFavourite}
          setIsFavourite={handleFavouritePost}
          countLike={countLike}
        />
      )}
    </>
  )
}

export default PostItem
