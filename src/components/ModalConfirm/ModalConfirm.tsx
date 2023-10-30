import ClearIcon from '@mui/icons-material/Clear'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  borderRadius: '0.5rem',
  border: '0.0625rem solid #d1d7e0',
  boxShadow: 24,
  p: 1,
  pt: 0.5,
}

interface IProps {
  open: boolean
  handleClose: React.Dispatch<React.SetStateAction<boolean>>
  handleDelete: () => Promise<void>
}

export default function ModalConfirm({ open, handleClose, handleDelete }: IProps) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={style}
          className="modal-delete">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ClearIcon
              sx={{ cursor: 'pointer' }}
              onClick={() => handleClose(false)}
            />
          </Box>

          <Box>
            <Typography
              id="modal-modal-title"
              sx={{ textAlign: 'center' }}
              variant="h6"
              component="h2">
              Are you sure you want to delete?
            </Typography>
            <Box
              id="modal-modal-description"
              sx={{
                mt: 2,
                mb: 1,
                display: 'flex',
                gap: 3,
                justifyContent: 'center',
                '& .MuiButtonBase-root': {
                  minWidth: '50px',
                  lineHeight: 1.25,
                },
              }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#262b40',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#262b40', opacity: 0.8 },
                }}
                onClick={handleDelete}>
                YES
              </Button>
              <Button
                sx={{
                  borderColor: '#262b40',
                  fontWeight: 600,
                  color: '#262b40',
                  '&:hover': {
                    borderColor: '#262b40',
                    opacity: 0.8,
                  },
                }}
                variant="outlined"
                onClick={() => handleClose(false)}>
                NO
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
