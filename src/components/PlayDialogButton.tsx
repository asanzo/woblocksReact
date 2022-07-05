import { Send as SendIcon } from '@material-ui/icons'
import DialogButton from './DialogButton'

export default function PlayDialogButton(){
    return <DialogButton 
        title="Wollok Game"
        tooltip="Ejecutar"
        Icon={SendIcon}
        dialogProps={{fullScreen: true}}
    >
        Soy Wollok game
    </DialogButton>
}
