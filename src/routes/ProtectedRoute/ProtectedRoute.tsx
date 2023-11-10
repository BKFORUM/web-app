import { Navigate } from 'react-router-dom'

interface IProps {
  children: JSX.Element
}

function ProtectedRoute(props: IProps): JSX.Element {
  const auth = localStorage.getItem('auth')
  if (auth === null) {
    return <Navigate to="auth/login" />
  }

  return props.children
}

export default ProtectedRoute
