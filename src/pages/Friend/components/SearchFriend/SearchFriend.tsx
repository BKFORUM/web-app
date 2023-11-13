import SearchInput from '@components/SearchInput'
import { useDebounce } from '@hooks/useDebounce'
import { pageMode } from '@interfaces/IClient'
import { IUserData } from '@interfaces/IUser'
import { friendActionSelector, userActionSelector, userStateSelector } from '@store/index'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { FC, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Button from '@components/Button'
import { useNavigate } from 'react-router-dom'
import notfound_data from '../../../../assets/images/notFoundSearch.jpg'

interface Props {}

const SearchFriend: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const { getAllUser } = useStoreActions(userActionSelector)
  const { currentUserSuccess } = useStoreState(userStateSelector)
  const { requestFriend, updateStatusFriend } = useStoreActions(friendActionSelector)

  const [inputSearch, setInputSearch] = useState<string>('')
  const [loading, setIsLoading] = useState<boolean>(false)

  const [data, setData] = useState<IUserData[]>([])
  const [totalRowCount, setTotalRowCount] = useState<number>(0)
  const [paginationModel, setPaginationModel] = useState<pageMode | null>(null)

  const getAllUserSearch = async (): Promise<void> => {
    if (paginationModel) {
      setIsLoading(true)
      const res = await getAllUser({
        search: inputSearch,
        skip: paginationModel.page * 10,
        take: paginationModel.pageSize,
      })
      if (res) {
        setTotalRowCount(res.totalRecords)
        setData([...data, ...res.data])
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

  const debouncedInputValue = useDebounce(inputSearch, 500)

  useEffect(() => {
    if (inputSearch !== '') {
      setData([])
      setPaginationModel({ page: 0, pageSize: 10 })
    } else {
      setData([])
      setPaginationModel(null)
      setTotalRowCount(0)
    }
  }, [debouncedInputValue])

  useEffect(() => {
    getAllUserSearch()
  }, [paginationModel])

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }
  return (
    <div className="mt-4">
      <div className="mt-4 w-full ">
        <SearchInput
          value={inputSearch}
          setValue={handleChangeSearch}
          width="250px"
          size="small"
        />
      </div>

      <div className="py-4">
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
                      src={notfound_data}
                      alt="not found search"
                    />
                  </div>
                  <span className="font-medium">
                    We're sorry. We were not able to find a match
                  </span>
                </div>
              )}
              {data.length === totalRowCount && data.length > 0 && paginationModel && (
                <p style={{ textAlign: 'center', marginTop: 12 }}>
                  <b>Đúng! Bạn đã nhìn thấy tất cả kết quả tìm kiếm</b>
                </p>
              )}
            </div>
          }>
          <div className="flex flex-col gap-3 ">
            {data.map((item, index) => {
              if (item.id !== currentUserSuccess?.id) {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center px-2 py-1.5 border border-gray-300 rounded-md">
                    <div
                      onClick={() => navigate('/profile/' + item.id)}
                      className="flex gap-4 items-center cursor-pointer ">
                      <div className="h-12 w-12 overflow-hidden">
                        <img
                          className="h-full w-full rounded-full border border-gray-200 "
                          src={item.avatarUrl}
                          alt={item.fullName}
                        />
                      </div>
                      <span className="text-base font-medium">{item.fullName}</span>
                    </div>

                    {(item.friendStatus === 'NOT FRIEND' ||
                      item.friendStatus === 'DELETED') && (
                      <div
                        onClick={() => requestFriendUser(item.id || '', 'NOT FRIEND')}
                        className="">
                        <Button>Thêm bạn bè</Button>
                      </div>
                    )}

                    {item.friendStatus === 'PENDING' && (
                      <div
                        onClick={() => requestFriendUser(item.id || '', 'PENDING')}
                        className="">
                        <Button typeButton="cancel">Đã gửi yêu câu</Button>
                      </div>
                    )}

                    {item.friendStatus === 'ACTIVE' && (
                      <span className="px-4 py-1.5 rounded-md bg-slate-100 shadow-sm">
                        Bạn bè
                      </span>
                    )}
                  </div>
                )
              }
            })}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default SearchFriend
