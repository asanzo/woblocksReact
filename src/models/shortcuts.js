
function DoInit(){
	woblocksControl.init();woblocksControl.configureBlockly('blocklyDiv',document.getElementById("toolbox"));woblocksControl.loadSceneToolbox();
}

function SaveScene(){
	woblocksControl.saveSceneXmlContent();
}

function LoadSceneTab(){
	woblocksControl.definedObjectsAsBlocklyBlocks();woblocksControl.loadSceneToolbox();woblocksControl.loadSceneXmlContent();
}

function NewObjectNamed(aName){
	woblocksControl.addObjectNamed(aName);woblocksControl.addDefaultObjectXmlToWorkspaceNamed(aName);woblocksControl.loadDefinedObjetcToolbox(woblocksControl.definedObjectsInfo.objectNames.length - 1);
}

function SaveDefinedObjectContent(anIndex){
	woblocksControl.saveObjectTabXmlContentWithIndex(anIndex);
}

function LoadObjectTab(anIndex){
	woblocksControl.loadDefinedObjetcToolbox(anIndex);woblocksControl.loadDefinedObjectXmlContent(anIndex);
}

function GetSceneCode(){
	return woblocksControl.getSceneCodeAsWKString('\n');
}

function GetGameBuild(){
	var sourceToBuild = GetSceneCode();
	return woblocksControl.buildSources(sourceToBuild.definitions,sourceToBuild.executions);
}

function RunGame(aGameDiv){
	woblocksControl.runGame(aGameDiv);
}

function ClearElementWithId(anElementId){
	document.getElementById(anElementId).innerHTML = '';
}

function GetProjectJSON(){
	return woblocksControl.getProjetInfoAsJSON();
}

function LoadProjectJSON(aJSONProject){
	woblocksControl.loadProjetInfoFromJSON(aJSONProject);
}
