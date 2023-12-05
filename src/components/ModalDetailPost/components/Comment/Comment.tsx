import { pageMode } from '@interfaces/IClient'
import { IChildLoading, IComment, IDataChild, IEditChild } from '@interfaces/IPost'
import { Tooltip } from '@mui/material'
import { dayComparedToThePast } from '@utils/functions/formatDay'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiPencilAlt, HiOutlineTrash } from 'react-icons/hi'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { postActionSelector, postStateSelector, userStateSelector } from '@store/index'
import WritingTools from '../WritingTools'
import FirstChildComment from '../FirstChildComment'
import { FaArrowTurnUp } from 'react-icons/fa6'

interface Props {
  data: IComment[]
  loading: boolean
  setData: React.Dispatch<React.SetStateAction<IComment[]>>
  setPaginationModel: React.Dispatch<React.SetStateAction<pageMode | null>>
  totalRowCount: number
  paginationModel: pageMode | null
  onEditMessage: (item: IComment) => void
  onDeleteMessage: (id: string) => Promise<void>
}

const Comment: FC<Props> = ({
  data,
  setPaginationModel,
  totalRowCount,
  loading,
  onEditMessage,
  onDeleteMessage,
  setData, // idPost,
}: Props): JSX.Element => {
  const navigate = useNavigate()
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { getAllReplyByCommentId } = useStoreActions(postActionSelector)
  const { countReplyByCommentId } = useStoreState(postStateSelector)

  const [reply, setReply] = useState<number[] | null>(null)
  const [showAllChild, setShowAllChild] = useState<number[] | null>(null)

  const [listItemEdit, setListItemEdit] = useState<IEditChild[]>([])
  const [dataChild, setDataChild] = useState<IDataChild[]>([])
  const [isLoading, setIsLoading] = useState<IChildLoading | null>(null)

  const getAllCommentPage = async (id: string): Promise<void> => {
    if ((countReplyByCommentId.find((reply) => reply.id === id)?._count || 0) > 0) {
      setIsLoading({ id: id, isLoading: true })
      const res = await getAllReplyByCommentId({
        id: id,
        params: {
          take: 1000000,
        },
      })
      if (res) {
        const newData = { id: id, data: res }
        setDataChild([...dataChild, newData])
      }
      setIsLoading({ id: id, isLoading: false })
    } else {
      setDataChild([...dataChild, { id: id, data: [] }])
    }
  }

  const handleEditComment = (item: IComment, idParent: string) => {
    const existingIndex = listItemEdit.findIndex((entry) => entry.id === idParent)

    if (existingIndex !== -1) {
      const updatedList = [...listItemEdit]
      updatedList.splice(existingIndex, 1)
      setListItemEdit([...updatedList, { id: idParent, item: item }])
    } else {
      setListItemEdit([...listItemEdit, { id: idParent, item: item }])
    }
  }
  return (
    <div>
      <div className="flex flex-col gap-1.5 px-3 py-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex gap-2">
            <div className="flex-shrink mb-auto pt-2">
              <Tooltip title={item.user.fullName}>
                <div
                  className="h-8 w-8 overflow-hidden cursor-pointer"
                  onClick={() => navigate('/profile/' + item.user.id)}>
                  <img
                    className="h-full w-full border border-gray-200 rounded-full"
                    src={item.user.avatarUrl}
                    alt={item.user.fullName}
                  />
                </div>
              </Tooltip>
            </div>
            <div className="flex flex-col gap-0 group flex-1">
              <div className="flex items-center">
                <span className="text-[13px] font-medium">{item.user.fullName}</span>
                <span className="text-xs ml-2.5 ">
                  {dayComparedToThePast(item.createdAt)}
                </span>
              </div>
              <div className="flex-1 ">
                <div className="flex gap-4 items-center w-full">
                  <span className="max-w-[450px] text-sm px-2 py-0.5 bg-gray-200 rounded-lg break-words">
                    {item.content}
                  </span>
                  {item.userId === currentUserSuccess?.id && (
                    <div className="flex gap-1.5 w-[20%]">
                      <HiPencilAlt
                        onClick={() => onEditMessage(item)}
                        className="text-gray-600 cursor-pointer"
                      />
                      <HiOutlineTrash
                        onClick={() => onDeleteMessage(item.id)}
                        className="text-red-500 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
              <span
                onClick={() => {
                  setReply([...(reply || []), index])
                  setShowAllChild([...(showAllChild || []), index])
                  getAllCommentPage(item.id)
                }}
                className="text-xs font-semibold cursor-pointer">
                Phản hồi
              </span>
              {!showAllChild?.some((number) => number === index) &&
                (countReplyByCommentId.find((data) => data.id === item.id)?._count || 0) >
                  0 && (
                  <span
                    onClick={() => {
                      setReply([...(reply || []), index])
                      setShowAllChild([...(showAllChild || []), index])
                      getAllCommentPage(item.id)
                    }}
                    className="text-sm text-gray-600 font-semibold cursor-pointer">
                    <FaArrowTurnUp className="rotate-90 inline mr-0.5" /> Xem tất cả{' '}
                    {countReplyByCommentId.find((data) => data.id === item.id)?._count ||
                      ''}{' '}
                    phản hồi
                  </span>
                )}

              {showAllChild?.some((number) => number === index) && (
                <div className="">
                  {isLoading?.id === item?.id && isLoading?.isLoading ? (
                    <>
                      <div className="animate-pulse flex items-center rounded-xl py-1.5">
                        <div className="flex gap-2 items-center ">
                          <div className="h-7 w-7 rounded-full bg-slate-200 ml-3 "></div>
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-2">
                              <div className="h-2.5 w-[100px] bg-slate-200 rounded  "></div>
                              <div className="h-2.5 w-[50px] bg-slate-200 rounded  "></div>
                            </div>
                            <div className="h-4 w-[200px] bg-slate-200 rounded-md  "></div>
                          </div>
                        </div>
                      </div>

                      <div className="animate-pulse flex items-center rounded-xl py-1.5">
                        <div className="flex gap-2 items-center ">
                          <div className="h-7 w-7 rounded-full bg-slate-200 ml-3 "></div>
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-2">
                              <div className="h-2.5 w-[100px] bg-slate-200 rounded  "></div>
                              <div className="h-2.5 w-[50px] bg-slate-200 rounded  "></div>
                            </div>
                            <div className="h-4 w-[200px] bg-slate-200 rounded-md  "></div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <FirstChildComment
                      idParent={item.id}
                      setDataChild={setDataChild}
                      data={dataChild.find((child) => child.id === item.id)?.data || []}
                      onEditMessage={handleEditComment}
                    />
                  )}
                </div>
              )}

              {reply?.some((number) => number === index) && (
                <WritingTools
                  data={data}
                  setData={setData}
                  setDataChild={setDataChild}
                  rowSelected={item}
                  childSelected={listItemEdit.find((child) => child.id === item.id)}
                  type="reply_comment"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {data.length === 0 && !loading && (
        <p className="text-center font-medium">Hãy là người đầu tiên để lại bình luận</p>
      )}
      {data.length > 0 && data.length === totalRowCount && !loading && (
        <p className="text-center font-medium">Đã hiện thị tất cả các bình luận</p>
      )}
      {loading && (
        <>
          <div className="animate-pulse flex items-center rounded-xl py-1.5">
            <div className="flex gap-2 items-center ">
              <div className="h-10 w-10 rounded-full bg-slate-200 ml-3 "></div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <div className="h-2.5 w-[100px] bg-slate-200 rounded  "></div>
                  <div className="h-2.5 w-[50px] bg-slate-200 rounded  "></div>
                </div>
                <div className="h-4 w-[200px] bg-slate-200 rounded-md  "></div>
              </div>
            </div>
          </div>

          <div className="animate-pulse flex items-center rounded-xl py-1.5">
            <div className="flex gap-2 items-center ">
              <div className="h-10 w-10 rounded-full bg-slate-200 ml-3 "></div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <div className="h-2.5 w-[100px] bg-slate-200 rounded  "></div>
                  <div className="h-2.5 w-[50px] bg-slate-200 rounded  "></div>
                </div>
                <div className="h-4 w-[200px] bg-slate-200 rounded-md  "></div>
              </div>
            </div>
          </div>

          <div className="animate-pulse flex items-center rounded-xl py-1.5">
            <div className="flex gap-2 items-center ">
              <div className="h-10 w-10 rounded-full bg-slate-200 ml-3 "></div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <div className="h-2.5 w-[100px] bg-slate-200 rounded  "></div>
                  <div className="h-2.5 w-[50px] bg-slate-200 rounded  "></div>
                </div>
                <div className="h-4 w-[200px] bg-slate-200 rounded-md  "></div>
              </div>
            </div>
          </div>
        </>
      )}
      {data.length !== 0 && data.length < totalRowCount && !loading && (
        <span
          onClick={() =>
            setPaginationModel((prevPaginationModel) => ({
              page: prevPaginationModel ? prevPaginationModel.page + 1 : 0,
              pageSize: 10,
            }))
          }
          className="text-gray-500 text-base font-medium  cursor-pointer pb-2 px-4">
          Xem thêm bình luận
        </span>
      )}
    </div>
  )
}

export default Comment
