import { Tab, Tabs } from "@material-ui/core"
import WollokIcon from "./WollokIcon"
import AddObjectDialogButton from "./AddObjectDialogButton"
import { WollokObject } from "../models/WollokObject"
import { useState } from "react"
import { Whatshot } from "@material-ui/icons"

export default function ObjectTabs () {
    const mainTab = new WollokObject("stub", WollokIcon)
    const wollokObjs = [mainTab, new WollokObject("fueguito", Whatshot)] // TODO: this is an example, should be taken from global state
    const [currentTabId, setCurrentTabId] = useState(mainTab.id()) // TODO: probably this should be global state

    const onTabSelected = (event: React.ChangeEvent<{}>,tabId: string) => {
        setCurrentTabId(tabId)
    }

    return <>
        <Tabs 
            value={currentTabId}
            onChange={onTabSelected}
            variant="scrollable"
        >
            {wollokObjs.map( wollokObject => 
                <Tab 
                    value={wollokObject.id()}
                    icon={<wollokObject.Icon/>} 
                    key={wollokObject.id()}
                />
            )}
        </Tabs>
        <AddObjectDialogButton />
    </>  
}