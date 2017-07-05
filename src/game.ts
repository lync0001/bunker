
class Game {
    parser : Parser;
    out : Printer;
    currentRoom : Room;
    isOn : boolean;
    items : Array<Item> = [];
    charInv : Array<Item> = [];
    steps : number = 30;

    /**
     * Create the game and initialise its internal map.
     */
    constructor(output: HTMLElement, input: HTMLInputElement) {
        this.parser = new Parser(this, input);
        this.out = new Printer(output);
        this.isOn = true;
        this.createItems();
        this.createRooms();
        this.printWelcome();
    }

    /**
     * Create all the rooms and link their exits together.
     */
    createRooms() : void {
        // create the rooms
        let home = new Room(" in your home");
        let mainroad = new Room(" on the main road of your town, Prigorodki");
        let library = new Room(" in the Prigorodki library");
        let field = new Room(" in the corn field behind your house");
        let woods = new Room(" in the woods behind your home town");
        let entrance = new Room(" at the outter entrance of the bunker")
        let hallway = new Room(" in the main hallway of the bunker");
        let bedroom1 = new Room(" in a bedroom with a few bunk beds");
        let bedroom2 = new Room(" in a bedroom with a few bunk beds and a chest");
        let controlroom = new Room(" in a room with a lot of buttons and monitors");

        //Geef de control room een id zodat je kan kijken of je in de room zit, had ook gekund via de naam van de room maar di was te lang
        controlroom.setId(1);


        // initialise room exits
        home.setExits(null, null, null, mainroad);
        mainroad.setExits(library, home, field, null);
        library.setExits(null, null, mainroad, null);
        field.setExits(mainroad, null, woods, null);
        woods.setExits(field, null, entrance, null);
        entrance.setExits(woods, null, hallway, null);
        hallway.setExits(entrance, controlroom, bedroom1, bedroom2);
        bedroom1.setExits(hallway, null, null, null); 
        bedroom2.setExits(null, hallway, null, null);
        controlroom.setExits(null, null, null, hallway);

        //spawns an item within a designated room

        mainroad.setInventory(this.items[0]);
        library.setInventory(this.items[1]);
        

        // spawn player at home
        this.currentRoom = home;
    }

    /**
     * Create all the items and link them to a room.
     */

    createItems() : void {
        //create the items
        this.items.push(new Phone("Your oldschool red rotary phone", "Phone"));
        this.items.push(new Chip("A plastic card with a chip in it" , "Bunker override chip ")); 
    }

    /**
     * Print out the opening message for the player.
     */
    printWelcome() : void {
        this.out.println();
        this.out.println("Welcome to your home town, Arstotzka.");
        this.out.println();
        this.out.println("Arstotzka is on the brink of a nuclear war...");
        this.out.println("Only you know of this, and it is up to you to");
        this.out.println("open the bunker and get into it, first.");
        this.out.println();
        this.out.println("You are currently" + this.currentRoom.description);
        this.out.print("Exits: ");
        if(this.currentRoom.northExit != null) {
            this.out.print("north ");
        }
        if(this.currentRoom.eastExit != null) {
            this.out.print("east ");
        }
        if(this.currentRoom.southExit != null) {
            this.out.print("south ");
        }
        if(this.currentRoom.westExit != null) {
            this.out.print("west ");
        }
        this.out.println();
        this.out.print(">");
    }

    gameOver() : void {
        this.isOn = false;
        this.out.println("Hit F5 to restart the game");
    }

    /**
     * Print out error message when user enters unknown command.
     * Here we print some erro message and a list of the 
     * command words.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
    printError(params : string[]) : boolean {
        this.out.println("I don't know what you mean...");
        this.out.println();
        this.out.println("Your command words are:");
        this.out.println("   go quit help pickup use");
        return false;
    }

    /**
     * Print out some help information.
     * Here we print some stupid, cryptic message and a list of the 
     * command words.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
    printHelp(params : string[]) : boolean {
        if(params.length > 0) {
            this.out.println("Help what?");
            return false;
        }
        this.out.println("You must find a way into the bunker,");
        this.out.println("before it's too late.");
        this.out.println();
        this.out.println("Your command words are:");
        this.out.println("   go quit help");
        return false;
    }

    /** 
     * Try to go in one direction. If there is an exit, enter
     * the new room, otherwise print an error message.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
    goRoom(params : string[]) : boolean {
        if(params.length == 0) {
            // if there is no second word, we don't know where to go...
            this.out.println("Go where?");
            return;
        }

        let direction = params[0];

        // Try to leave current room.
        let nextRoom = null;
        switch (direction) {
            case "north" : 
                nextRoom = this.currentRoom.northExit;
                break;
            case "east" : 
                nextRoom = this.currentRoom.eastExit;
                break;
            case "south" : 
                nextRoom = this.currentRoom.southExit;
                break;
            case "west" : 
                nextRoom = this.currentRoom.westExit;
                break;
        }

        if (nextRoom == null) {
            this.out.println("There is no way to get through there");
        }
        else {
            this.steps -= 1;
            this.out.println("Steps left till nuclear strike: " + String(this.steps))
            if(this.steps == 30){
                this.out.println("The nuclear strike succeeded to launch. Game over.");
                return true;
            }
            this.currentRoom = nextRoom;
            this.out.println("You are " + this.currentRoom.description);
            if(this.currentRoom.inventory != null){
                this.out.println("Items in this room: " + this.currentRoom.inventory.name);
            }
            this.out.print("Exits: ");
            if(this.currentRoom.northExit != null) {
                this.out.print("north ");
            }
            if(this.currentRoom.eastExit != null) {
                this.out.print("east ");
            }
            if(this.currentRoom.southExit != null) {
                this.out.print("south ");
            }
            if(this.currentRoom.westExit != null) {
                this.out.print("west ");
            }
            this.out.println();
        }
        return false;
    }
    pickUp(params : string[]) : boolean {
        let item = this.currentRoom.inventory;


         if(item != null){
            if(item.name = "Phone"){
                  this.out.println("You pick up: " + item.name);
                  this.out.println("You hear someone talking on the other side....")  
                  this.out.println("'I lost my override key in de library, shit!' ")  
                  this.out.println("'Shit dude, if that gets in the wrong hands someone can stop out evil plan' ")  

                  this.currentRoom.inventory = null;
            }else{
                this.charInv.push(item);
                this.out.println("You pick up: " + item.name);
                this.currentRoom.inventory = null;
            }


            
            return false;
        }else{
            this.out.println("No item in this room or already picked up.")
        }
    }
    useItem(params: string[]): boolean { 
        for (let i = 0; i < this.charInv.length; i++) {
            if (this.currentRoom.getId() == 1 && this.charInv[i].name == "Bunker override chip ") {
                this.out.println("You use your override chip to stop the countdown of the nuclear missle. Well done!")
                return true;

            }
        }
        {
            this.out.println("You dont have an item yet, or you're not in the right place to use one.");
            return false;
        }
    }



    /** 
     * "Quit" was entered. Check the rest of the command to see
     * whether we really quit the game.
     * 
     * @param params array containing all parameters
     * @return true, if this command quits the game, false otherwise.
     */
    quit(params : string[]) : boolean {
        if(params.length > 0) {
            this.out.println("Quit what?");
            return false;
        }
        else {
            return true; 
        }
    }
}