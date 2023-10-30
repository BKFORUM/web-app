import Header from '@layouts/components/Header'
import { FC } from 'react'

interface Props {
  children: React.ReactNode
}

const ProfileLayout: FC<Props> = ({ children }: Props): JSX.Element => {
  return (
    <div className=" min-h-screen wrapper overflow-x-hidden flex flex-col">
      <Header />
      <div className="mt-[60px] flex-1 flex flex-col">
        <main className="flex-1 bg-gray-100 ">{children}</main>
      </div>
    </div>
  )
}

export default ProfileLayout
