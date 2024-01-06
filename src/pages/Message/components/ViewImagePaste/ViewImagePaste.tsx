import { FC } from 'react'

interface Props {
  imageFile: null | File
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>
}

const ViewImagePaste: FC<Props> = ({ imageFile, setImageFile }: Props): JSX.Element => {
  return (
    <div className="h-full w-full relative">
      <img
        className="h-full w-full border border-gray-200 object-contain rounded-md"
        src={(imageFile && URL.createObjectURL(imageFile)) || ''}
        alt="image"
      />
      <span
        onClick={() => setImageFile(null)}
        className="absolute top-1 right-2 text-red-500 cursor-pointer">
        X
      </span>
    </div>
  )
}

export default ViewImagePaste
