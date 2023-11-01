import { useDropzone } from 'react-dropzone'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface IMultiImage {
  classNameWrapper?: string
  listImage: any
  InputRef?: any
  disable?: boolean
  deleteImage?: (image: any) => void
  handleFileChange?: (e: any) => void
  error?: boolean
  numberItem?: number
  single: boolean
  id?: any
  // isRequired?: boolean
  // classNameLabel?: any
  // label?: any
}

// const _checkHidden = (disable: boolean) => {
//   return disable ? 'hidden' : ''
// }

const MultiImage = ({
  listImage,
  single,
  deleteImage,
  handleFileChange,
  InputRef,
}: // disable,
// numberItem,
// isRequired,
// classNameLabel,
// ...props
IMultiImage) => {
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
        {listImage.length == 0 && (
          <div className="rounded border-gray-300  gap-4">
            <div
              className={`${hiddenBtnAdd} relative w-full h-auto object-cover aspect-[3/2] rounded-md border-2 border-dashed border-amber-400 bg-[#fef9ee] flex justify-center items-center select-none`}>
              <button
                style={{ opacity: 0.8 }}
                className={`bg-amber-400 rounded group-hover:block hover:bg-primary-500 border-primary-400 px-1 py-1 bg-primary-400 cursor-pointer text-white font-bold`}
                onClick={() => InputRef.current.click()}>
                <PlusIcon
                  strokeWidth={2.5}
                  className="w-10 h-10"
                />
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
          {listImage.map((image: any, i: number) => (
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
