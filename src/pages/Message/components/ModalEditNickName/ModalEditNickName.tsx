import { Dialog, Transition } from '@headlessui/react'
import { conversationActionSelector, conversationStateSelector } from '@store/index'
import { useStoreActions, useStoreState } from 'easy-peasy'
import { HiPencilSquare, HiCheck } from 'react-icons/hi2'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { IConversation } from '@interfaces/IConversation'

interface Props {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalEditNickName: FC<Props> = ({ open, setOpen }: Props): JSX.Element => {
  const { currentConversation } = useStoreState(conversationStateSelector)
  const { editNickNameMember, setIsGetAllMessagesAgain, setCurrentConversation } =
    useStoreActions(conversationActionSelector)

  const [itemSelected, setItemSelected] = useState<null | number>(null)
  const currentConversationRef = useRef(currentConversation)
  const [value, setValue] = useState<string>('')

  const handleEditNickName = async (id: string) => {
    const res = await editNickNameMember({
      conversationId: currentConversation?.id,
      userId: id,
      displayName: value,
    })

    if (res) {
      const updateUser = currentConversation?.users.map((user) =>
        user.userId === id ? { ...user, displayName: value } : user,
      )
      const upDateConversation = {
        ...currentConversation,
        users: updateUser,
      } as IConversation
      setCurrentConversation(upDateConversation)
      setItemSelected(null)
    }
  }
  useEffect(() => {
    currentConversationRef.current = currentConversation
  }, [currentConversation])
  useEffect(() => {
    return () => {
      if (currentConversation !== currentConversationRef.current) {
        setIsGetAllMessagesAgain(true)
      }
    }
  }, [])
  return (
    <div>
      <Transition
        appear
        show={open}
        as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="relative w-full max-w-md flex flex-col transform  rounded-xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-col gap-2 relative">
                    <h2 className="m-auto text-xl font-semibold">Biệt danh</h2>
                    <span
                      className="absolute top-0 right-0 text-xl text-gray-500 cursor-pointer"
                      onClick={() => setOpen(false)}>
                      X
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 mt-4 max-h-[400px] overflow-y-auto">
                    {currentConversation?.users.map((user, index) => (
                      <div
                        onClick={() => {
                          setItemSelected(index)
                          setValue(user.displayName || '')
                        }}
                        className="flex justify-between items-center gap-2">
                        <div className="flex gap-3 flex-1">
                          <div className="h-12 w-12 overflow-hidden">
                            <img
                              className="h-full w-full rounded-full border border-gray-300"
                              src={user.user.avatarUrl}
                              alt="avatar"
                            />
                          </div>

                          {itemSelected === index ? (
                            <div className="w-full flex-1 my-auto">
                              <input
                                className="w-full px-3 py-1 border border-blue-600 outline-none rounded-md"
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={!user.displayName ? user.user.fullName : ''}
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                {user.displayName || user.user.fullName}{' '}
                              </span>
                              <span className="text-sm  text-gray-600">
                                {!user.displayName ? 'Đặt biệt danh' : user.user.fullName}{' '}
                              </span>
                            </div>
                          )}
                        </div>
                        {itemSelected === index ? (
                          <HiCheck
                            onClick={() => handleEditNickName(user.userId)}
                            className="cursor-pointer h-5 w-5 hover:text-green-600"
                          />
                        ) : (
                          <HiPencilSquare className="cursor-pointer h-5 w-5 hover:text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default ModalEditNickName
