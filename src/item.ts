/**
 * Class Item - An item in this game 
 * It holds the names, descriptions and ID's of the items.
 * 
 * @author  Michael Kölling, David J. Barnes, Bugslayer, Jordy Lynch
 * @version 2017.03.30
 */

class Item{
    description : string ;
    name : string;

/** 
 * Create an item description with "description", and an item name with "name".
*/
    constructor(description : string, name : string) {
        this.description = description; 
        this.name = name; 
    }


}

