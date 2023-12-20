import { FC, Fragment, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { INotificationSetting } from '@interfaces/INotify'
import { ActionCreator, useStoreActions, useStoreState } from 'easy-peasy'
import { dayComparedToThePast } from '@utils/functions/formatDay'
import default_forum from '../../assets/images/default_forum.png'
import { conversationActionSelector, userStateSelector } from '@store/index'
import { useNavigate } from 'react-router-dom'

interface Props {
  notifyRealtime: INotificationSetting
  setNotifyRealtime: ActionCreator<INotificationSetting>
}

const NotifyRealtime: FC<Props> = ({
  notifyRealtime,
  setNotifyRealtime,
}: Props): JSX.Element => {
  const navigate = useNavigate()
  const { listFriendOnline } = useStoreState(userStateSelector)
  const { setIsReadConversation, setCurrentConversation } = useStoreActions(
    conversationActionSelector,
  )
  useEffect(() => {
    let countTimeout: any
    if (notifyRealtime.show) {
      countTimeout = setTimeout(() => {
        setNotifyRealtime({ show: false, type: notifyRealtime.type })
      }, 10000)
    } else {
      clearTimeout(countTimeout)
    }

    return () => {
      clearTimeout(countTimeout)
    }
  }, [notifyRealtime.show])

  return (
    <>
      <div
        aria-live="assertive"
        className={`z-50 pointer-events-none fixed bottom-2 ${
          notifyRealtime.type === 'notify'
            ? 'left-2 min-w-[200px] max-w-[380px]'
            : 'right-2 min-w-[450px] max-w-[550px]'
        }
          flex items-end px-4 py-6 sm:items-start sm:p-6`}>
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={notifyRealtime.show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom={`translate-y-2 opacity-0 ${
              notifyRealtime.type === 'notify' ? 'translate-x-[-20px]' : 'translate-x-2'
            }`}
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-base">
                    New {notifyRealtime.type === 'notify' ? 'notification' : 'message'}{' '}
                  </h4>
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      setNotifyRealtime({ show: false, type: notifyRealtime.type })
                    }}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                {notifyRealtime.type === 'notify' &&
                  notifyRealtime.notify !== undefined && (
                    <div className="relative flex-1 pt-0.5 flex gap-2 items-center">
                      {notifyRealtime.notify?.sender && (
                        <div className="h-12 w-12 overflow-hidden flex-shrink-0">
                          <img
                            className="w-full h-full rounded-full border border-gray-500"
                            src={notifyRealtime.notify?.sender.avatarUrl}
                            alt={notifyRealtime.notify?.sender.fullName}
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium text-gray-900 flex-1 max-w-[90%]">
                          <span>{notifyRealtime.notify?.sender?.fullName} </span>
                          {notifyRealtime.notify?.content}
                        </p>
                        <span className={`text-xs font-semibold text-blue-500`}>
                          {dayComparedToThePast(notifyRealtime.notify?.createdAt || '')}
                        </span>
                      </div>

                      <span
                        title="not read"
                        className="flex flex-shrink-0 ml-auto absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 border border-white w-[10px] h-[10px] rounded-full"></span>
                    </div>
                  )}

                {notifyRealtime.type === 'message' &&
                  notifyRealtime.message !== undefined && (
                    <li
                      onClick={() => {
                        navigate('/message/' + notifyRealtime?.message?.conversationId)
                        setCurrentConversation(
                          notifyRealtime?.message?.conversation || null,
                        )
                        setIsReadConversation(
                          notifyRealtime?.message?.conversationId || '',
                        )
                        setNotifyRealtime({ show: false, type: notifyRealtime.type })
                      }}
                      className={`flex px-2 py-1  transition-all duration-200 rounded-md cursor-pointer
                `}>
                      <a className="relative flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-full border border-gray-700 bg-gray-700 object-cover mr-2 "
                          src={
                            notifyRealtime?.message?.conversation?.avatarUrl ||
                            default_forum
                          }
                          alt="avatar"
                        />
                        {notifyRealtime?.message?.conversation?.type === 'CHAT' &&
                          listFriendOnline !== undefined &&
                          listFriendOnline.some(
                            (user) => user.id === notifyRealtime?.message?.author.id,
                          ) && (
                            <span
                              title="online"
                              className="flex ml-auto flex-shrink-0 absolute bottom-1 right-1.5 bg-green-500 border border-white w-[11px] h-[11px] rounded-full"></span>
                          )}
                      </a>
                      <div className="flex flex-col w-full ">
                        <span className="font-semibold whitespace-nowrap truncate ">
                          {notifyRealtime?.message?.conversation?.displayName}
                        </span>
                        <div
                          className={`flex items-center gap-2 ${
                            // !notifyRealtime?.message?.isRead &&
                            'font-semibold'
                          }`}>
                          <span
                            className={` text-sm max-w-[200px] break-words truncate `}>
                            {notifyRealtime?.message?.conversation?.type ===
                              'GROUP_CHAT' && (
                              <span>
                                {notifyRealtime.message.author.displayName ||
                                  notifyRealtime.message.author.fullName}
                                :
                              </span>
                            )}
                            {notifyRealtime?.message?.content}
                          </span>
                          <span className=" text-xs">
                            {/* {notifyRealtime?.message?.lastMessage &&
                            dayComparedToThePast(
                              notifyRealtime?.message.lastMessage.createdAt,
                            )} */}
                            vừa xong
                          </span>
                        </div>
                      </div>

                      <span
                        title="not read"
                        className="flex ml-auto flex-shrink-0  transform translate-y-[18px] bg-blue-500 border border-white w-[10px] h-[10px] rounded-full"></span>
                    </li>
                  )}
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  )
}

export default NotifyRealtime
