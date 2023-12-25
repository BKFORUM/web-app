import { FC, useEffect, useState } from 'react'
import { Tooltip } from '@mui/material'
import Button from '@components/Button'
import { useStoreActions } from 'easy-peasy'
import { friendActionSelector } from '@store/index'
import { IResponseFriend } from '@interfaces/IFriend'
import { IUserData } from '@interfaces/IUser'

interface Props {}
const RequestFriend: FC<Props> = (): JSX.Element => {
  const { getAllRequestFriend, updateStatusFriend, addFriendAtList } =
    useStoreActions(friendActionSelector)

  const [data, setData] = useState<IResponseFriend[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getAllRequestFriendPage = async (): Promise<void> => {
    setIsLoading(true)
    const res = await getAllRequestFriend()
    if (res) {
      setData(res)
    }
    setIsLoading(false)
  }

  const handelAction = async (status: string, user: IUserData): Promise<void> => {
    setIsLoading(true)
    const res = await updateStatusFriend({ id: user.id, status: status })
    if (res) {
      if (status === 'ACTIVE') {
        addFriendAtList(user)
      }
      const newData = data.filter((item) => {
        return item.sender.id !== user.id
      })
      setData(newData)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getAllRequestFriendPage()
  }, [])

  return (
    <>
      <div className="grid grid-cols-3 gap-6 mt-4 mb-8 ">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex flex-col rounded-md overflow-hidden shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
            <div className="h-48 w-auto overflow-hidden">
              <img
                className="h-full w-full "
                src={item.sender.avatarUrl}
                alt={item.sender.fullName}
              />
            </div>
            <Tooltip title={item.sender.fullName}>
              <span className="text-base font-semibold my-2 line-clamp-1 mx-2">
                {item.sender.fullName}
              </span>
            </Tooltip>
            <div className="px-2">
              <Button
                onClick={() => handelAction('ACTIVE', item.sender || '')}
                disabled={isLoading}
                className="w-full">
                Chấp nhận
              </Button>
            </div>
            <div className="px-2 pt-2 py-4">
              <Button
                onClick={() => handelAction('DELETED', item.sender || '')}
                disabled={isLoading}
                typeButton="cancel"
                className="w-full">
                Hủy
              </Button>
            </div>
          </div>
        ))}
      </div>
      {data.length === 0 && !isLoading && (
        <div className="w-full text-center">Chưa có lời mời kết bạn nào</div>
      )}
    </>
  )
}

export default RequestFriend
