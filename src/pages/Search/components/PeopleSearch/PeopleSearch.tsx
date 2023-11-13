import { pageMode } from '@interfaces/IClient'
import { IUserData } from '@interfaces/IUser'
import { friendActionSelector, userActionSelector, userStateSelector } from '@store/index'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { FC, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import PeopleItem from '../PeopleItem'
import Button from '@components/Button'
import { HiChevronLeft } from 'react-icons/hi'
import { ICheckNoData } from '@pages/Search/Search'

interface Props {
  textSearch: string
  statusShowPeople: string
  setStatusShowForum: React.Dispatch<React.SetStateAction<string>>
  handleSetShowPeople: (status: string) => void
  setCheckNoData: React.Dispatch<React.SetStateAction<ICheckNoData>>
}

const PeopleSearch: FC<Props> = ({
  textSearch,
  statusShowPeople,
  setStatusShowForum,
  handleSetShowPeople,
  setCheckNoData,
}: Props): JSX.Element => {
  const { getAllUser } = useStoreActions(userActionSelector)
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { requestFriend, updateStatusFriend } = useStoreActions(friendActionSelector)

  const [loading, setIsLoading] = useState<boolean>(false)

  const [data, setData] = useState<IUserData[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)

  const getAllUserSearch = async (): Promise<void> => {
    if (paginationModel) {
      setIsLoading(true)
      const res = await getAllUser({
        search: textSearch,
        skip: paginationModel.page * 10,
        take: paginationModel.pageSize,
      })
      if (res) {
        setTotalRowCount(res.totalRecords)
        setData([...data, ...res.data])

        if (res.data.length === 0) {
          setCheckNoData((prev) => ({
            ...prev,
            isNoPeople: true,
          }))
        }
      }
      setIsLoading(false)
    }
  }

  const requestFriendUser = async (id: string, status: string): Promise<void> => {
    if (status === 'NOT FRIEND') {
      const res = await requestFriend(id)
      if (res) {
        const index = data.findIndex((item) => item.id === id)
        const newData: IUserData = { ...data[index], friendStatus: 'PENDING' }
        data[index] = newData
        setData([...data])
      }
    } else {
      const res = await updateStatusFriend({ id: id, status: 'DELETED' })
      if (res) {
        const index = data.findIndex((item) => item.id === id)
        const newData: IUserData = { ...data[index], friendStatus: 'NOT FRIEND' }
        data[index] = newData
        setData([...data])
      }
    }
  }

  const handleShowAll = () => {
    window.scrollTo(0, 0)
    handleSetShowPeople('SHOW_ALL')
  }

  useEffect(() => {
    if (textSearch !== '') {
      setData([])
      setPaginationModel({ page: 0, pageSize: 10 })
    }
  }, [textSearch])

  useEffect(() => {
    getAllUserSearch()
  }, [paginationModel])

  return (
    <>
      {data.length > 0 && (
        <div className=" w-full gap-2 items-center mb-6 px-6 py-4 bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md z-10">
          {statusShowPeople === 'SHOW_ALL' ? (
            <div
              onClick={() => {
                handleSetShowPeople('SHOW_A_FEW')
                setStatusShowForum('SHOW_A_FEW')
              }}
              className="flex  font-semibold items-center mb-2 cursor-pointer">
              <HiChevronLeft className="h-7 w-7 mt-0.5" />
              <span className="text-xl font-semibold ">Back</span>
            </div>
          ) : (
            <h4 className="text-xl font-semibold mb-2 ">People</h4>
          )}

          <div
            className={` ${
              statusShowPeople === 'SHOW_ALL'
                ? 'opacity-100 transform translate-x-0 h-auto '
                : 'opacity-0 transform translate-x-[50px] h-0 overflow-hidden'
            } transition-all duration-500`}>
            <InfiniteScroll
              dataLength={data.length}
              next={() =>
                setPaginationModel((prevPaginationModel) => ({
                  page: prevPaginationModel ? prevPaginationModel.page + 1 : 0,
                  pageSize: 10,
                }))
              }
              hasMore={data.length !== totalRowCount}
              loader={<div>{loading && <span>Loading...</span>}</div>}
              endMessage={
                <div>
                  {!paginationModel && (
                    <p style={{ textAlign: 'center' }}>
                      <b>Nhập search để bắt đầu tìm kiếm</b>
                    </p>
                  )}
                  {paginationModel && !loading && data.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="h-40 w-40">
                        <img
                          className="h-full w-full"
                          src="../../../../assets/images/notFoundSearch.jpg"
                          alt="not found search"
                        />
                      </div>
                      <span className="font-medium">
                        We're sorry. We were not able to find a match
                      </span>
                    </div>
                  )}
                  {data.length === totalRowCount &&
                    data.length > 0 &&
                    paginationModel && (
                      <p style={{ textAlign: 'center', marginTop: 12 }}>
                        <b>Đúng! Bạn đã nhìn thấy tất cả kết quả tìm kiếm</b>
                      </p>
                    )}
                </div>
              }>
              <div className={`w-full flex flex-1 flex-col gap-3 `}>
                {data.map((item, index) => {
                  if (item.id !== currentUserSuccess?.id) {
                    return (
                      <div key={index}>
                        <PeopleItem
                          item={item}
                          requestFriendUser={requestFriendUser}
                        />
                      </div>
                    )
                  }
                })}
              </div>
            </InfiniteScroll>
          </div>

          {statusShowPeople === 'SHOW_A_FEW' && (
            <div className="flex flex-col gap-4">
              <div className={`w-full flex flex-1 flex-col gap-3 `}>
                {data.slice(0, 5).map((item, index) => {
                  if (item.id !== currentUserSuccess?.id) {
                    return (
                      <div key={index}>
                        <PeopleItem
                          item={item}
                          requestFriendUser={requestFriendUser}
                        />
                      </div>
                    )
                  }
                })}
              </div>
              {data.length > 5 && (
                <Button onClick={() => handleShowAll()}>Xem tất cả</Button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default PeopleSearch
