import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import SendIcon from '@material-ui/icons/Send'
import { useState } from 'react'

export default function PlayDialogButton(){
    const [isOpen, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return <>
        <IconButton aria-label="Ejecutar el programa" onClick={handleOpen}>
            <SendIcon />
        </IconButton>
        <Dialog fullScreen open={isOpen} onClose={handleClose} >

        </Dialog>
    </>
}
