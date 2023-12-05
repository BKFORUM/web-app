import { IComment, IDataChild } from '@interfaces/IPost'
import { Tooltip } from '@mui/material'
import { dayComparedToThePast } from '@utils/functions/formatDay'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiPencilAlt, HiOutlineTrash } from 'react-icons/hi'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { postActionSelector, postStateSelector, userStateSelector } from '@store/index'

interface Props {
  idParent: string
  data: IComment[]
  setDataChild: React.Dispatch<React.SetStateAction<IDataChild[]>>
  onEditMessage: (item: IComment, idParent: string) => void
}

const FirstChildComment: FC<Props> = ({
  data,
  onEditMessage,
  idParent,
  setDataChild,
}: Props): JSX.Element => {
  const navigate = useNavigate()
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { deleteReplyCommentPost, setCountReplyByCommentId } =
    useStoreActions(postActionSelector)
  const { countReplyByCommentId } = useStoreState(postStateSelector)

  const handleDeleteComment = async (id: string, idParent: string) => {
    const res = await deleteReplyCommentPost({ id: idParent, replyId: id })
    if (res) {
      const newDataChild = data.filter((item) => {
        return item.id !== id
      })
      setDataChild((prevData) => {
        const updatedData = prevData.map((item) => {
          if (item.id === idParent) {
            return { ...item, data: newDataChild }
          }
          return item
        })
        return updatedData
      })

      const newCountReply = countReplyByCommentId.map((data) =>
        data.id === idParent ? { ...data, _count: data._count - 1 } : data,
      )

      setCountReplyByCommentId(newCountReply)
    }
  }

  return (
    <div className="flex flex-col gap-1.5 pb-2">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex gap-2">
          <div className="flex-shrink mb-auto pt-2">
            <Tooltip title={item.user.fullName}>
              <div
                className="h-7 w-7 overflow-hidden cursor-pointer"
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
                      onClick={() => onEditMessage(item, idParent)}
                      className="text-gray-600 cursor-pointer"
                    />
                    <HiOutlineTrash
                      onClick={() => handleDeleteComment(item.id, idParent)}
                      className="text-red-500 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FirstChildComment
