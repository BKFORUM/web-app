import PostContent from '@components/PostContent'
import { IEvent } from '@interfaces/IEvent'
import { formatDateLocalV2 } from '@utils/functions/formatDay'
import { HiOutlineStar, HiStar } from 'react-icons/hi'
import { HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2'
import { FC, useEffect, useState } from 'react'
import ModalDetailEvent from '@components/ModalDetailEvent'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  eventActionSelector,
  eventStateSelector,
  notifyActionSelector,
  userStateSelector,
} from '@store/index'
import OptionEventItem from './components'

interface Props {
  item: IEvent
  modId?: string
  loading?: boolean
  setIsOpenModalAddEdit?: React.Dispatch<React.SetStateAction<boolean>>
  setOpenModalDeleteEvent?: React.Dispatch<React.SetStateAction<boolean>>
  setItemSelected?: React.Dispatch<React.SetStateAction<IEvent | undefined>>
}

const EventItem: FC<Props> = ({
  item,
  modId,
  setItemSelected,
  setIsOpenModalAddEdit,
  setOpenModalDeleteEvent,
}: Props): JSX.Element => {
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const {
    subscribeToEvent,
    unSubscribeToEvent,
    setIsSubscribedToEventSuccess,
    setIsUnSubscribedToEventSuccess,
    // getAllUserSub,
  } = useStoreActions(eventActionSelector)
  const { messageError, isSubscribedToEventSuccess, isUnSubscribedToEventSuccess } =
    useStoreState(eventStateSelector)
  const [openModalDetailEvent, setOpenModalDetailEvent] = useState<boolean>(false)

  const [isUnsubscribed, setIsUnsubscribed] = useState<boolean>(
    item.isSubscriber ? true : false,
  )

  const handleAction = async (): Promise<void> => {
    if (isUnsubscribed) {
      const res = await unSubscribeToEvent(String(item.id))
      if (res) {
        setIsUnsubscribed(false)
      }
    } else {
      const res = await subscribeToEvent(String(item.id))
      if (res) {
        setIsUnsubscribed(true)
      }
    }
  }

  // const getAllUserSubEvent = async (): Promise<void> => {
  //   const res = await getAllUserSub({
  //     id: item.id,
  //     params: {
  //       take: 10000000,
  //     },
  //   })

  //   if (res) {
  //     console.log(res)
  //   }
  // }

  // useEffect(() => {
  //   getAllUserSubEvent()
  // }, [item])

  useEffect(() => {
    if (!isSubscribedToEventSuccess) {
      setNotifySetting({
        show: true,
        status: 'error',
        message: messageError,
      })
      setIsSubscribedToEventSuccess(true)
    }
  }, [isSubscribedToEventSuccess])

  useEffect(() => {
    if (!isUnSubscribedToEventSuccess) {
      setNotifySetting({
        show: true,
        status: 'error',
        message: messageError,
      })
      setIsUnSubscribedToEventSuccess(true)
    }
  }, [isUnSubscribedToEventSuccess])

  return (
    <>
      <div className="px-3 py-4 relative">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-red-600">
            Từ {formatDateLocalV2(item.startAt)} đến {formatDateLocalV2(item.endAt)}
          </span>
          <h4 className="text-lg font-medium">{item.displayName}</h4>
          <p className="text-sm font-thin ">{item.location}</p>
        </div>
        <span className="absolute right-4 top-4 border border-gray-400 text-gray-700 px-4 py-2 text-xs rounded-3xl">
          {item.status}
        </span>

        <div className="mt-3">
          <PostContent
            content={item.content}
            images={item.documents}
            type="events"
          />
        </div>

        <div className="bg-gray-300 pl-2 rounded-md mt-3 flex gap-8 items-center">
          <div className="relative group">
            <button
              onClick={() => handleAction()}
              className=" outline-none flex gap-1.5 py-1 items-center border-none hover:opacity-75">
              {!isUnsubscribed && (
                <>
                  <HiOutlineStar className="text-blue-700 h-4 w-4" />
                  <span className="text-blue-700 ">Tham gia</span>
                </>
              )}

              {isUnsubscribed && (
                <>
                  <HiStar className="text-blue-700 h-4 w-4" />
                  <span className="text-blue-700 ">Đã tham gia</span>
                </>
              )}
            </button>
            <div className="absolute h-12 bg-black/70 top-full left-0 px-2 py-1 rounded-md text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              hahahahahaha
            </div>
          </div>

          <button
            onClick={() => setOpenModalDetailEvent(true)}
            className="outline-none flex gap-1.5 py-1 items-center border-none">
            <HiOutlineChatBubbleLeftEllipsis className="text-blue-700 h-4 w-4" />
            <span className="text-blue-700">Bình luận</span>
          </button>

          <div className="ml-auto mr-1 ">
            {currentUserSuccess?.id === modId && (
              <OptionEventItem
                item={item}
                setOpenModal={setIsOpenModalAddEdit}
                setOpenModalDelete={setOpenModalDeleteEvent}
                setRowSelectedEvent={setItemSelected}
              />
            )}
          </div>
        </div>
      </div>
      {openModalDetailEvent && (
        <ModalDetailEvent
          open={openModalDetailEvent}
          setOpen={setOpenModalDetailEvent}
          item={item}
          isUnsubscribed={isUnsubscribed}
          handleAction={handleAction}
        />
      )}
    </>
  )
}

export default EventItem
