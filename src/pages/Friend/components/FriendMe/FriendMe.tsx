import SearchInput from '@components/SearchInput'
import { FC, useEffect, useState } from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { friendActionSelector, friendStateSelector } from '@store/index'
import { IUserData } from '@interfaces/IUser'
import notFoundSearch from '../../../../assets/images/notFoundSearch.jpg'
import Button from '@components/Button'
import { useNavigate } from 'react-router-dom'

interface Props {}

const FriendMe: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const { updateStatusFriend, setListFriendMe } = useStoreActions(friendActionSelector)
  const { listFriendMe } = useStoreState(friendStateSelector)
  const [data, setData] = useState<IUserData[]>(listFriendMe)
  const [inputSearch, setInputSearch] = useState<string>('')

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }

  const handleSearch = (): void => {
    const newData = data.filter((item) => {
      return item.fullName.toLowerCase().includes(inputSearch.toLowerCase())
    })
    setData(newData)
  }

  const handleDeleteFriend = (id: string): void => {
    const res = updateStatusFriend({ id: id, status: 'DELETED' })
    if (res) {
      const newData = listFriendMe.filter((user) => {
        return user.id !== id
      })
      setListFriendMe(newData)
    }
  }

  useEffect(() => {
    if (inputSearch === '') setData(listFriendMe)
    else handleSearch()
  }, [inputSearch])

  useEffect(() => {
    setData(listFriendMe)
  }, [listFriendMe])
  return (
    <>
      <div className="mt-4 w-full ">
        <SearchInput
          value={inputSearch}
          setValue={handleChangeSearch}
          width="250px"
          size="small"
        />
      </div>
      {data.length > 0 && (
        <div className="grid grid-cols-1 gap-3 my-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 hover:bg-gray-200 transition-all duration-300 p-2  rounded-md border border-gray-200">
              <div
                className="flex items-center gap-3 cursor-pointer "
                onClick={() => navigate('/profile/' + item.id)}>
                <div className="h-12 w-12 overflow-hidden">
                  <img
                    className="h-full w-full border border-gray-300 rounded-full"
                    src={item.avatarUrl}
                    alt={item.fullName}
                  />
                </div>
                <span>{item.fullName}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleDeleteFriend(item.id || '')}
                  typeButton="cancel">
                  Hủy kết bạn
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <div className="h-40 w-40">
            <img
              className="h-full w-full"
              src={notFoundSearch}
              alt="not found search"
            />
          </div>
          <span className="font-medium">
            We're sorry. We were not able to find a match
          </span>
        </div>
      )}
    </>
  )
}

export default FriendMe
