import { IComment, IDataChild, IEditChild } from '@interfaces/IPost'
import { Tooltip } from '@mui/material'
import { eventActionSelector, postActionSelector, userStateSelector } from '@store/index'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { FC, useEffect, useState } from 'react'
import { RiSendPlaneFill } from 'react-icons/ri'

interface Props {
  rowSelected: IComment | null
  childSelected?: IEditChild
  setRowSelected?: React.Dispatch<React.SetStateAction<IComment | null>>
  data: IComment[]
  setData: React.Dispatch<React.SetStateAction<IComment[]>>
  setDataChild?: React.Dispatch<React.SetStateAction<IDataChild[]>>
  totalRowCount?: number
  setTotalRowCount?: React.Dispatch<React.SetStateAction<number>>
  idPost?: string
  idEvent?: string
  type: string
}

const WritingTools: FC<Props> = ({
  rowSelected,
  data,
  setRowSelected,
  setData,
  totalRowCount,
  setTotalRowCount,
  idPost,
  idEvent,
  type,
  childSelected,
  setDataChild,
}: Props): JSX.Element => {
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { addCommentPost, editCommentPost, replyCommentPost, editReplyCommentPost } =
    useStoreActions(postActionSelector)
  const { addCommentEvent, editCommentEvent } = useStoreActions(eventActionSelector)
  const [inputText, setInputText] = useState<string>('')

  const handleAddMessage = async (): Promise<void> => {
    if (type === 'comment') {
      if (rowSelected) {
        const res = await editCommentPost({ id: rowSelected.id, content: inputText })
        if (res) {
          const updatedComment = data.map((item: IComment) =>
            item.id === rowSelected.id ? { ...item, content: inputText } : item,
          )
          setInputText('')
          setData(updatedComment)
          setRowSelected && setRowSelected(null)
        }
      } else {
        const res = await addCommentPost({ id: idPost, content: inputText })
        if (res) {
          const newDataRow = {
            id: res?.id,
            content: res?.content,
            postId: res?.postId,
            createdAt: res?.createdAt,
            updateAt: res?.updateAt,
            userId: res?.userId,
            user: res?.user,
            replyCommentPost: [],
          }
          if (totalRowCount !== undefined && setTotalRowCount) {
            let newData
            if (data.length >= 10 && data.length < totalRowCount) {
              newData = [
                newDataRow,
                ...data.slice(0, data.length - 1),
                ...data.slice(data.length),
              ] as IComment[]
            } else {
              newData = [newDataRow, ...data] as IComment[]
            }
            setData(newData)
            setTotalRowCount(totalRowCount + 1)
            setInputText('')
          }
        }
      }
    }

    if (type === 'reply_comment') {
      if (childSelected) {
        const res = await editReplyCommentPost({
          id: rowSelected?.id,
          replyId: childSelected.item.id,
          content: inputText,
        })
        if (res) {
          setInputText('')
          setDataChild &&
            setDataChild((prevData) => {
              const updatedData = prevData.map((item) => {
                if (item.id === rowSelected?.id) {
                  const newData = item.data.map((reply) =>
                    reply.id === childSelected.item.id
                      ? { ...reply, content: inputText }
                      : reply,
                  )
                  return { ...item, data: newData }
                }
                return item
              })
              return updatedData
            })
        }
      } else {
        const res = await replyCommentPost({ id: rowSelected?.id, content: inputText })
        if (res) {
          setInputText('')
          setDataChild &&
            setDataChild((prevData) => {
              const updatedData = prevData.map((item) => {
                if (item.id === res?.commentId) {
                  return { ...item, data: [...item.data, res] }
                }
                return item
              })
              return updatedData
            })
        }
      }
    }

    if (type === 'comment_event') {
      if (rowSelected) {
        const res = await editCommentEvent({
          id: idEvent,
          eventCommentId: rowSelected.id,
          content: inputText,
        })
        if (res) {
          const updatedComment = data.map((item: IComment) =>
            item.id === rowSelected.id ? { ...item, content: inputText } : item,
          )
          setInputText('')
          setData(updatedComment)
          setRowSelected && setRowSelected(null)
        }
      } else {
        const res = await addCommentEvent({ id: idEvent, content: inputText })
        if (res) {
          const newDataRow = {
            id: res?.id,
            content: res?.content,
            postId: res?.postId,
            createdAt: res?.createdAt,
            updateAt: res?.updateAt,
            userId: res?.userId,
            user: res?.user,
            replyCommentPost: [],
          }
          if (totalRowCount !== undefined && setTotalRowCount) {
            let newData
            if (data.length >= 10 && data.length < totalRowCount) {
              newData = [
                newDataRow,
                ...data.slice(0, data.length - 1),
                ...data.slice(data.length),
              ] as IComment[]
            } else {
              newData = [newDataRow, ...data] as IComment[]
            }
            setData(newData)
            setTotalRowCount(totalRowCount + 1)
            setInputText('')
          }
        }
      }
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && inputText.trim() !== '') handleAddMessage()
  }

  const handleChangeValueInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInputText(value)
  }

  useEffect(() => {
    if (rowSelected && (type === 'comment' || type == 'comment_event')) {
      setInputText(rowSelected.content)
    }

    if (childSelected && type === 'reply_comment') {
      setInputText(childSelected.item.content)
    }
  }, [rowSelected, childSelected])

  return (
    <div
      className={`flex gap-2 relative ${
        type === 'comment' || type === 'comment_event' ? 'px-3 py-2' : 'py-1'
      }`}
      style={{
        boxShadow:
          type === 'comment' || type === 'comment_event'
            ? '0px 0px 10px 0px rgba(0, 0, 0, 0.1)'
            : '',
      }}>
      <Tooltip title={currentUserSuccess?.fullName}>
        <div
          className={`overflow-hidden ${
            type === 'comment' || type === 'comment_event' ? 'h-10 w-10' : 'h-7 w-7'
          } `}>
          <img
            className="h-full w-full rounded-full  border border-gray-200"
            src={currentUserSuccess?.avatarUrl}
            alt={currentUserSuccess?.fullName}
          />
        </div>
      </Tooltip>
      <div className="flex-1 m-auto relative">
        <textarea
          value={inputText}
          onChange={(e) => handleChangeValueInput(e)}
          onKeyPress={handleKeyPress}
          className={`w-full bg-gray-200 outline-none rounded-3xl text-sm z-10 ${
            type === 'comment' || type === 'comment_event'
              ? ' px-4 pt-2'
              : 'px-4 h-7 pt-1'
          } `}
          placeholder="Viết bình luận của bạn"
        />
        <RiSendPlaneFill
          onClick={() => handleAddMessage()}
          className={`absolute ${
            type === 'comment' || type === 'comment_event' ? ' h-6 w-6' : 'h-4 w-4'
          } right-4 top-1/2 -translate-y-1/2  text-[#0001CB] cursor-pointer`}
        />
      </div>
    </div>
  )
}

export default WritingTools
