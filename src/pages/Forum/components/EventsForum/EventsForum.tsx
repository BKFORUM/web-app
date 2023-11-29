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
} from '@store/index'
import { useParams } from 'react-router-dom'
import { pageMode } from '@interfaces/IClient'

interface Props {}

const EventsForum: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const forumId = id

  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const { postImage } = useStoreActions(postActionSelector)
  const {
    addEvent,
    getAllEvent,
    setIsAddEventSuccess,
    setIsGetAllEventSuccess,
    setIsDeleteEventSuccess,
    deleteEvent,
  } = useStoreActions(eventActionSelector)
  const { isGetAllEventSuccess, messageError, isAddEventSuccess, isDeleteEventSuccess } =
    useStoreState(eventStateSelector)

  const [isOpenModalAddEdit, setIsOpenModalAddEdit] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [itemSelected, setItemSelected] = useState<IEvent | undefined>(undefined)
  const [dataPost, setDataPost] = useState<IEvent[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)

  const getAllEventForum = async (): Promise<void> => {
    if (forumId && paginationModel) {
      const res = await getAllEvent({
        skip: paginationModel.page * 10,
        take: paginationModel.pageSize,
        // status: 'ACTIVE',
        forumIds: forumId,
      })
      if (res) {
        console.log(res)
        setTotalRowCount(res.totalRecords)
        setDataPost([...dataPost, ...res.data])
      }
    }
  }

  useEffect(() => {
    getAllEventForum()
  }, [paginationModel])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (id) {
      setDataPost([])
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
    if (itemSelected !== undefined) {
      // const res = await editForum(data)
      // if (res) {
      //   setNotifySetting({
      //     show: true,
      //     status: 'success',
      //     message: 'Edit forum successful',
      //   })
      // }
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
            // getAllEventGeneral()
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
          // getAllEventGeneral()
        }
      }
    }
    setLoading(false)
    setIsOpenModalAddEdit(false)
  }
  return (
    <>
      <div className="flex flex-col">
        <div className="p-4 my-4 bg-white flex justify-between items-center shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
          <h4 className="font-semibold text-lg">Events Forum</h4>
          <Button
            onClick={() => {
              setIsOpenModalAddEdit(true)
              setItemSelected(undefined)
            }}>
            <HiOutlinePlus className="mr-2" />
            <span className="text-sm">Add Event</span>
          </Button>
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
    </>
  )
}

export default EventsForum
