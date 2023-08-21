// Variables to hold the state of the game
let mistakes = 0
let currentQuestion = 0
let currentScore = 0
let highscore = sessionStorage.getItem("HS")
let dockpaycounter=0
let time =0
let answerstatus ="correct"
let hintcounter=3
let RSflag= 0




//Section 1
//This code all runs when the page is loaded to setup the game:

//This defines the target variable for updating visibility of various elements
let smiletarget = document.getElementById("smile")
let endtarget = document.getElementById("endmenu")

// This code hides the endmenu when the page loads.
endtarget.classList.add("visibility")

/* This disables the Hint, End Game and Number Buttons on the main board when the page loads.  This prevents 
players from starting to play until the players click the start button. It is called at the end of the pageload*/
function disableBtn() {
    document.getElementById("mb9").disabled = true
    document.getElementById("mb10").disabled = true
    for (let i =1; i<145;i++) {
        document.getElementById(i).disabled = true
    }
}

/* This code generates an array object for each answer (1-144) with 3 properties - the answer, randomly assigned points (1-3) for the answer and the
 pest name associated with the points. The objects are stored in the answers array.*/

function answergenerator () {
    for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= 12; j++) {
            let points =Math.floor(Math.random() * 3) + 1
        answers.push({"answer":(i*j),"points":points})
        }
    }
    answers.forEach(pesttype=> {
        pesttype["pest"]="rats"
        if(pesttype.points==2) {
            pesttype["pest"]="cockroaches"
        }
        if(pesttype.points==1) {
            pesttype["pest"]="ants"
        } 
    })
    // This code randomises the order of the answers array
    answers = answers.sort(() => Math.random() - 0.5)
}
    let answers = []

// This is a general purpose function that selects html code elements by ID and updates their inner HTML. It's used to condense the code.
function Upd8 (d,e) {
    document.getElementById(d).innerHTML= e
}

// This function hides elements by toggling the CSS visibility class
function item_visibility (menu) {
    document.getElementById(menu).classList.toggle("visibility")
}

// This function adds the event listeners for the menubuttons on the start and the end menus
function menubutlisteners(){
    for (let m =1; m<menubutfuncs.length;m++){
    document.getElementById("mb"+m).addEventListener("click", function() {menubutfuncs[m]()})
    console.log("buttonadded"+[m])
    }
}

    //This array holds the functions for each of the menubutton event listeners.
    let menubutfuncs = [
        function () {console.log("this is an unused array item 0")},
        function () {time=300; Upd8("time","5:00")},
        function () {time=600; Upd8("time","10:00")},
        function () {time="unlimited"; Upd8("time","unlimited")},
        function () {time=300; Upd8("time","5:00")},
        function () {time=600; Upd8("time","10:00")},
        function () {time="unlimited"; Upd8("time","unlimited")},
        function () {startgame()},
        function () {startgame()},
        function () {endgame()},
        function () {hintgenerator()}]


/* This function adds an event listener for each button. When clicked, each button provides an argument 
(which is the button number value), to the checkAnswer function.*/
function addEventListeners() {
    for (let b =1;b<=144;b++){
    document.getElementById(b).addEventListener("click", function () {checkAnswer(b)})
    }
}





//Section 2
//This code is used or called on the Start Menu:

/*This function starts the game when the Start button on the startgame menu is clicked.*/
function startgame() {
    // This code toggles either the endmenu or start menu depending on the value of the restart flag variable. 
    if(RSflag=="0") {item_visibility("startmenu")}
    else if(RSflag=="1") {endtarget.classList.add("visibility")}
    enableBtn()
    message = "Use your times tables to find your first room number."
    Upd8 ("message",message)
   //If no time is selected, unlimited is the default setting.
    if(time==0) {time="unlimited"}
    countdown()
}

/* This function enables the Hint, End Game and Number Buttons on the main board when the game is started.*/
function enableBtn() {
    document.getElementById("mb9").disabled = false
    document.getElementById("mb10").disabled = false
    for (let i =1; i<145;i++) {
        document.getElementById(i).disabled = false
    }
}

/* If the payer wants to play a timed game, this function countsdown the time stored in the time variable, it is set by clicking the buttons 
on the start or end menu. At 0:00 the countdown stops and the endgame function is called. 
If the payer wants to play with unlimited time, "unlimited" is displayed in the message box.*/
function countdown() {
    let mins = time/60
    let sec = 0
    
    if(time=="unlimited" || time== null) {Upd8("time","unlimited")}

    else{
        cd = setInterval(function(){
        if(sec==0 && mins==0) {clearInterval(cd);
            endgame()
        }
        else if(sec==0) {mins --;
            sec=59
        }  
        if(sec<=9) {Upd8("time",mins+" : 0"+sec)}
        else {Upd8("time",mins+" : "+sec)}
            sec--;
        },1000)
    }
}




//Section 3
//These functions are used during the game play:

/* This code checks the value of the buttons clicked on the game board against the questions number to determine if the player is correct and 
then calls functions accordingly to progress the game. */
function checkAnswer(i) { 
   
    //First the Id of the button which was clicked by the player is used to calculate its row and column values 
    let I = i - 1
    row = (I % 12) + 1
    col = (Math.floor(I / 12)) + 1

    /*The player's answer is then compared against the value of the currentQuestion from the answer array to 
    determine if the answer is correct or incorrect. It drives two possible courses of action, for a correct or incorrect answer. */

    //correct answer
    if (answers[currentQuestion].answer == (row*col)) {

        if(answerstatus=="incorrect" || answerstatus=="dock") {
            smiletarget.classList.remove("visibility")
        }
        
        answerstatus = "correct"
        hideButton(i)
        currentQuestion +=1;
        currentScore +=answers[currentQuestion].points;
        Upd8 ("num",answers[currentQuestion].answer)
        Upd8 ("currentQ", currentQuestion)
    }
    // incorrect answer
    else {
        if(answerstatus=="correct") {
            smiletarget.classList.add("visibility")      
        }

        answerstatus ="incorrect"
        mistakes +=1;
        dockpaycounter+=1
        //wronganswers.push(answers[currentQuestion].answer)

        if(!wronganswers.includes(answers[currentQuestion].answer)) {
            wronganswers.push(answers[currentQuestion].answer)
        }

    // Three incorrect answers results in -1 from the currentScore and a different message
        if(dockpaycounter==3) {
        answerstatus = "dock"
        currentScore-=1
        dockpaycounter =0
        }
    
        Upd8("mistakes",mistakes)
        maxMistakes()   
    }

    messagebox()
    Upd8("score",currentScore)
    
}

/* This function hides the answer buttons on the main board. When a correct button is clicked, this code creates a new paragrpah node to
 replace the button with the correct answer. 
Instead of appendChild it uses insertBefore since we need to remove the button rather than just hide it, otherwise the text 
alignment in each button container element will be disturbed.*/
function hideButton(i) {
    let newNode =document.createElement("p")
    let textNode= document.createTextNode(answers[currentQuestion].answer)
    newNode.append(textNode)
    
    let parentDiv = document.getElementById(i).parentNode
    let sp2 = document.getElementById(i)
    parentDiv.insertBefore(newNode,sp2)
    
    element = document.getElementById(i)
    element.remove()
}

/* This code generates the message for a correct or incorrect answer, it is called by the checkAnswer function. */
function messagebox() {
    if (answerstatus == "correct") {  
    message=(`${positive[Math.floor(Math.random() * positive.length)]} <span style="color:green"> +\$${answers[currentQuestion].points} </span> You found ${answers[currentQuestion].pest}.`)}
    
    //The index number is randomised each time a message is selected so that a fresh message is used for each consecutive incorrect answer.
    else if (answerstatus == "incorrect") {
        message=(`${negative[Math.floor(Math.random() * negative.length)]} Try again.`)}

    // If the answer status is "dock", a different message is displayed
    else {message=(`${negative[Math.floor(Math.random() * negative.length)]} I'm docking your pay <span style="color:red">$1</span>.`)}  

    Upd8 ("message",message)    
}
    // These are lists of the messages displayed after a correct or incorrect answer
    let positive= ["Good job.", "Well done.", "Excellent.","Great.","Got it.","Take that.","Oh yeah.","Alright!","Nice one.","Wa-hey!"]
    let negative=["Aye caramba.","Uh oh.","Wrong room.","Not quite.","Come on.","Not that one.","Whoops.","Oh dear.","Groan.","*cough*","Errr…"]


/*This function provides a hint to the player by giving the lowest number of all the possible factor pairs for the current 
question when the hint button is clicked. */

//This array stores the hint data
let hintarray = new Array("1","cat")

function hintgenerator () {
    // The hint function can be run 3 times during each game, after 3 time the Hint button is disabled.
    hintcounter -=1
    if(hintcounter==0) {
        document.getElementById("mb10").disabled = true
    }
    // Clear any data already stored in the hint array
    hintarray.splice(0, hintarray.length)
    
     /*Calculate the multiplication factors for the current question and pushes them into the hintarray if the array 
     doesn't already contain them*/
     for (let j=1; j<=12; j++) {
        if(answers[currentQuestion].answer %j == 0 && answers[currentQuestion].answer/j<=12) { 
            c = (" "+j)
            console.log(c)
            console.log(hintarray)
                if(!hintarray.includes(c)) {
                    hintarray.push(c)
                    console.log(hintarray)
                }
            }
        }
    
    //Sort the hintarray in ascending order, this ensures half of each factor pair is preserved 
    hintarray.sort((a,b) =>a-b)
    startlength=(hintarray.length)
    
    /* Remove items from the hint array depending on how many factors the question number has, and 
    generate a hint message for the player that includes only one half of each of the factor pairs. */
    numofloops = Math.floor(hintarray.length/2)
    for(a=0;a<numofloops;a++) {
    hintarray.pop()
    }
    
    //This code generates a message for either single numbers or multiple numbers 
    lastnum = hintarray.pop()
    if(startlength<3) {hintmessage = (`Hint: Try ${lastnum} x ?`)}
    else{hintmessage = (`Hint: Try ${hintarray} or ${lastnum} x ?`)} 

    Upd8("message",hintmessage)
    Upd8("hints",hintcounter)
}

    


//If the player makes 10 mistakes, this code calls the endgame function. This ensures all the feedback fits on the endgame menu.
function maxMistakes() {
    if (mistakes == 10) {
       alert("You made too many mistakes - Try again!")
       endgame()
       }
}


//Section 5
//This code is used to end the game and after the end of game play:
       
/*This function is called to end the game when the End Game button is clicked, when the countdown timer reaches 0:00 
or if the player makes 10 mistakes*/
function endgame() {

    endtarget.classList.remove("visibility")
    feedbackanswers()

    if (smiletarget .classList.contains("visibility")) {smiletarget .classList.remove("visibility")
    }

    // This code ends the countdown timer
    if(time == "300" || time== "600") {clearInterval(cd)
    }
    
    /*The current score is compared aginst the highscore and the highscore is saved in the session storage so it's not 
    lost if the player refreshes the browser window */
    highscore=sessionStorage.getItem("HS")
    if(currentScore>highscore) {
        highscore=currentScore
        sessionStorage.setItem("HS",highscore)
        message = "New Highscore!"
    }
    else {message = "Thanks for your help!"}

    // This populates the endmenu data
    Upd8("highscore",highscore)
    Upd8 ("message",message)
    Upd8 ("advice",feedback)
    
    // This code resets the game board and disables the buttons so the player can't continue past the end of the game. 
    //The Restart flag prevents the startmenu from displaying if the player chooses to play again.
    gamereset()
    
    disableBtn()

    // This flag determines whether either the startmenu or endmenu is hidden by the startgame function.
    RSflag=1 
}

/* This function is called at the end of the game to provide a summary of the questions the player got wrong in the endgame menu 
and half the factor pairs (1-12) for each question.*/
function feedbackanswers () {

    /*A loop calculates the factor pairs for each wrong answer and combines them into a string (to make them readable for the player). 
    Each item is pushed in to a new feedback array which is displayed on the end menu.*/
    for (let i=0; i<wronganswers.length; i++) {
        for (let j=1; j<=12; j++) {
            factor =wronganswers[i]/j
            if(wronganswers[i] %j ==0 && factor<=12 && j>=factor){
                feedbackitems = (`${j} x ${factor} = ${wronganswers[i]} `)
                //feedbackitems.splice(0, feedbackitems.length)
                feedback.push(feedbackitems)
            }
        }
    }
}

    //Arays to hold the wronganswers data
    let wronganswers= []
    let feedback=[]

/*This function removes and then re-adds all the main game board number buttons so they are ready for a new game. 
This approach works better than reloading the page because it enables the disable button function to run as the 
end menu is displayed. Otherwise it fails when button element IDs are missing from the DOM.
*/
function gamereset() {
    let main = document.getElementsByClassName("main")[0]
    main.innerHTML = ""
    for (let i = 1; i <= 144; i++){
    button = '<div class="square"><button id = "' + i + '">?</button></div>'
        main.innerHTML = main.innerHTML + button
    }
   
    // This clears the game data from the various arrays
    answers.splice(0,answers.length)
    wronganswers.splice(0,wronganswers.length)
    feedback.splice(0,feedback.length)
    

    // This resets the variables that hold the state of the game
    currentQuestion=0
    mistakes=0
    currentScore=0
    hintcounter=3
    dockpaycounter=0
    answerstatus="correct"

    // This updates the scoreboard
    Upd8("currentQ", currentQuestion)
    Upd8("mistakes",mistakes)
    Upd8("score",currentScore)
    Upd8("hints",hintcounter)

    //This renews the answers and pests 
    answergenerator()
    addEventListeners()
    
    // This code makes the first question visible when the page is loaded.
    Upd8 ("num",answers[currentQuestion].answer)
}

// This code calls the gamereset function to initially setup the first game. Later it may be called to reset the game.
gamereset()

// This code adds the menu button listeners at the end of the page load
menubutlisteners()

// This code disables the number buttons at the end of the page load
disableBtn()








//Section 6
// This code draws the .svg elements for the page.

// This tells Two.js which element to draw in
    let container = document.getElementById("face")
    let two = new Two({ width: 240, height: 240 }).appendTo(container)

//This is the drawing of the head
let head = two.makeCircle(120, 120, 90)
    head.fill = "pink"
    head.fill = "pink"
    head.stroke = "pink"

let leftear = two.makeCircle(25, 120, 15)
    leftear.stroke = "pink"
    leftear.fill = "pink"

let rightear = two.makeCircle(215, 120, 15)
    rightear.stroke = "pink"
    rightear.fill = "pink"

let lefteye = two.makeCircle(80, 120, 10)
    lefteye.fill = "rgb(59, 56, 56)"
    lefteye.stroke = "rgb(59, 56, 56)"
    lefteye.linewidth= 1

let righteye = two.makeCircle(160, 120, 10)
    righteye.fill = "rgb(59, 56, 56)"
    righteye.stroke = "rgb(59, 56, 56)"
    righteye.linewidth= 1

let nose = two.makePolygon(120, 135, 8, 3)
    nose.linewidth = 4;
    nose.stroke = "rgb(237, 169, 225)"
    nose.fill = "rgb(237, 169, 225)"

for(i=0;i<9;i++) {
    let hair = two.makePolygon(56+(i*15), 80, 12, 3)
    hair.linewidth = 4;
    hair.stroke = "black"
    hair.fill = "black"
    hair.skewY = 0.9
    hair.rotation = 0.4
}


/*let brim = two.makeRectangle(120,47,140,33)
brim.fill="blue"

let hat = two.makeCurve(
    50,33,
60,33,
75,33,
90,33,
105,33,
120,33,
135,33,
150,33,
165,33,
180,33,
190,33,
180,17,
165,9,
150,4,
135,1,
120,0,
105,1,
90,4,
75,9,
60,17,
50,33,
    true
    )
hat.fill="blue"
hat.linewidth=1*/

let brimhair = two.makeCurve(
45,67,
60,67,
75,67,
90,67,
105,67,
120,67,
135,67,
150,67,
165,67,
180,67,
190,67,
190,57,
180,49,
165,40,
150,35,
135,31,
120,30,
105,31,
90,35,
75,40,
60,49,
50,57,
46,67,
50,67,
true
)
brimhair.linewidth=1
brimhair.fill="black"

let openmouth = two.makeEllipse(120,160,8,10)
openmouth.linewwidth=3
openmouth.fill="black"


two.update()

/* This is a second container positioned directly over the first. It enables a drawing of a smiling mouth to overlay the open mouth, 
this enables the expression to be changed by hiding or making the second layer visible.*/
let container_1 = document.getElementById("smile")
let two_1 = new Two({ width: 240, height: 240 }).appendTo(container_1)

let smile = two_1.makeCurve(82,145,90,159,100,168,110,171,120,172,130,171,140,168,150,159,158, 145,true)
    smile.linewidth=3
    smile.fill="pink"

two_1.update()

// This tells Two.js which element to draw in
let container_3 = document.getElementById("clipboard")
let two_2 = new Two({ width: 240, height: 100 }).appendTo(container)


