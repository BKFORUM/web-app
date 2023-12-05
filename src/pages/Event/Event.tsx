import EventItem from '@components/EventItem'
import UserActive from '@components/UserActive'
import { IEvent } from '@interfaces/IEvent'
import { eventActionSelector } from '@store/index'
import { useStoreActions } from 'easy-peasy'
import { FC, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

interface Props {}

const Event: FC<Props> = (_props): JSX.Element => {
  const { getAllEvent } = useStoreActions(eventActionSelector)

  const [dataEvents, setDataEvents] = useState<IEvent[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })

  const getAllEventData = async (): Promise<void> => {
    const res = await getAllEvent({
      skip: paginationModel.page * 10,
      take: paginationModel.pageSize,
    })
    if (res) {
      setTotalRowCount(res.totalRecords)
      setDataEvents([...dataEvents, ...res.data])
    }
  }

  useEffect(() => {
    getAllEventData()
  }, [paginationModel])

  return (
    <>
      <div className="grid grid-cols-10 pt-6 flex-1">
        <div className="col-span-7 ml-40 mr-16 ">
          <div>
            <InfiniteScroll
              dataLength={dataEvents.length}
              next={() =>
                setPaginationModel({
                  page: paginationModel.page + 1,
                  pageSize: 10,
                })
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
                  <EventItem item={item} />
                </div>
              ))}
            </InfiniteScroll>
          </div>
        </div>

        <div className="col-span-3 px-4 relative">
          <UserActive />
        </div>
      </div>
    </>
  )
}

export default Event
