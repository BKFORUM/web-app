import SearchInput from '@components/SearchInput'
import { FC, useState } from 'react'
import test from '../../../../assets/images/avatartest.jpg'
import Button from '@components/Button'

interface Props {}

const fakeData = [
  {
    id: '1',
    fullName: 'Trương Quang Khang',
    avatarUrl: test,
  },
  {
    id: '2',
    fullName: 'Trương Quang Khang',
    avatarUrl: test,
  },
  {
    id: '3',
    fullName: 'Trương Quang Khang',
    avatarUrl: test,
  },
  {
    id: '4',
    fullName: 'Trương Quang Khang',
    avatarUrl: test,
  },
  {
    id: '5',
    fullName: 'Trương Quang Khang',
    avatarUrl: test,
  },
]

const MemberRequest: FC<Props> = (): JSX.Element => {
  const [inputSearch, setInputSearch] = useState<string>('')
  const [isLoading, _setIsLoading] = useState<boolean>(false)

  const handleChangeSearch = (value: string): void => {
    setInputSearch(value)
  }

  return (
    <div className="p-4 my-4 bg-white min-h-[100px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md ">
      <h4 className="text-base font-medium">Members request</h4>
      <div className="py-6 px-2">
        <SearchInput
          value={inputSearch}
          setValue={handleChangeSearch}
          width="100%"
          size="small"
        />
      </div>
      <div className="flex flex-col gap-2">
        {fakeData.map((user, index) => (
          <div
            key={index}
            className="mb-0.5 flex items-center justify-between hover:bg-gray-200 rounded-md cursor-pointer px-2 py-1 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden">
                <img
                  className="h-full w-full rounded-full border border-gray-300"
                  src={user?.avatarUrl}
                  alt={user?.fullName}
                />
              </div>
              <span className="text-base font-semibold">{user?.fullName}</span>
            </div>
            <div className=" flex justify-end gap-4 ">
              <Button
                typeButton="reject"
                className="px-3 py-1.5"
                // onClick={() => setOpen(false)}
              >
                Reject
              </Button>
              <Button
                // onClick={handleExternalButtonClick}
                typeButton="approve"
                className="px-3 py-1.5"
                disabled={isLoading}
                loading={isLoading}>
                Approve
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MemberRequest
