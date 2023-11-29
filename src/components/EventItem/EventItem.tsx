import PostContent from '@components/PostContent'
import { IEvent } from '@interfaces/IEvent'
import { formatDateLocalV2 } from '@utils/functions/formatDay'
import { HiOutlineStar } from 'react-icons/hi'
import { HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2'
import { FC, useState } from 'react'
import ModalDetailEvent from '@components/ModalDetailEvent'
import { useStoreState } from 'easy-peasy'
import { userStateSelector } from '@store/index'
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
  const [openModalDetailEvent, setOpenModalDetailEvent] = useState<boolean>(false)

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
          <button className="outline-none flex gap-1.5 py-1 items-center border-none hover:opacity-75">
            <HiOutlineStar className="text-blue-700 h-4 w-4" />
            <span className="text-blue-700 ">Tham gia</span>
          </button>

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
        />
      )}
    </>
  )
}

export default EventItem
