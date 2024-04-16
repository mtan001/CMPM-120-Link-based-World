let cat = false;
let knife = false;
let openedDoor = false;
class Start extends Scene {
    create() {

        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        console.log(locationData.Body);
        if(locationData.Choices != undefined) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                //if everything has been discovered
                if(choice.Text == "The cat reappears. See what it wants." && (cat == false || openedDoor == false)){
                    continue;
                }
                //get knife
                else if(choice.Text == "Pocket the knife and explore the rest of the kitchen."){
                    knife = true;
                    //this.engine.show("&gt; "+"GOT KNIFE");
                }
                //already got knife, no need for cat to guide player
                else if(choice.Text == "Follow the cat." && knife == true){
                    cat = true;
                    choice.Text = "Explore the rest of the kitchen.";
                    choice.Target = "Kitchen";
                }
                //pet cat, knife not yet obtained
                else if(choice.Text == "Follow the cat." && knife == false){
                    cat = true;
                }
                //cat option disappears once pet
                else if(choice.Text == "A cat appears behind you. Pet the cat." && cat == true){
                    continue;
                }
                //door option doesn't appear until cat is pet
                else if(choice.Text == "You see a door you hadn't noticed earlier. You bend down to examine it." && cat == false){
                    continue;
                }
                //cat has been pet, door not yet unsealed
                else if(choice.Text == "Open the unsealed door." && cat == true){
                    openedDoor = true;
                    //this.engine.show("&gt; "+"DOOR UNSEALED");
                }
                //kitchen door has already been unsealed, entering from kitchen
                else if(choice.Text == "You see a door you hadn't noticed earlier. You bend down to examine it." && openedDoor == true){
                    choice.Text = "Go to the unsealed door from earlier.";
                    choice.Target = "Opened Sealed Door";
                }
                //if no knife and door still sealed, return to original closet door
                else if(choice.Text == "Open the door." && knife == false && openedDoor == false){
                    choice.Target = "Sealed Door No Knife";
                }
                //if player has knife and door is still sealed, cut open the door
                else if(choice.Text == "Open the door." && knife == true && openedDoor == false){
                    choice.Target = "Sealed Door Yes Knife";
                }
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');