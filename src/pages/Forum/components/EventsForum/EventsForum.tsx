import Button from '@components/Button'
import { FC, useEffect, useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi'
import ModalAddEditEvent from '../ModalAddEditEvent'
import { IEvent } from '@interfaces/IEvent'
import { formatDateTimeLocal } from '@utils/functions/formatDay'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  eventActionSelector,
  eventStateSelector,
  notifyActionSelector,
  postActionSelector,
  userStateSelector,
} from '@store/index'
import { useParams } from 'react-router-dom'
import { pageMode } from '@interfaces/IClient'
import { IUserData } from '@interfaces/IUser'
import InfiniteScroll from 'react-infinite-scroll-component'
import EventItem from '@components/EventItem'
import ModalConfirm from '@components/ModalConfirm'

interface Props {
  moderator?: IUserData
}

const EventsForum: FC<Props> = ({ moderator }: Props): JSX.Element => {
  const { id } = useParams()
  const forumId = id

  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const { postImage } = useStoreActions(postActionSelector)
  const {
    addEvent,
    getAllEvent,
    setIsAddEventSuccess,
    setIsDeleteEventSuccess,
    deleteEvent,
    editEvent,
    setIsEditEventSuccess,
  } = useStoreActions(eventActionSelector)
  const { messageError, isAddEventSuccess, isDeleteEventSuccess, isEditEventSuccess } =
    useStoreState(eventStateSelector)

  const [isOpenModalAddEdit, setIsOpenModalAddEdit] = useState<boolean>(false)
  const [openModalDeleteEvent, setOpenModalDeleteEvent] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [itemSelected, setItemSelected] = useState<IEvent | undefined>(undefined)
  const [dataEvents, setDataEvents] = useState<IEvent[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)

  const getAllEventForum = async (): Promise<void> => {
    if (forumId && paginationModel) {
      const res = await getAllEvent({
        skip: paginationModel.page * 10,
        take: paginationModel.pageSize,
        forumIds: forumId,
      })
      if (res) {
        console.log(res)
        setTotalRowCount(res.totalRecords)
        setDataEvents([...dataEvents, ...res.data])
      }
    }
  }

  useEffect(() => {
    getAllEventForum()
  }, [paginationModel])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (id) {
      setDataEvents([])
      setPaginationModel({ page: 0, pageSize: 10 })
    }
  }, [id])

  useEffect(() => {
    if (!isAddEventSuccess) {
      setNotifySetting({ show: true, status: 'error', message: messageError })
      setIsAddEventSuccess(true)
    }
  }, [isAddEventSuccess])

  const handleAction = async (data: any): Promise<void> => {
    setLoading(true)
    const { FileImages, ...dataNoDocuments } = data
    const startAt = formatDateTimeLocal(dataNoDocuments?.startAt)
    const endAt = formatDateTimeLocal(dataNoDocuments?.endAt)
    const newData = { ...dataNoDocuments, startAt: startAt, endAt: endAt }

    const formData = new FormData()
    for (let i = 0; i < FileImages?.length; i++) {
      formData.append(`documents`, FileImages[i])
    }

    const newUrls = data?.imageEdit.map((image: any) => {
      return { fileUrl: image.fileUrl, fileName: image.fileName }
    })
    if (itemSelected !== undefined) {
      if (FileImages?.length > 0) {
        const resImage = await postImage(formData)
        if (resImage) {
          const res = await editEvent({
            ...data,
            documents: [...newUrls, ...resImage],
            type: 'GENERAL',
          })
          if (res) {
            setNotifySetting({
              show: true,
              status: 'success',
              message: 'Edit event successfully',
            })
            const updateEvents = dataEvents.map((event: IEvent) =>
              event.id === itemSelected.id
                ? {
                    ...event,
                    ...data,
                    content: data.content,
                    documents: [...resImage, ...newUrls],
                  }
                : event,
            )
            setDataEvents(updateEvents)
          }
        }
      } else {
        const res = await editEvent({
          ...data,
          documents: newUrls,
          type: 'GENERAL',
        })
        if (res) {
          setNotifySetting({
            show: true,
            status: 'success',
            message: 'Edit event successfully',
          })
          const updateEvents = dataEvents.map((event: IEvent) =>
            event.id === itemSelected.id
              ? {
                  ...event,
                  ...data,
                  content: data.content,
                  documents: newUrls,
                }
              : event,
          )
          setDataEvents(updateEvents)
        }
      }
      setLoading(false)
      setIsOpenModalAddEdit(false)
    } else {
      const { id, ...dataNoId } = newData
      if (FileImages?.length > 0) {
        const resImage = await postImage(formData)
        if (resImage) {
          const res = await addEvent({
            ...dataNoId,
            documents: resImage,
            type: 'FORUM',
            forumId: forumId || '',
          })
          if (res) {
            setNotifySetting({
              show: true,
              status: 'success',
              message: 'Add events successful',
            })
            window.scrollTo(0, 0)
            setDataEvents([])
            setPaginationModel({ page: 0, pageSize: 10 })
          }
        }
      } else {
        const res = await addEvent({ ...dataNoId, type: 'FORUM', forumId: forumId || '' })
        if (res) {
          setNotifySetting({
            show: true,
            status: 'success',
            message: 'Add events successful',
          })
          window.scrollTo(0, 0)
          setDataEvents([])
          setPaginationModel({ page: 0, pageSize: 10 })
        }
      }
    }
    setLoading(false)
    setIsOpenModalAddEdit(false)
  }

  const handleDelete = async () => {
    const res = await deleteEvent(String(itemSelected?.id))
    if (res) {
      setNotifySetting({
        show: true,
        status: 'success',
        message: 'Delete Event successful',
      })
      const updateEvents = dataEvents.filter((event) => event.id !== itemSelected?.id)
      setDataEvents(updateEvents)
    }
    setOpenModalDeleteEvent(false)
  }

  useEffect(() => {
    if (!isAddEventSuccess) {
      setNotifySetting({ show: true, status: 'error', message: messageError })
      setIsAddEventSuccess(true)
    }
  }, [isAddEventSuccess])

  useEffect(() => {
    if (!isEditEventSuccess) {
      setNotifySetting({ show: true, status: 'error', message: messageError })
      setIsEditEventSuccess(true)
    }
  }, [isEditEventSuccess])

  useEffect(() => {
    if (!isDeleteEventSuccess) {
      setNotifySetting({ show: true, status: 'error', message: messageError })
      setIsDeleteEventSuccess(true)
    }
  }, [isDeleteEventSuccess])

  return (
    <>
      <div className="flex flex-col">
        <div className="p-4 my-4 bg-white flex justify-between items-center shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
          <h4 className="font-semibold text-lg">Events Forum</h4>
          {currentUserSuccess?.id === moderator?.id && (
            <Button
              onClick={() => {
                setIsOpenModalAddEdit(true)
                setItemSelected(undefined)
              }}>
              <HiOutlinePlus className="mr-2" />
              <span className="text-sm">Add Event</span>
            </Button>
          )}
        </div>

        <div>
          <InfiniteScroll
            dataLength={dataEvents.length}
            next={() =>
              setPaginationModel((prevPaginationModel) => ({
                page: prevPaginationModel ? prevPaginationModel.page + 1 : 0,
                pageSize: 10,
              }))
            }
            hasMore={dataEvents.length !== totalRowCount}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }>
            {dataEvents.map((item, index) => (
              <div
                key={index}
                className="mb-4 bg-white min-h-[100px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md ">
                <EventItem
                  item={item}
                  modId={moderator?.id}
                  setIsOpenModalAddEdit={setIsOpenModalAddEdit}
                  setOpenModalDeleteEvent={setOpenModalDeleteEvent}
                  setItemSelected={setItemSelected}
                />
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
      {isOpenModalAddEdit && (
        <ModalAddEditEvent
          loading={loading}
          open={isOpenModalAddEdit}
          item={itemSelected}
          setOpen={setIsOpenModalAddEdit}
          handleAction={handleAction}
        />
      )}

      {openModalDeleteEvent && (
        <ModalConfirm
          open={openModalDeleteEvent}
          handleClose={() => {
            setOpenModalDeleteEvent(false)
          }}
          handleDelete={handleDelete}
        />
      )}
    </>
  )
}

export default EventsForum
