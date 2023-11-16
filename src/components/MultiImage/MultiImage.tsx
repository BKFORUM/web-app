import { useDropzone } from 'react-dropzone'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface IMultiImage {
  listImage: any
  InputRef?: any
  deleteImage?: (image: any) => void
  handleFileChange?: (e: any) => void
  single: boolean
  loading?: boolean
}

const MultiImage = ({
  listImage,
  single,
  deleteImage,
  handleFileChange,
  InputRef,
  loading,
}: IMultiImage) => {
  const [maxItem] = useState(5)
  const [hiddenBtnAdd, setHiddenBtnAdd] = useState<any>('')

  useEffect(() => {
    _checkMaxItem()
  }, [listImage])

  const onDrop = (acceptedFiles: any) => {
    handleFileChange && handleFileChange(acceptedFiles)
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.png'],
    },
    onDrop,
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const _checkMaxItem = () => {
    if (listImage?.length >= maxItem) setHiddenBtnAdd('hidden')
    else setHiddenBtnAdd('')
  }
  return (
    <div>
      <div
        className={`cursor-pointer group mb-2`}
        {...getRootProps({
          onClick: (e: any) => handleClick(e),
        })}>
        {listImage.length > 0 && single === false && (
          <div className="absolute top-1 left-1/2 -translate-x-1/2">
            <button
              className="bg-amber-400 text-white px-4 py-0.5 rounded-md"
              onClick={() => InputRef.current.click()}>
              Thêm ảnh
            </button>
            <input
              type="file"
              {...getInputProps()}
              multiple={!single}
              ref={InputRef}
              className="hidden"
            />
          </div>
        )}
        {(listImage.length == 0 || loading) && (
          <div className="rounded border-gray-300  gap-4">
            <div
              className={`${hiddenBtnAdd} relative w-full h-auto object-cover aspect-[3/2] rounded-md border-2 border-dashed border-amber-400 bg-[#fef9ee] flex justify-center items-center select-none`}>
              <button
                style={{ opacity: 0.8 }}
                className={`bg-amber-400 rounded group-hover:block hover:bg-primary-500 border-primary-400 px-1 py-1 bg-primary-400 cursor-pointer text-white font-bold`}
                onClick={() => InputRef.current.click()}>
                {loading ? (
                  <div className="flex">
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="m-auto inline w-4 h-4  text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                ) : (
                  <PlusIcon
                    strokeWidth={2.5}
                    className="w-10 h-10"
                  />
                )}
              </button>
              <input
                type="file"
                {...getInputProps()}
                multiple={!single}
                ref={InputRef}
                className="hidden"
              />
              <label
                className={`absolute bottom-2 text-blueGray-600 text-[1rem] md:text-sm text-start`}>
                Thêm ảnh
              </label>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 gap-2">
          {!loading &&
            listImage.map((image: any, i: number) => (
              <div
                key={i}
                className="relative">
                <span
                  className={`absolute rounded-full right-3 text-sm z-[1] cursor-pointer top-3 py-1 px-1 bg-red-400 hover:bg-red-500 text-white font-bold`}
                  onClick={(event: any) => {
                    event.stopPropagation()
                    deleteImage && deleteImage(image)
                  }}>
                  <XMarkIcon className="w-5 h-5 rounded-full" />
                </span>
                <div
                  className={`${
                    single === true ? 'w-full h-[200px]' : 'h-[300px] w-full'
                  }`}>
                  <img
                    alt="not found"
                    className={`object-contain rounded-md border border-gray-300 h-full w-full `}
                    src={image.fileUrl}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default MultiImage
