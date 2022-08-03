import Blockly from 'blockly';
import './woblocks_blocks'

var woblocksControl = {};
woblocksControl.private = {};
//START
	//INIT
	//CONFIGURE BLOCKLY (Inject options, override click function)
	//LOAD SCENE IF CACHED <LATER>
	//SET AVAILABLE REPRESENTATIONS <HARDCODED AT FIRST>


//INITIALIZATION
woblocksControl.init = function(){
	this.mainSceneInfo = {xml:Blockly.Xml.textToDom('<xml></xml>') };
	
	this.definedObjectsInfo = {};
	this.definedObjectsInfo.objectNames = []; //name list
	this.definedObjectsInfo.objectsInfoMap = {};//Map Name => {definedObjectXmlContent , definedObjectsMappingInfo}
	//definedObjectXmlContent : xml
	//definedObjectsMappingInfo: {representationName,isVIsual}

	this.config = {};
	this.config.wkImages = [];
	this.config.height = 20;
	this.config.width = 20;
	this.config.backgroundImage = null;

	this.representations = [];//names that resolve to icon and sprite

	this.workspace = null;
	
	this.wkGame = null;	
}

woblocksControl.configureBlockly = function(aWorkspaceId, aToolbox){
	
	this.toolbox = aToolbox;

	var options = { 
		toolbox : aToolbox, 
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
	};
	 
	// Inject workspace 
	//this.workspace = Blockly.inject('blocklyDiv', options);
	this.workspace = Blockly.inject(aWorkspaceId, options);

	var clickEventFunction = Blockly.Events.Click;
	Blockly.registry.unregister("event", "click"); 
	Blockly.registry.register("event", "click",
    function(a,b,c){ 
    	var funk = clickEventFunction.bind(this); 
    	funk(a,b,c); 
    	if(c === 'block' && (a.type === 'objetc_create_wk' || woblocksControl.definedObjectsInfo.objectNames.includes(a.type) ) ){
    		if(a.type === 'objetc_create_wk'){
    			woblocksControl.showMessagesOfInWarningTextOf(a,a);
    		} 

    		if(woblocksControl.definedObjectsInfo.objectNames.includes(a.type) ){
				woblocksControl.setMessagesForDefinedObjectNamedInto(a.type, a);    			
    		}
    	}
    });
}


woblocksControl.setRepresentations = function(content, doAppend){
	if(!this.representations){this.representations = [];}
	if(doAppend){
		this.representations = this.representations.concat(content);
	}else{
		this.representations = content;
	}
	this.representations = woblocksControl.private.removeDuplicates(this.representations);
}


//SAVE/LOAD TAB CONTENT

woblocksControl.loadSceneToolbox = function(){
	this.loadToolboxConent(this.getMainToolboxXmlString());
}

woblocksControl.saveSceneXmlContent = function(){
	this.mainSceneInfo.xml = Blockly.Xml.workspaceToDom(this.workspace);
	return true;
}

woblocksControl.loadSceneXmlContent = function(){
	this.workspace.clear();
	if(this.mainSceneInfo.xml){
		Blockly.Xml.appendDomToWorkspace(this.mainSceneInfo.xml,this.workspace);
	}
}



woblocksControl.loadDefinedObjetcToolbox = function(anIndex){
	if(anIndex < 0 || anIndex >= this.definedObjectsInfo.objectNames.length){return false;}
	var objName = this.definedObjectsInfo.objectNames[anIndex];
	this.loadToolboxConent(this.getObjectToolboxXmlString(objName));
}

woblocksControl.saveObjectTabXmlContentWithIndex = function(anIndex){
	if(anIndex < 0 || anIndex >= this.definedObjectsInfo.objectNames.length){return false;}
	
	var objName = this.definedObjectsInfo.objectNames[anIndex];
	this.definedObjectsInfo.objectsInfoMap[objName].xml = Blockly.Xml.workspaceToDom(this.workspace);
	return true;
}

woblocksControl.saveObjectRepresentationInfoWithIndex = function(anIndex, aRepresentationName, representationIsVisual){
	if(anIndex < 0 || anIndex >= this.definedObjectsInfo.objectNames.length){return false;}
	if(!this.representations.includes(aRepresentationName)){return false;}

	var objName = this.definedObjectsInfo.objectNames[anIndex];
	this.definedObjectsInfo.objectsInfoMap[objName].definedObjectsMappingInfo.representationName = aRepresentationName;
	this.definedObjectsInfo.objectsInfoMap[objName].definedObjectsMappingInfo.isVIsual = representationIsVisual;
}

woblocksControl.loadDefinedObjectXmlContent = function(anIndex){
	if(anIndex < 0 || anIndex >= this.definedObjectsInfo.objectNames.length){return false;}

	var objName = this.definedObjectsInfo.objectNames[anIndex];
	this.workspace.clear();
	if(this.definedObjectsInfo.objectsInfoMap[objName].xml){
		Blockly.Xml.appendDomToWorkspace(this.definedObjectsInfo.objectsInfoMap[objName].xml,this.workspace);
	}
	return true;
}

//RUN GAME


woblocksControl.getSceneCodeAsWKString = function(newlineSeparator){
	this.sceneErrorsFound = false;
	var result = {definitions:[],executions:[]};
	var objs = this.getAllParentlessObjects();
	var res;
	var validExecutionTypes = ['executor_wk','var_objetc_wk','instruction_wk','keyboard_event_wk','tick_event_wk','collission_wk','condition_wk'];

	//INITIAL CONFIG
	result.executions.push('game.width('+this.config.width+')'+newlineSeparator);
	result.executions.push('game.height('+this.config.height+')'+newlineSeparator);
	if(this.config.backgroundImage){
		result.executions.push('game.boardGround("'+this.config.backgroundImage+'")'+newlineSeparator);
	}
	for(var i = 0; i < this.definedObjectsInfo.objectNames.length; i++){;
		if(this.definedObjectsInfo.objectsInfoMap[this.definedObjectsInfo.objectNames[i]].definedObjectsMappingInfo.isVisual){
			result.executions.push('game.addVisual("'+this.definedObjectsInfo.objectNames[i]+'")'+newlineSeparator);
		}
	}
	result.executions.push('game.start()'+newlineSeparator);

	//DEFINED OBJECTS
	var tempBlock;
	var newBlockId;
	for(var i = 0; i < this.definedObjectsInfo.objectNames.length; i++){
		newBlockId = Blockly.Xml.domToWorkspace(this.definedObjectsInfo.objectsInfoMap[this.definedObjectsInfo.objectNames[i]].xml , this.workspace)[0];
	  	tempBlock = this.workspace.getBlockById(newBlockId);
	  	tempBlock.initSvg();
		res = Blockly.Wollok['action_start_wk'](tempBlock);
		if(typeof res === 'string'){
			result.definitions.push(res.replaceAll('\n',newlineSeparator));
		}
		tempBlock.dispose();
	}

	//WORKSPACE
	for(var i = 0; i < objs.length && !this.sceneErrorsFound; i++){
		if(Blockly.Wollok[ objs[i].type ] !== undefined){
			
			//EXECUTION
			if(objs[i].type === 'action_start_wk' && objs[i].getNextBlock() !== undefined && objs[i].getNextBlock() !== null && validExecutionTypes.includes(objs[i].getNextBlock().type)){			

				var current = objs[i].getNextBlock();

				while(current !== null){
					if(current.type !== null && validExecutionTypes.includes(current.type)){
						//GET STR CODE
						res = Blockly.Wollok[current.type](current);
							
						//DETECT ERROR
						if(typeof res === 'string'){
							result.executions.push( res.replaceAll('\n','') );
						}else{
							this.sceneErrorsFound = true;
						}
					}

					//CONTINUE ITERATION
					current = current.getNextBlock();
				}
				
			//WORKSPACE OBJECT DEFINITION BLOCKS
			}else if(objs[i].type === 'action_start_wk' && objs[i].getNextBlock() !== undefined && objs[i].getNextBlock() !== null && objs[i].getNextBlock().type === 'objetc_create_wk'){
				//GET CODE
	
				res = Blockly.Wollok[ objs[i].type ](objs[i]);
				
				//DETECT ERROR
				if(typeof res === 'string'){
					//console.log(res);
					result.definitions.push(res.replaceAll('\n',newlineSeparator));
				}else{
					this.sceneErrorsFound = true;
				}
			}
		}
	}


	return result;
}


woblocksControl.runGame = function(gameDiv){
	//CHECK & ALERT IF NO IMAGES? <LATER>
	//FILL GENERATED CODE <LATER>
	//GET SCENE CODE
	var sceneText = this.getSceneCodeAsWKString('\n');
	if(this.sceneErrorsFound){
		//?		
	}else{
		var main = 'main';
		var images = [];/////////////////////////////////////////
		var sounds = [];
		var sources = this.buildSources(sceneText.definitions,sceneText.executions);
		var project = { main, images, sounds, sources };
		this.wkGame = new Game(project);
		this.wkGame.start(gameDiv);
	}

}

woblocksControl.buildSources = function(definitions,executions) {
    
  const name = 'main.wlk'
  var content = `
  import wollok.game.*
  program main { 
  	`+executions.join('\n')+`
  }
  `+definitions.join('\n')+`
  `
  console.log({ content })
  return [{ name, content }]
}


//ADD NEW OBJECT
woblocksControl.addObjectNamed = function(aNewObjectName){
	if(this.definedObjectsInfo.objectNames.includes(aNewObjectName)){return false;}
	this.definedObjectsInfo.objectNames.push(aNewObjectName);
	this.definedObjectsInfo.objectsInfoMap[aNewObjectName] = {xml:Blockly.Xml.textToDom('<xml></xml>'),definedObjectsMappingInfo: {representationName:'',isVIsual:false}};
	return true;
}

woblocksControl.addDefaultObjectXmlToWorkspaceNamed = function(anObjectName){
	this.workspace.clear();
	Blockly.Xml.appendDomToWorkspace( jQuery.parseXML(this.getDefaultWKObjectXmlNamed(anObjectName) ),this.workspace);
}

//REMOVE OBJECT
woblocksControl.removeObjectNamed = function(aNewObjectName){
	if(!this.definedObjectsInfo.objectNames.includes(aNewObjectName)){return false;}
	this.definedObjectsInfo.objectNames.splice(this.definedObjectsInfo.objectNames.indexOf(aNewObjectName),1);
	delete this.definedObjectsInfo.objectsInfoMap[aNewObjectName];
	return true;
}

woblocksControl.removeObject = function(anIndex){
	if(anIndex < 0 || anIndex >= this.definedObjectsInfo.objectNames.length){return false;}
	if(!this.definedObjectsInfo.objectNames.includes(aNewObjectName)){return false;}
	this.definedObjectsInfo.objectNames.splice(this.definedObjectsInfo.objectNames.indexOf(aNewObjectName),1);
	delete this.definedObjectsInfo.objectsInfoMap[aNewObjectName];
	return true;
}

// DEFINED OBJECT TO BLOCKLY

woblocksControl.definedObjectsAsBlocklyBlocks = function(){
	this.definedObjectsInfo.objectNames.map(function(aName){ woblocksControl.createDefinedObjectBlocklyBlock(aName,'iconsIsHardodedForNow') });
}

woblocksControl.createDefinedObjectBlocklyBlock = function(aliasBlockName, aliasBlockIconURL){

  //REGISTER BLOCK
  var functionString = ''; 
  functionString += 'Blockly.Blocks[\''+aliasBlockName+'\'] = {\n';
  functionString += ' init: function() {\n';
  //functionString += '  this.appendDummyInput().appendField(new Blockly.FieldImage(\''+aliasBlockIconURL+'\', 25, 25, "*"));\n';
  functionString += '  this.appendDummyInput().appendField(new Blockly.FieldImage(\'icons/representations/apple.png\', 25, 25, "*"));\n';
  functionString += '  this.setTooltip("'+aliasBlockName+'");';

  functionString += '  this.setOutput(true);\n';

  functionString += '	this.setWarningText(\'MENSAJES:\');';
  
  functionString += '   this.setColour(\''+colorPallette['created_objects_wk']+'\');';
  functionString += ' },\n';
  

  functionString += ' saveConnections : function(containerBlock) {},\n';

  functionString += ' updateShape_ : function() {},\n';

  functionString += ' getMetaInfo:function(self){\n';
  functionString += '	return {obj:\''+aliasBlockName+'\', method:null};	';
  functionString += ' }\n';
  functionString += '};';

  eval(functionString);
  

  //DEFINE WK BEHAVIOUR
  functionString = '';

  functionString += 'Blockly.JavaScript[\''+aliasBlockName+'\'] = function(block) {\n';
  functionString += '  return \''+aliasBlockName+'\';';
  functionString += '};\n';

  eval(functionString);

 
  functionString = 'Blockly.getMainWorkspace().getToolbox().clearSelection();\n';

  eval(functionString);
}

woblocksControl.setMessagesForDefinedObjectNamedInto = function(aName, aTargetBlock){
	if(!this.definedObjectsInfo.objectNames.includes(aName)){return;}
	if(!this.definedObjectsInfo.objectsInfoMap[aName].xml){aTargetBlock.setWarningText("MENSAJES:");}

	var newBlockId = Blockly.Xml.domToWorkspace(this.definedObjectsInfo.objectsInfoMap[aName].xml , this.workspace)[0];
  	var tempBlock = this.workspace.getBlockById(newBlockId);
  	tempBlock.initSvg();
	this.showMessagesOfInWarningTextOf(tempBlock,aTargetBlock);  	
  	tempBlock.dispose();

}

woblocksControl.showMessagesOfInWarningTextOf = function(aBlock,anotherBlock){
	var msgs = Blockly.Blocks['objetc_create_wk'].messagesOf(aBlock,this.workspace);
	var msgsStr = "MENSAJES:";
	for(var i = 0; i < msgs.length; i++){
		msgsStr += "\n"+msgs[i];
	}
	anotherBlock.setWarningText(msgsStr);
}

//SAVE CONFIG INFO
woblocksControl.saveConfigInfo = function(aHeight,aWidth, aBackgroundImageUrl){
	this.config.height = aHeight;
	this.config.width = aWidth;
	this.config.backgroundImage = aBackgroundImageUrl;
}


//SAVE PROJECT
woblocksControl.getProjetInfoAsJSON = function(){
	var result = {};
	result.mainSceneInfo = {xml:Blockly.Xml.domToText(this.mainSceneInfo.xml)};
	result.definedObjectsInfo = { objectNames:this.definedObjectsInfo.objectNames };
	result.definedObjectsInfo.objectsInfoMap = {};
	this.definedObjectsInfo.objectNames.map(function(aName){
		result.definedObjectsInfo.objectsInfoMap[aName] = {definedObjectsMappingInfo:woblocksControl.definedObjectsInfo.objectsInfoMap[aName].definedObjectsMappingInfo , xml:Blockly.Xml.domToText(woblocksControl.definedObjectsInfo.objectsInfoMap[aName].xml)};
	});
	result.config = this.config;
	result.representations = this.representations;
	return JSON.stringify(result);
}

//LOAD PROJECT
woblocksControl.loadProjetInfoFromJSON = function(aJsonObjInfo){
	var result = JSON.parse(aJsonObjInfo);
	this.mainSceneInfo = {xml:Blockly.Xml.textToDom(result.mainSceneInfo.xml)};
	this.definedObjectsInfo = { objectNames:result.definedObjectsInfo.objectNames, objectsInfoMap:{}};
	this.definedObjectsInfo.objectNames.map(function(aName){
		woblocksControl.definedObjectsInfo.objectsInfoMap[aName] = {definedObjectsMappingInfo:result.definedObjectsInfo.objectsInfoMap[aName].definedObjectsMappingInfo};
		woblocksControl.definedObjectsInfo.objectsInfoMap[aName].xml = Blockly.Xml.textToDom(result.definedObjectsInfo.objectsInfoMap[aName].xml);
	});
	this.config = result.config;
	this.representations = result.representations;
}

//OTHERS
woblocksControl.getWorkspaceXmlContentAsList = function(){
	return Blockly.Xml.workspaceToDom(this.workspace).childNodes;
}


woblocksControl.getAllParentlessObjects = function(){
	var nodes = this.getWorkspaceXmlContentAsList();
	var ids = [];for(var i = 0; i < nodes.length; i++){ids.push(nodes[i].id);}
	//var ids = nodes.map(function(anElem){return anElem.id;});

	var blocks = this.workspace.getAllBlocks();
	var result = [];
	for(var i = 0; i < blocks.length; i++ ){
		if(ids.includes(blocks[i].id)){
			result.push(blocks[i]);
		}
	}
	
	result = result.sort(function(a,b){
		return a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y
	});
	return result;
}

woblocksControl.injectXmlToWorkspace =function(xmlContentList){
	this.workspace.clear();
	if(xmlContentList !== undefined && xmlContentList !== null && xmlContentList.length > 0){
		var xml;
		for(var i = 0; i < xmlContentList.length; i++){
			xml = jQuery.parseXML(xmlContentList[i]);
	    	Blockly.Xml.appendDomToWorkspace(xml,this.workspace);
		}
	}
}


woblocksControl.loadToolboxConent = function(stringXmlContent){
	this.toolbox.innerHTML = stringXmlContent;
	this.workspace.updateToolbox(this.toolbox);
}

woblocksControl.getMainToolboxXmlString =	function(){
	var xmlStr = `<xml>

<category name="ATOMICOS" toolboxitemid="atomics">
    <block type="logic_boolean" >
        <field name="BOOL">TRUE</field>
    </block>

    <block type="math_number" >
        <field name="NUM">123</field>
    </block>

    <block type="text" >
        <field name="TEXT"></field>
    </block>

    <block type="lists_create_with" >
        <mutation items="0"></mutation>
    </block>

    <block type="lists_create_with">
        <mutation items="1"></mutation>
        <value name="ADD0">
            <block type="text">
            <field name="TEXT"></field>
            </block>
        </value>
    </block>

    <block type="condition_wk" >
    </block>
</category>

<category name="WK DEFINICIONES">
    <block type="action_start_wk" >
    </block>

    <block type="action_start_wk">
        <next>
            <block type="objetc_create_wk">
            </block>
        </next>
    </block>

    <block type="objetc_property_wk">
        <value name="value">
            <block type="text">
            <field name="TEXT">aPropertyValue</field>
            </block>
        </value>
    </block>

    <block type="method_create_wk">
        <value name="params">
            <block type="lists_create_with">
            <mutation items="0"></mutation>
            </block>
        </value>
        <statement name="instructions">
            <block type="instruction_wk">
            <value name="instruction">
                <block type="text">
                <field name="TEXT">anInstruction</field>
                </block>
            </value>
            </block>
        </statement>
    </block>


    <block type="instruction_wk">
        <value name="instruction">
            <block type="text">
            <field name="TEXT">anInstruction</field>
            </block>
        </value>
    </block>
</category>

<category name="WK EJECUCION">
    <block deletable="false" type="action_start_wk">
    </block>

    <block type="executor_wk" >		
        <value name="executor">
        </value>
        <statement name="params"><block type="executor_param_wk"><value name="param">
        <block type="text"><field name="TEXT">aParam</field></block>
        </value></block></statement>
    </block>

    <block type="execution_res_wk" >		
        <value name="executor">
        </value>
        <statement name="params">
            <block type="executor_param_wk">
                <value name="param">
                    <block type="text"><field name="TEXT">aParam</field></block>
                </value>
            </block>
        </statement>
    </block>		

    <block type="executor_param_wk">
        <value name="param">
            <block type="text"><field name="TEXT">aParam</field></block>
        </value>
    </block>

    <block type="var_objetc_wk">
        <value name="value">
            <block type="text">
            <field name="TEXT">aVariableValue</field>
            </block>
        </value>
    </block>

    <block type="instruction_wk">
        <value name="instruction">
            <block type="text">
            <field name="TEXT">anInstruction</field>
            </block>
        </value>
    </block>

    <block type="keyboard_event_wk">
    </block>

    <block type="tick_event_wk">
    </block>

    <block type="collission_wk">
    </block>

    <block type="foreach_wk">
    </block>
</category>

<category name="OBJETOS" toolboxitemid="custom" >
    <block type="game_wk"></block>
`

	if(this.definedObjectsInfo.objectNames.length > 0){
		for(var i = 0; i < this.definedObjectsInfo.objectNames.length; i++ ){
			xmlStr +='			<block type="'+this.definedObjectsInfo.objectNames[i]+'"></block>';
		}
	}
	xmlStr +='		    </category>\n</xml>';
	return xmlStr;
}

woblocksControl.getObjectToolboxXmlString =	function(currentObject){
	var xmlStr = '';
	xmlStr += '		    <category name="ATOMICOS" toolboxitemid="atomics">\n';

	xmlStr += '		      <block type="logic_boolean" >\n';
	xmlStr += '		        <field name="BOOL">TRUE</field>\n';
	xmlStr += '		      </block>\n';
	xmlStr += '		      <block type="math_number" >\n';
	xmlStr += '		        <field name="NUM">123</field>\n';
	xmlStr += '		      </block>\n';
	xmlStr += '		      <block type="text" >\n';
	xmlStr += '		        <field name="TEXT"></field>\n';
	xmlStr += '		      </block>\n';
	xmlStr += '		      <block type="lists_create_with" >\n';
	xmlStr += '		        <mutation items="0"></mutation>\n';
	xmlStr += '		      </block>\n';
	xmlStr += '		      <block type="lists_create_with">\n';
	xmlStr += '		        <mutation items="1"></mutation>\n';
	xmlStr += '		        <value name="ADD0">\n';
	xmlStr += '		          <block type="text">\n';
	xmlStr += '		            <field name="TEXT"></field>\n';
	xmlStr += '		          </block>\n';
	xmlStr += '		        </value>\n';
	xmlStr += '		      </block>\n';

	xmlStr += '		      <block type="condition_wk" >';
	xmlStr += '		      </block>';

	xmlStr += '		    </category>\n';

	xmlStr += '		    <category name="WK">\n';
	xmlStr += '		      <block type="objetc_property_wk">\n';
	xmlStr += '		        <value name="name">\n';
	xmlStr += '		          <block type="text">\n';
	xmlStr += '		            <field name="TEXT">aPropertyName</field>\n';
	xmlStr += '		          </block>\n';
	xmlStr += '		        </value>\n';
	xmlStr += '		        <value name="value">\n';
	xmlStr += '		          <block type="text">\n';
	xmlStr += '		            <field name="TEXT">aPropertyValue</field>\n';
	xmlStr += '		          </block>\n';
	xmlStr += '		        </value>\n';
	xmlStr += '		      </block>\n';

	xmlStr += '			      <block type="method_create_wk">';
	xmlStr += '			        <value name="name">';
	xmlStr += '			          <block type="text">';
	xmlStr += '			            <field name="TEXT">aMethodName</field>';
	xmlStr += '			          </block>';
	xmlStr += '			        </value>';
	xmlStr += '			        <value name="params">';
	xmlStr += '			          <block type="lists_create_with">';
	xmlStr += '			            <mutation items="0"></mutation>';
	xmlStr += '			          </block>';
	xmlStr += '			        </value>';
	xmlStr += '			        <statement name="instructions">';
	xmlStr += '			          <block type="instruction_wk">';
	xmlStr += '			            <value name="instruction">';
	xmlStr += '			              <block type="text">';
	xmlStr += '			                <field name="TEXT">anInstruction</field>';
	xmlStr += '			              </block>';
	xmlStr += '			            </value>';
	xmlStr += '			          </block>';
	xmlStr += '			        </statement>';
	xmlStr += '			      </block>';

	xmlStr += '		      <block type="instruction_wk">\n';
	xmlStr += '		        <value name="instruction">\n';
	xmlStr += '		          <block type="text">\n';
	xmlStr += '		            <field name="TEXT">anInstruction</field>\n';
	xmlStr += '		          </block>\n';
	xmlStr += '		        </value>\n';
	xmlStr += '		      </block>\n';

	xmlStr += '		      <block type="executor_wk" >';		
	xmlStr += '		      	<value name="executor">';
	xmlStr += '		        	<block type="text"><field name="TEXT">anObj</field></block>';
	xmlStr += '		        </value>';
	xmlStr += '		        <statement name="params"><block type="executor_param_wk"><value name="param">';
	//xmlStr += ' 				<block type="text"><field name="TEXT">aParam</field></block>';
	xmlStr += '		      	</value></block></statement>';
	xmlStr += '		      </block>';

	xmlStr += '		      <block type="execution_res_wk" >';		
	xmlStr += '		      	<value name="executor">';
	//xmlStr += '		        	<block type="text"><field name="TEXT">anObj</field></block>';
	xmlStr += '		        </value>';
	xmlStr += '		        <statement name="params"><block type="executor_param_wk"><value name="param">';
	xmlStr += ' 				<block type="text"><field name="TEXT">aParam</field></block>';
	xmlStr += '		      	</value></block></statement>';
	xmlStr += '		      </block>';		

	xmlStr += '		      </category>\n';

	xmlStr +='		    <category name="OBJETOS" toolboxitemid="custom" >\n';
	xmlStr +='				<block type="game_wk"></block>';
	if(this.definedObjectsInfo.objectNames.length > 0){
		for(var i = 0; i < this.definedObjectsInfo.objectNames.length; i++ ){
			if(currentObject != this.definedObjectsInfo.objectNames[i]){
				xmlStr +='			<block type="'+this.definedObjectsInfo.objectNames[i]+'"></block>';
			}
		}
	}
	xmlStr +='		    </category>\n';

	return xmlStr;
}

woblocksControl.getDefaultWKObjectXmlNamed = function(proposedName){
	var defaultXml = '  <block deletable="false" type="action_start_wk">';
		defaultXml +='		<next>';
		defaultXml +='			<block deletable="false" type="objetc_create_wk" >';
		defaultXml +='				<field name="name">'+proposedName+'</field>';
		defaultXml +='				<statement name="properties">';
		defaultXml +='					<block type="objetc_property_wk">';
		defaultXml +='						<value name="value">';
		defaultXml +='							<block type="text">';
		defaultXml +='								<field name="TEXT">aPropertyValue</field>';
		defaultXml +='							</block>';
		defaultXml +='						</value>';
		defaultXml +='					</block>';
		defaultXml +='				</statement>';
		defaultXml +='			</block>';
		defaultXml +='		</next>';
		defaultXml +='	</block>';
	return defaultXml;
}

woblocksControl.getImagePathOfRepresentation = function(aRepresentationName){

}

woblocksControl.getIconPathOfRepresentation = function(aRepresentationName){
	
}

woblocksControl.init()

export default woblocksControl;