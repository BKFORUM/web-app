import SearchInput from '@components/SearchInput'
import UserActive from '@components/UserActive'
import { FC, useState } from 'react'

interface Props {}

const Friend: FC<Props> = (): JSX.Element => {
  const [inputSearch, setInputSearch] = useState<string>('')

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }
  return (
    <div className="grid grid-cols-10 pt-6 flex-1">
      <div className="col-span-7 ml-40 mr-16 ">
        <div className="min-h-[200px] relative flex-1 flex gap-2 items-center px-6 py-h46 bg-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md">
          <div>
            <h4>Người bạn có thể quen</h4>
            <div>
              <SearchInput
                value={inputSearch}
                setValue={handleChangeSearch}
                width="100%"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-3 px-4 ">
        <UserActive />
      </div>
    </div>
  )
}

export default Friend
