import { AppBar, Dialog, DialogProps, IconButton, IconButtonProps, Toolbar, Typography } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import { ReactNode, useState } from 'react'

type DialogButtonProps = {
    Icon: typeof CloseIcon,
    title: string,
    tooltip: string,
    children: ReactNode,
    moreHeaders?: ReactNode,
    buttonProps?: IconButtonProps,
    dialogProps?: Partial<DialogProps>
}

export default function DialogButton({Icon, title, tooltip, children, moreHeaders, buttonProps, dialogProps}: DialogButtonProps){
    const [isOpen, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return <>
        <IconButton {...buttonProps} color="inherit" aria-label={tooltip} onClick={handleOpen}>
            <Icon />
        </IconButton>
        <Dialog {...dialogProps} open={isOpen} onClose={handleClose}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="Cerrar">
                        <CloseIcon />
                    </IconButton>
                    <Typography>{title}</Typography>
                    {moreHeaders}
                </Toolbar>
            </AppBar>
            {children}
        </Dialog>
    </>
}