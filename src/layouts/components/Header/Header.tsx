import { FC, useEffect, useState } from 'react'
import SmsIcon from '@mui/icons-material/Sms'
import AvatarHeader from '../AvatarHeader/AvatarHeader'
// import { HiOutlinePlusCircle } from 'react-icons/hi2'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Tooltip from '@mui/material/Tooltip'
import Notification from '../Notification'
import { useNavigate } from 'react-router-dom'
import ModalEditForum from '@pages/Forum/components/ModalEditForum'
import { useStoreActions, useStoreState } from 'easy-peasy'
import logoBk from '../../../assets/images/logobkforum.png'
import {
  forumActionSelector,
  forumStateSelector,
  notifyActionSelector,
  postActionSelector,
  // userActionSelector,
} from '@store/index'

interface Props {}

const Header: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  const { addForum, setIsAddForumSuccess } = useStoreActions(forumActionSelector)
  // const { setIsGetAllAgain } = useStoreActions(userActionSelector)
  const { isAddForumSuccess, messageErrorForum } = useStoreState(forumStateSelector)
  const { postImage } = useStoreActions(postActionSelector)

  const { setNotifySetting } = useStoreActions(notifyActionSelector)

  const [openModalEditForum, setOpenModalEditForum] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleAddForum = async (data: any): Promise<void> => {
    setIsLoading(true)
    if (data.avatarUrl.length === 0) {
      const { avatarUrl, ...others } = data
      const res = await addForum(others)
      if (res) {
        setNotifySetting({
          show: true,
          status: 'success',
          message: 'Add forum successfully',
        })
      }
      setIsLoading(false)
      setOpenModalEditForum(false)
    } else {
      const formData = new FormData()
      formData.append(`documents`, data?.avatarUrl[0])
      const resImage = await postImage(formData)
      if (resImage) {
        const { id, ...others } = data
        const res = await addForum({ ...others, avatarUrl: resImage[0].fileUrl })
        if (res) {
          setNotifySetting({
            show: true,
            status: 'success',
            message: 'Add forum successfully',
          })
        }
      }
      setIsLoading(false)
      setOpenModalEditForum(false)
    }
  }

  useEffect(() => {
    if (!isAddForumSuccess) {
      setNotifySetting({ show: true, status: 'error', message: messageErrorForum })
      setIsAddForumSuccess(true)
    }
  }, [isAddForumSuccess])
  return (
    <>
      <div className="h-[60px] bg-[#0001CB] flex justify-between items-center px-3 fixed top-0 right-0 left-0 z-[50] ">
        <div
          className="h-16 cursor-pointer"
          onClick={() => navigate('/')}>
          <img
            className="w-full h-full"
            src={logoBk}
            alt="logoBk"
          />
        </div>
        <div className="flex gap-6 items-center pr-8">
          <Tooltip title={<h1 className="text-sm">Add Forum</h1>}>
            <AddCircleOutlineIcon
              onClick={() => setOpenModalEditForum(true)}
              className=" text-[#FEFE00] cursor-pointer"
              sx={{ fontSize: 28 }}
            />
          </Tooltip>
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
      {openModalEditForum && (
        <ModalEditForum
          forum={null}
          open={openModalEditForum}
          setOpen={setOpenModalEditForum}
          handleAction={handleAddForum}
          isLoading={isLoading}
        />
      )}
    </>
  )
}

export default Header
