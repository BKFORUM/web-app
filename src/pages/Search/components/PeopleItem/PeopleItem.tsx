import Button from '@components/Button'
import { IUserData } from '@interfaces/IUser'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  item: IUserData
  requestFriendUser: (id: string, status: string) => Promise<void>
}

const PeopleItem: FC<Props> = ({ item, requestFriendUser }: Props): JSX.Element => {
  const navigate = useNavigate()
  return (
    <div className="flex justify-between items-center px-3 py-3.5 border border-gray-300 rounded-xl">
      <div
        onClick={() => navigate('/profile/' + item.id)}
        className="flex gap-4 items-center cursor-pointer ">
        <div className="h-14 w-14 overflow-hidden">
          <img
            className="h-full w-full rounded-full border border-gray-200 "
            src={item.avatarUrl}
            alt={item.fullName}
          />
        </div>
        <span className="text-base font-medium">{item.fullName}</span>
      </div>

      {(item.friendStatus === 'NOT FRIEND' || item.friendStatus === 'DELETED') && (
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
        <span className="px-4 py-1.5 rounded-md bg-slate-100 shadow-sm">Bạn bè</span>
      )}
    </div>
  )
}

export default PeopleItem
