import { SvgIconComponent } from "@material-ui/icons"

export class WollokObject {
    name: string
    xml: string = ""
    mappingInfo?: MappingInfo
    Icon: SvgIconComponent

    constructor(name: string, icon: SvgIconComponent){
        this.name = name
        this.Icon = icon
    }

    /**
     * @returns a string id that uniquely identifies this object
     */
    id(){
        return this.name
    }
}

export type MappingInfo = {
    icon: string,
    replacements: {}
}