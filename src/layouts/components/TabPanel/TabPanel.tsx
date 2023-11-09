import Box from '@mui/material/Box'

interface IProps {
  children: JSX.Element | JSX.Element[]
  value: any
  index: any
}

export default function TabPanel({ children, value, index, ...other }: IProps) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}
