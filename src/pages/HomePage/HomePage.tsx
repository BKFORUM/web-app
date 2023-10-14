import { FC } from 'react'

interface Props {}

const HomePage: FC<Props> = (): JSX.Element => {
  return (
    <div className="grid grid-cols-10 pt-6 flex-1">
      <div className="col-span-8 mx-24">hahaha</div>
      <div className="bg-purple-300 col-span-2">bbbbb</div>
    </div>
  )
}

export default HomePage
