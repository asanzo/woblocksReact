import { Toolbar, AppBar, Typography } from '@material-ui/core'
import { AppState } from '../App'
import ObjectTabs from './ObjectTabs'
import PlayDialogButton from './PlayDialogButton'

export function HeaderContent({appState}:{appState: AppState}) {
    // TODO: use pallete
    return <AppBar position="static">
        <Toolbar>
            <Typography variant="h5">Woblocks</Typography>
            <ObjectTabs appState={appState}/>
            <PlayDialogButton/>
        </Toolbar>
    </AppBar>
}