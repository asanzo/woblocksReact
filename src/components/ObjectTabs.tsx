import { Tab, Tabs } from "@material-ui/core"
import WollokIcon from "./WollokIcon"
import { Whatshot as WhatshotIcon } from '@material-ui/icons'
import AddObjectDialogButton from "./AddObjectDialogButton"
import { AppState } from "../App"
import { WollokObject } from "../models/WollokObject"

type ObjectTabsProps = {
    appState: AppState
}

export default function ObjectTabs ({appState}: ObjectTabsProps) {

    type ObjectTabProps = {
        wollokObject: WollokObject,
        selected?: boolean
    }
    
    const ObjectTab = ({wollokObject, selected}: ObjectTabProps) => <>
        <Tab icon={<WhatshotIcon />} />
        selected && <AddObjectDialogButton 
            onEditObject={(wollokObject) => appState.updateWollokObject(wollokObject)}
        />
    </>

    return <>
        <Tabs variant="scrollable">
            <Tab icon={<WollokIcon />} />
            {appState.wollokObjects.map( wo => <ObjectTab wollokObject={wo} />)}
        </Tabs>
        <AddObjectDialogButton 
            onNewObject={(wollokObject) => appState.addWollokObject(wollokObject)}
        />
    </>
    
}