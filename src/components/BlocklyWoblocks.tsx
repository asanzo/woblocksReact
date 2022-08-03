import { useState } from 'react'
import { BlocklyWorkspace } from 'react-blockly'
import woblocksControl from '../models/woblocksControl'
import Blockly from 'blockly'

export default function BlocklyWoblocks() {
  const [xml, setXml] = useState("");
  const toolbox = Blockly.utils.toolbox.convertToolboxDefToJson(woblocksControl.getMainToolboxXmlString())

  return (
    <BlocklyWorkspace
      className="blocklyCanvas"
      toolboxConfiguration={toolbox!}
      workspaceConfiguration={{ 
        collapse : true, 
        comments : true, 
        disable : true, 
        maxBlocks : Infinity, 
        trashcan : true, 
        horizontalLayout : false, 
        toolboxPosition : 'start', 
        css : true, 
        media : 'https://blockly-demo.appspot.com/static/media/', 
        rtl : false, 
        scrollbars : true, 
        sounds : true, 
        oneBasedIndex : true
      }}
      initialXml={xml}
      onXmlChange={setXml}
    />
  )
}
