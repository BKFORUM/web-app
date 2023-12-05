import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {}

const NotFound: FC<Props> = (): JSX.Element => {
  const navigate = useNavigate()
  return (
    <section className="bg-white ">
      <div className=" flex items-center min-h-screen px-6 py-12 justify-center">
        <div>
          <p className="text-xl font-medium text-blue-500 ">404 error</p>
          <h1 className="mt-3 text-5xl font-semibold text-gray-800">
            We can not find that page
          </h1>
          <p className="mt-4 text-gray-500 text-2xl">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          <div className="flex items-center mt-6 gap-x-3">
            <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto  hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5 rtl:rotate-180">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>
              <span onClick={() => navigate(-1)}>Go back</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 ">
              Take me home
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound
