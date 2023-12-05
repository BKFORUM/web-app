import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, useEffect, useState } from 'react'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import { Box, StepLabel } from '@mui/material'
import InfoGroupChat from './components/InfoGoupChat'
import { styled } from '@mui/material/styles'
import AddMember from './components/AddMember'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@components/Button'
import { useStoreActions, useStoreState } from 'easy-peasy'
import {
  conversationActionSelector,
  conversationStateSelector,
  notifyActionSelector,
} from '@store/index'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { StepIconProps } from '@mui/material/StepIcon'
import SettingsIcon from '@mui/icons-material/Settings'
import GroupAddIcon from '@mui/icons-material/GroupAdd'

interface Props {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 16,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to top, #00c6fb 0%, #005bea 100%);',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient(to top, #00c6fb 0%, #005bea 100%);',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}))

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient(to top, #00c6fb 0%, #005bea 100%);',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient(to top, #00c6fb 0%, #005bea 100%);',
  }),
}))

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  const icons: { [index: string]: React.ReactElement } = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
  }

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  )
}

interface IDataAddGroup {
  displayName: string
  avatarUrl: string
  userIds: string[]
}

const defaultValues: IDataAddGroup = {
  displayName: '',
  avatarUrl: '',
  userIds: [],
}

const schema = yup.object().shape({
  displayName: yup.string().required('Email is required'),
  avatarUrl: yup.string().required('AvatarUrl is required'),
  userIds: yup
    .array()
    .min(1, 'At least one userId is required')
    .required('userIds is required'),
})

const steps = ['Information group', 'Add member on group']

const ModalAddGroupChat: FC<Props> = ({ open, setOpen }: Props): JSX.Element => {
  const { addConversation, setIsAddConversationSuccess, setListConversation } =
    useStoreActions(conversationActionSelector)
  const { setNotifySetting } = useStoreActions(notifyActionSelector)
  const { messageError, isAddConversationSuccess, listConversation } = useStoreState(
    conversationStateSelector,
  )
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<IDataAddGroup>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const res = await addConversation(data)
    if (res) {
      setNotifySetting({
        show: true,
        status: 'success',
        message: 'Add group successfully',
      })
      setListConversation([res, ...listConversation])
      setOpen(false)
    }

    setIsLoading(false)
  }

  const handleNext = async () => {
    let isValid = false

    switch (activeStep) {
      case 0: {
        isValid = await trigger(['displayName', 'avatarUrl'])
        break
      }

      case 1: {
        isValid = await trigger('userIds')
        break
      }
    }
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  useEffect(() => {
    if (!isAddConversationSuccess) {
      setNotifySetting({
        show: true,
        status: 'error',
        message: messageError,
      })
      setIsAddConversationSuccess(true)
    }
  }, [isAddConversationSuccess])

  return (
    <div>
      <Transition
        appear
        show={open}
        as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={() => setOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="relative w-full max-w-[600px] min-h-[200px] flex flex-col transform  rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center shadow py-3 ">
                    Tạo đoạn chat
                  </Dialog.Title>
                  <div className="mt-4 flex-1">
                    <Stepper
                      activeStep={activeStep}
                      alternativeLabel
                      connector={<ColorlibConnector />}>
                      {steps.map((label) => (
                        <Step key={label}>
                          <StepLabel StepIconComponent={ColorlibStepIcon}>
                            {label}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>

                    <form onSubmit={handleSubmit(onSubmit)}>
                      {activeStep === 0 && (
                        <InfoGroupChat
                          control={control}
                          setValue={setValue}
                          clearErrors={clearErrors}
                          watch={watch}
                        />
                      )}

                      {activeStep === 1 && (
                        <AddMember
                          setValue={setValue}
                          errors={errors}
                        />
                      )}

                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          pb: 2,
                          px: 2,
                        }}>
                        <Button
                          typeButton="cancel"
                          disabled={activeStep === 0}
                          onClick={handleBack}>
                          Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {activeStep < steps.length - 1 && (
                          <Button onClick={handleNext}>Next</Button>
                        )}
                        {activeStep === steps.length - 1 && (
                          <Button
                            disabled={isLoading}
                            loading={isLoading}
                            type="submit">
                            Finish
                          </Button>
                        )}
                      </Box>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default ModalAddGroupChat
