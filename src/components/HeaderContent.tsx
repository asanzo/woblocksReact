import AppBar from '@material-ui/core/AppBar'
import React from 'react'
import PlayDialogButton from './PlayDialogButton'

export function HeaderContent() {
    // TODO: use pallete
    return <AppBar position="static">
        <PlayDialogButton/>
    </AppBar>
}