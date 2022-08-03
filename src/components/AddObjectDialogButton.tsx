import { IconButton } from '@material-ui/core'
import { Add as AddIcon, Edit as EditIcon, Done as DoneIcon } from '@material-ui/icons'
import { useState } from 'react'
import { WollokObject } from '../models/WollokObject'
import DialogButton from './DialogButton'

type AddObjectDialogButtonProps = {
    wollokObject?: WollokObject
    onEditObject?: (o?: WollokObject)=>void // If filled, means that dialog is editing existing object. 
    onNewObject?: (o: WollokObject)=>void // If filled, means that dialog is creating new object.
}

export default function AddObjectDialogButton( {wollokObject, onNewObject, onEditObject}: AddObjectDialogButtonProps){
    const [wObject, setWObject] = useState(wollokObject)

    const handleAccept = () => {
        onNewObject ? onNewObject(wObject!) : onEditObject!(wObject)
    }

    return <DialogButton 
        title={(onNewObject ? "Añadir" : "Editar") + " objeto"}
        tooltip={(onNewObject ? "Añadir" : "Editar") + " objeto"}
        Icon={onNewObject ? AddIcon : EditIcon}
        moreHeaders={
            <IconButton edge="end" color="inherit" onClick={handleAccept} aria-label="Cerrar">
                <DoneIcon />
            </IconButton>
        }
    >
        Añadir/Editar objeto
    </DialogButton>
}
