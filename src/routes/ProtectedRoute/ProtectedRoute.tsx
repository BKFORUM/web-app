import { Navigate } from 'react-router-dom'

interface IProps {
  children: JSX.Element
}

function ProtectedRoute(props: IProps): JSX.Element {
  const user = localStorage.getItem('user')
  if (user === null) {
    return <Navigate to='/login' />
  }

  return props.children
}

export default ProtectedRoute
