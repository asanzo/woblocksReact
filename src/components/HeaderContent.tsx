import { Toolbar, AppBar, Typography } from '@material-ui/core'
import ObjectTabs from './ObjectTabs'
import PlayDialogButton from './PlayDialogButton'

export function HeaderContent() {
    // TODO: use pallete
    return <AppBar position="static">
        <Toolbar>
            <Typography variant="h5">Woblocks</Typography>
            <ObjectTabs />
            <PlayDialogButton/>
        </Toolbar>
    </AppBar>
}