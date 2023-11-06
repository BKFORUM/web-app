import SearchInput from '@components/SearchInput'
import { FC, useEffect, useState } from 'react'
import { useStoreState } from 'easy-peasy'
import { friendStateSelector } from '@store/index'
import { IUserData } from '@interfaces/IUser'
import notFoundSearch from '../../../../assets/images/notFoundSearch.jpg'

interface Props {}

const FriendMe: FC<Props> = (): JSX.Element => {
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
        <div className="grid grid-cols-2 gap-3 my-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 hover:bg-gray-200 transition-all duration-300 p-2 cursor-pointer rounded-md border border-gray-200">
              <div className="h-12 w-12 overflow-hidden">
                <img
                  className="h-full w-full border border-gray-300 rounded-full"
                  src={item.avatarUrl}
                  alt={item.fullName}
                />
              </div>
              <span>{item.fullName}</span>
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
