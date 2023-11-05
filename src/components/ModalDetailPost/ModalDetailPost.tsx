import PostContent from '@components/PostContent'
import { Dialog, Transition } from '@headlessui/react'
import { IPostViewForum } from '@interfaces/IPost'
import { Tooltip } from '@mui/material'
import { userStateSelector } from '@store/index'
import { dayComparedToThePast } from '@utils/functions/formatDay'
import { useStoreState } from 'easy-peasy'
import { FC, Fragment } from 'react'
import {
  HiOutlineHeart,
  HiMiniHeart,
  HiOutlineChatBubbleLeftEllipsis,
} from 'react-icons/hi2'
import { RiSendPlaneFill } from 'react-icons/ri'

interface Props {
  item: IPostViewForum
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  isFavourite: boolean
  setIsFavourite: () => Promise<void>
}

const ModalDetailPost: FC<Props> = ({
  open,
  setOpen,
  item,
  isFavourite,
  setIsFavourite,
}: Props): JSX.Element => {
  const { currentUserSuccess } = useStoreState(userStateSelector)
  return (
    <div>
      <Transition
        appear
        show={open}
        as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="relative w-full max-w-[600px] min-h-[200px] flex flex-col transform  rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center shadow py-3 ">
                    Nội dung bài viết
                  </Dialog.Title>
                  <div className="mt-2 max-h-[500px] overflow-y-auto">
                    <div className="flex items-center justify-between px-3">
                      <div className="flex items-center cursor-pointer">
                        <div className="relative flex-shrink-0  mr-2 ">
                          <img
                            className="h-10 w-10 object-cover rounded-full border border-gray-500 bg-gray-500 "
                            src={item.user.avatarUrl}
                            alt="logo"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-medium">
                            {item.user.fullName}
                          </span>
                          <span className="text-xs">
                            {dayComparedToThePast(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <PostContent
                        content={item.content}
                        images={item.documents}
                      />
                    </div>
                    <div className="mx-3 py-1 flex justify-around border-y border-gray-300 mt-3  ">
                      <div
                        onClick={() => setIsFavourite()}
                        className={`${
                          isFavourite ? 'text-red-600' : 'text-[#0001CB]'
                        } cursor-pointer mr-12 transition-all duration-300 px-6 py-1.5 hover:bg-gray-200 rounded-md`}>
                        {isFavourite && <HiMiniHeart className="h-6 w-6 inline mr-2" />}
                        {!isFavourite && (
                          <HiOutlineHeart className="h-6 w-6 inline mr-2" />
                        )}
                        <span>Yêu thích</span>
                      </div>
                      <div className="text-[#0001CB] cursor-pointer px-6 py-1.5 hover:bg-gray-200 rounded-md">
                        <HiOutlineChatBubbleLeftEllipsis className="h-6 w-6 inline mr-2" />
                        <span>Bình luận</span>
                      </div>
                    </div>
                    <div className="min-h-[200px]"></div>
                  </div>
                  <div
                    className="px-3 py-2 flex gap-2"
                    style={{ boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)' }}>
                    <Tooltip title={currentUserSuccess?.fullName}>
                      <div className="h-10 w-10 overflow-hidden">
                        <img
                          className="h-full w-full rounded-full  border border-gray-200"
                          src={currentUserSuccess?.avatarUrl}
                          alt={currentUserSuccess?.fullName}
                        />
                      </div>
                    </Tooltip>
                    <div className="flex-1 m-auto relative">
                      <input
                        type="text"
                        className="w-full bg-gray-200 outline-none px-4 py-2 rounded-3xl text-sm"
                        placeholder="Viết bình luận của bạn"
                      />
                      <RiSendPlaneFill className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-[#0001CB] cursor-pointer" />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default ModalDetailPost
