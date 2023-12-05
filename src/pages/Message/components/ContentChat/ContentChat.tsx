import { pageMode } from '@interfaces/IClient'
import { IMessage } from '@interfaces/IConversation'
import { FC } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import imgVT from '../../../../assets/images/ingVT.png'
import { formatDateLocalV2 } from '@utils/functions/formatDay'
import { Tooltip } from '@mui/material'
import { useStoreState } from 'easy-peasy'
import { userStateSelector } from '@store/index'

interface Props {
  data: IMessage[]
  checkNext: boolean
  setPaginationModel: React.Dispatch<React.SetStateAction<pageMode | null>>
  totalRowCount: number
  heightContent?: number
  loading: boolean
  paginationModel: pageMode | null
}

const ContentChat: FC<Props> = ({
  data,
  checkNext,
  setPaginationModel,
  totalRowCount,
  heightContent,
  loading,
  paginationModel,
}: Props): JSX.Element => {
  const { currentUserSuccess } = useStoreState(userStateSelector)
  return (
    <InfiniteScroll
      dataLength={data.length}
      next={() => {
        if (checkNext) {
          setPaginationModel((prevPaginationModel) => ({
            page: prevPaginationModel ? prevPaginationModel.page + 1 : 0,
            pageSize: 10,
          }))
        }
      }}
      hasMore={data.length !== totalRowCount}
      height={heightContent !== undefined ? heightContent : '0'}
      loader={<div>{loading && <span>Loading...</span>}</div>}
      style={{ display: 'flex', flexDirection: 'column-reverse' }}
      inverse={true}
      endMessage={
        <div>
          {data.length === totalRowCount && data.length === 0 && paginationModel && (
            <div>
              <div className="flex justify-center ">
                <img
                  className=" h-32 w-32 animate-[wiggle_1s_ease-in-out_infinite]"
                  src={imgVT}
                  alt="Vẫy tay"
                />
              </div>
              <p
                style={{
                  textAlign: 'center',
                  marginBottom: 16,
                }}>
                <b>Hãy là người bắt đầu cuộc trò chuyện</b>
              </p>
            </div>
          )}
          {/* {paginationModel && !loading && data.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className="h-40 w-40">
                            <img
                              className="h-full w-full"
                              src={notFoundSearch}
                              alt="not found search"
                            />
                          </div>
                          <span className="font-medium">
                            We're sorry. We were not able to find a match
                          </span>
                        </div>
                      )} */}
          {data.length === totalRowCount && data.length > 0 && paginationModel && (
            <p style={{ textAlign: 'center', marginTop: 12 }}>
              <b>Đúng! Bạn đã nhìn thấy tất cả tin nhắn</b>
            </p>
          )}
        </div>
      }
      scrollableTarget="scrollableDivContentChat">
      {data.map((item, index) => (
        <div
          id={item.id}
          key={index}
          className="flex flex-col px-2">
          <div
            className={`flex gap-2 my-1.5  ${
              item.author.id === currentUserSuccess?.id ? ' ml-auto' : 'mr-auto'
            }`}>
            {item.author.id !== currentUserSuccess?.id && (
              <div className="mt-auto">
                <div className="h-8 w-8 overflow-hidden">
                  <img
                    className="h-full w-full rounded-3xl border border-gray-200"
                    src={item.author.avatarUrl}
                    alt={item.author.fullName}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-1 text-xs">
              {item.author.id !== currentUserSuccess?.id && (
                <span>{item.author.displayName || item.author.fullName}</span>
              )}
              <Tooltip title={formatDateLocalV2(item.createdAt)}>
                <div className="flex max-w-[700px] ">
                  <span
                    className={`text-base px-2.5 py-0.5 break-words ${
                      item.author.id === currentUserSuccess?.id
                        ? 'bg-blue-400 text-white'
                        : 'bg-gray-100 text-black'
                    } rounded-2xl`}>
                    {item.content}
                  </span>
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </InfiniteScroll>
  )
}

export default ContentChat
