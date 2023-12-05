import Button from '@components/Button'
import Comment from '@components/ModalDetailPost/components/Comment'
import PostContent from '@components/PostContent'
import { Dialog, Transition } from '@headlessui/react'
import { pageMode } from '@interfaces/IClient'
import { IComment, IPostViewForum } from '@interfaces/IPost'
import { notifyActionSelector, postActionSelector, postStateSelector } from '@store/index'
import { dayComparedToThePast } from '@utils/functions/formatDay'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { FC, Fragment, useEffect, useState } from 'react'
import {
  HiOutlineHeart,
  HiMiniHeart,
  HiOutlineChatBubbleLeftEllipsis,
} from 'react-icons/hi2'
import WritingTools from './components/WritingTools'

interface Props {
  item: IPostViewForum | null
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  isFavourite: boolean
  setIsFavourite: () => Promise<void>
  countLike: number
}

const ModalDetailPost: FC<Props> = ({
  open,
  setOpen,
  item,
  isFavourite,
  setIsFavourite,
  countLike,
}: Props): JSX.Element => {
  const { getAllCommentPost } = useStoreActions(postActionSelector)
  const {
    setIsUpdateStatusPostSuccess,
    updateStatusPost,
    deleteCommentPost,
    setCountReplyByCommentId,
  } = useStoreActions(postActionSelector)
  const { isUpdateStatusPostSuccess, messageError, countReplyByCommentId } =
    useStoreState(postStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)

  const [loading, setIsLoading] = useState<boolean>(false)
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false)
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)
  const [data, setData] = useState<IComment[]>([])
  const [rowSelected, setRowSelected] = useState<IComment | null>(null)

  const getAllCommentPage = async (): Promise<void> => {
    if (paginationModel && item) {
      setIsLoading(true)
      const res = await getAllCommentPost({
        id: item.id,
        params: {
          skip: paginationModel.page * 10,
          take: paginationModel.pageSize,
        },
      })
      if (res) {
        setTotalRowCount(res.totalRecords)
        setData([...data, ...res.data])

        const countsReply = res.data.map((item: IComment) => {
          return { id: item.id, _count: item._count?.replyComments }
        })
        setCountReplyByCommentId([...countReplyByCommentId, ...countsReply])
      }
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAllCommentPage()
  }, [paginationModel])

  useEffect(() => {
    if (item) {
      setData([])
      setPaginationModel({ page: 0, pageSize: 10 })
    }
  }, [item])

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
    return () => {
      setCountReplyByCommentId([])
    }
  }, [])

  const handelAction = async (status: string, id: string): Promise<void> => {
    setIsLoadingAction(true)
    const res = await updateStatusPost({ id: id, status: status })
    if (res) {
      setNotifySetting({
        show: true,
        status: 'success',
        message: `${status === 'ACTIVE' ? 'Approve' : 'Reject'} post successfully`,
      })
    }
    setOpen(false)
    setIsLoadingAction(false)
  }

  const handleDeleteComment = async (id: string): Promise<void> => {
    const res = await deleteCommentPost(id)
    if (res) {
      const updatedComment = data.filter((item) => item.id !== id)
      setData(updatedComment)
      setTotalRowCount(totalRowCount - 1)
    }
  }

  const handleEditMessage = (item: IComment): void => {
    setRowSelected(item)
  }
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
                    {item?.status === 'ACTIVE'
                      ? ' Nội dung bài viết'
                      : `Bài viết của forum:  ${item?.forum.name} `}
                  </Dialog.Title>
                  <div
                    id="scrollableDiv"
                    className="mt-2 max-h-[500px] overflow-y-auto">
                    <div className="flex items-center justify-between px-3">
                      <div className="flex items-center cursor-pointer">
                        <div className="relative flex-shrink-0  mr-2">
                          <img
                            className="h-10 w-10 object-cover rounded-full border border-gray-500 bg-gray-500 "
                            src={item?.user.avatarUrl}
                            alt="logo"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-medium">
                            {item?.user.fullName}
                          </span>
                          <span className="text-xs">
                            {dayComparedToThePast(item?.createdAt || '')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <PostContent
                        content={item?.content}
                        images={item?.documents}
                      />
                    </div>
                    {item?.status === 'ACTIVE' && (
                      <>
                        <div className="mx-3 py-1 flex justify-around border-y border-gray-300 mt-3">
                          <div
                            onClick={() => setIsFavourite()}
                            className={`${
                              isFavourite ? 'text-red-600' : 'text-[#0001CB]'
                            } cursor-pointer mr-12 transition-all duration-300 px-6 py-1.5 hover:bg-gray-200 rounded-md`}>
                            {isFavourite && (
                              <HiMiniHeart className="h-6 w-6 inline mr-2" />
                            )}
                            {!isFavourite && (
                              <HiOutlineHeart className="h-6 w-6 inline mr-2" />
                            )}
                            <span className="text-sm mr-1">
                              {countLike !== 0 && countLike}
                            </span>
                            <span>Yêu thích</span>
                          </div>
                          <div className="text-[#0001CB] cursor-pointer px-6 py-1.5 hover:bg-gray-200 rounded-md">
                            <HiOutlineChatBubbleLeftEllipsis className="h-6 w-6 inline mr-2" />
                            <span>Bình luận</span>
                          </div>
                        </div>
                        <div className="pb-4">
                          <Comment
                            data={data}
                            setData={setData}
                            loading={loading}
                            paginationModel={paginationModel}
                            setPaginationModel={setPaginationModel}
                            totalRowCount={totalRowCount}
                            onEditMessage={handleEditMessage}
                            onDeleteMessage={handleDeleteComment}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {item?.status === 'ACTIVE' && (
                    <>
                      <WritingTools
                        data={data}
                        setData={setData}
                        totalRowCount={totalRowCount}
                        setTotalRowCount={setTotalRowCount}
                        rowSelected={rowSelected}
                        setRowSelected={setRowSelected}
                        idPost={item.id}
                        type="comment"
                      />
                    </>
                  )}
                  {item?.status === 'PENDING' && (
                    <div className="px-4 pb-4 flex justify-center w-full gap-4 mt-4 ">
                      <Button
                        typeButton="reject"
                        className="px-3 py-1.5"
                        disabled={isLoadingAction}
                        onClick={() => handelAction('DELETED', item.id)}>
                        Reject
                      </Button>
                      <Button
                        onClick={() => handelAction('ACTIVE', item.id)}
                        typeButton="approve"
                        className="px-3 py-1.5"
                        disabled={isLoadingAction}>
                        Approve
                      </Button>
                    </div>
                  )}
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
