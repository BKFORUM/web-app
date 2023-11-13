// import SearchInput from '@components/SearchInput'
import { FC, useEffect, useState } from 'react'
import Button from '@components/Button'
import { useStoreActions } from 'easy-peasy'
import { forumActionSelector, notifyActionSelector } from '@store/index'
import { useParams } from 'react-router-dom'
import { IUserRequestForum } from '@interfaces/IUser'

interface Props {}

const MemberRequest: FC<Props> = (): JSX.Element => {
  const { id } = useParams()
  const { getAllUserRequest, updateStatusUserFromForum } =
    useStoreActions(forumActionSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)

  // const [inputSearch, setInputSearch] = useState<string>('')
  const [data, setData] = useState<IUserRequestForum[]>([])
  const [isLoading, _setIsLoading] = useState<boolean>(false)

  const getAllMemberRequest = async (): Promise<void> => {
    if (id) {
      const res = await getAllUserRequest(id)
      if (res) {
        setData(res)
      }
    }
  }

  const handelAction = async (status: string, userId: string): Promise<void> => {
    const res = await updateStatusUserFromForum({
      id: id,
      userId: userId,
      status: status,
    })
    if (res) {
      setNotifySetting({
        show: true,
        status: 'success',
        message: `${
          status === 'DELETED' ? 'Reject' : 'Approve'
        } user forum forum successfully`,
      })
      const newData = data.filter((item) => {
        return item.user.id !== userId
      })
      setData(newData)
    }
  }

  // const handleChangeSearch = (value: string): void => {
  //   setInputSearch(value)
  // }

  useEffect(() => {
    getAllMemberRequest()
  }, [])

  return (
    <div className="p-4 my-4 bg-white min-h-[100px] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] rounded-md ">
      <div className="flex items-center">
        <h4 className="text-base font-medium">Members request</h4>
        <span className="text-sm ml-3 font-light">{data.length}</span>
      </div>
      {/* <div className="py-6 px-2">
        <SearchInput
          value={inputSearch}
          setValue={handleChangeSearch}
          width="100%"
          size="small"
        />
      </div> */}
      <div className="mt-2 flex flex-col gap-2">
        {data.map((user, index) => (
          <div
            key={index}
            className="mb-0.5 flex items-center justify-between hover:bg-gray-200 rounded-md cursor-pointer px-2 py-1 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 overflow-hidden">
                <img
                  className="h-full w-full rounded-full border border-gray-300"
                  src={user?.user.avatarUrl}
                  alt={user?.user.fullName}
                />
              </div>
              <span className="text-base font-semibold">{user?.user.fullName}</span>
            </div>
            <div className=" flex justify-end gap-4 ">
              <Button
                typeButton="reject"
                className="px-3 py-1.5"
                onClick={() => handelAction('DELETED', user.user.id)}>
                Reject
              </Button>
              <Button
                onClick={() => handelAction('ACTIVE', user.user.id)}
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
