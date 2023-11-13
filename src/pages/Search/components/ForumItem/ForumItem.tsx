import Button from '@components/Button'
import { IUserForumResponseUpdated } from '@interfaces/IForum'
import { FC } from 'react'
import { HiUser } from 'react-icons/hi2'
import default_forum from '../../../../assets/images/default_forum.png'

interface Props {
  item: IUserForumResponseUpdated
  requestForumUser: (id: string, status: string) => Promise<void>
}

const ForumItem: FC<Props> = ({ item, requestForumUser }: Props): JSX.Element => {
  return (
    <div className="flex justify-between items-center px-3 py-3.5 border border-gray-300 rounded-xl">
      <div className="flex gap-4">
        <div className="h-20 w-20 rounded-lg overflow-hidden">
          <img
            className="h-full w-full object-cover border border-gray-300"
            src={item.avatarUrl || default_forum}
            alt={item.name}
          />
        </div>
        <div className="flex flex-col flex-1 gap-1 mb-auto">
          <h4 className="text-xl font-semibold pt-0">{item.name}</h4>
          <div className="flex flex-wrap gap-2">
            {item.topics.map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[#E6F0F6] rounded-2xl text-xs">
                {item.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 ">
            <HiUser className="w-4 h-4" />
            <span className="text-sm ">
              {item._count.users} <span>member</span>
            </span>
          </div>
        </div>
      </div>

      {(item.yourStatus === 'NOT MEMBER' || item.yourStatus === 'DELETED') && (
        <div
          onClick={() => requestForumUser(item.id || '', 'NOT MEMBER')}
          className="">
          <Button>Gửi yêu cầu tham gia</Button>
        </div>
      )}

      {item.yourStatus === 'PENDING' && (
        <div
          onClick={() => requestForumUser(item.id || '', 'PENDING')}
          className="">
          <Button typeButton="cancel">Đã gửi yêu câu</Button>
        </div>
      )}

      {item.yourStatus === 'ACTIVE' && (
        <span className="px-4 py-1.5 rounded-md bg-slate-100 shadow-sm">Đã tham gia</span>
      )}
    </div>
  )
}

export default ForumItem
