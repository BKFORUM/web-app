import { Text } from '@components/Text'
import './App.css'
import { IClient } from '@interfaces/IClient'

interface IProps {
  clients: IClient[]
}
function App({ clients }: IProps) {
  return (
    <>
      <div className="text-5xl">Cuong oi là cương</div>
      <Text clients={clients} />
    </>
  )
}

export default App
