import MultiImage from '@components/MultiImage'
import TextFieldV2 from '@components/TextFieldV2'
import { Image } from '@pages/Profile/components/ModalEditUser/ModalEditUser'
import { postActionSelector } from '@store/index'
import { useStoreActions } from 'easy-peasy'
import { FC, useEffect, useRef, useState } from 'react'
import { Controller } from 'react-hook-form'

interface Props {
  control: any
  setValue: any
  clearErrors: any
  watch: any
}

const InfoGroupChat: FC<Props> = ({
  control,
  setValue,
  clearErrors,
  watch,
}: Props): JSX.Element => {
  const { postImage } = useStoreActions(postActionSelector)
  const ImageRef: any = useRef()
  const [Images, setImages] = useState<Image[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const _deleteImage = () => {
    setImages([])
    setValue('avatarUrl', '')
  }

  const valueName = watch('displayName')
  const valueAvatarUrl = watch('avatarUrl')

  useEffect(() => {
    if (valueAvatarUrl !== '') {
      const Image = [
        {
          name: valueName || 'avatar',
          fileUrl: valueAvatarUrl,
        },
      ]
      setImages(Image)
    }
  }, [])

  useEffect(() => {
    if (valueName !== '') {
      clearErrors('displayName')
    }
    if (valueAvatarUrl !== '') {
      clearErrors('avatarUrl')
    }
  }, [valueName, valueAvatarUrl])

  const getUrlImage = async (file: any): Promise<void> => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append(`documents`, file[0])
    const resImage = await postImage(formData)
    if (resImage) {
      setValue('avatarUrl', resImage[0].fileUrl)
    }
    setIsLoading(false)
  }

  const handleFileChange = (file: any) => {
    getUrlImage(file)
    const newFiles: any = Array.from(file)
    let newImages = [...newFiles]
    const newImagePreview: any = newImages.map((fileImage: any) => {
      if (fileImage.size) {
        return {
          name: fileImage.name.split('.')[0],
          fileUrl: URL.createObjectURL(fileImage),
        }
      }
      return fileImage
    })
    setImages(newImagePreview)
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="flex flex-col">
        <label
          htmlFor=""
          className="font-semibold text-gray-700">
          Name <span className="text-red-600">*</span>
        </label>
        <Controller
          name="displayName"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextFieldV2
              error={error}
              onChange={onChange}
              value={value}
            />
          )}
        />
      </div>

      <div className="max-w-[60%]">
        <label
          htmlFor=""
          className="font-semibold text-gray-700">
          Avatar<span className="text-red-600">*</span>
        </label>
        <Controller
          name="avatarUrl"
          control={control}
          render={({ field: {}, fieldState: { error } }) => (
            <>
              <MultiImage
                single={true}
                listImage={Images}
                deleteImage={_deleteImage}
                handleFileChange={handleFileChange}
                InputRef={ImageRef}
                loading={isLoading}
              />
              {error && <span className="text-red-600 text-sm">{error?.message}</span>}
            </>
          )}
        />
      </div>
    </div>
  )
}

export default InfoGroupChat
