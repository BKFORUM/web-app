import { FC } from 'react'
import logoBkForum from '../../../assets/images/logobkforum.png'
import SmsIcon from '@mui/icons-material/Sms'
import AvatarHeader from '../AvatarHeader/AvatarHeader'
import Tooltip from '@mui/material/Tooltip'
import Notification from '../Notification'
import { useNavigate } from 'react-router-dom'

interface Props {}

const Header: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  return (
    <div className="h-[60px] bg-[#0001CB] flex justify-between items-center px-3 fixed top-0 right-0 left-0 z-[50] ">
      <div
        className="h-16 cursor-pointer"
        onClick={() => navigate('/')}>
        <img
          className="w-full h-full"
          src={logoBkForum}
          alt="logoBk"
        />
      </div>
      <div className="flex gap-6 items-center pr-8">
        <Tooltip title={<h1 className="text-sm">Message</h1>}>
          <SmsIcon
            onClick={() => navigate('/message')}
            className=" text-[#FEFE00] cursor-pointer"
            sx={{ fontSize: 28 }}
          />
        </Tooltip>

        <Notification />

        <AvatarHeader />
      </div>
    </div>
  )
}

export default Header
