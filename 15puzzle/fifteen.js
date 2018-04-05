(function() {
    "use strict";

    /**
     * Shawn Jin, CSC337
     *  This program would create a 15 puzzle and let user to resolve.
     *
     *  content:
     *      fifteen.html
     *      fifteen.css
     */


    //global
    var SIZE = 4;
    var HEIGHT = 100;
    var WIDTH = 100;
    var INGAME = false;

    // add event listener
    window.addEventListener("load", reset);
    window.addEventListener("load", test);

    /**
     * add shift method to click
     */
    function test() {

        var puzzlearea = document.getElementById("puzzlearea");

        puzzlearea.addEventListener("click", function (ev) {
            shift(ev.target);
        });

        document.getElementById("reset").addEventListener("click", reset);
    }

    /**
     * shift the puzzle with empty if it is movable
     * @param square
     */
    function shift(square) {
        // if (!INGAME) {
        //     return;
        // }
        if (square.className !== "empty") {

            var emptySquare = getEmptySquare(getAdjacentSquares(square));

            if (emptySquare) {
                var emptyDiv = document.getElementsByClassName("empty")[0];

                var temp = {className: square.className, innerHTML: square.innerHTML};

                // square is going to be empty
                square.className = emptyDiv.className;
                square.innerHTML = emptyDiv.innerHTML;

                // empty Div will be the new one
                emptyDiv.className = temp.className;
                emptyDiv.style.backgroundPosition = square.style.backgroundPosition;
                emptyDiv.innerHTML = temp.innerHTML;
                emptyDiv.style.border = "black solid 5px";
                emptyDiv.style.color = "black";
                square.style.border = "white solid 5px";

                // check if user finished the puzzle
                if (INGAME){
                    checkOrder();  
                }
                
            }
        }
    }


    /**
     * change the text and border to red
     * @param var1: a div
     */
    function changeColor1(var1) {
        var1.style.border = "5px solid red";
        var1.style.color = "red";
    }

    /**
     * change the text and border to black
     * @param var2: a div
     */
    function changeColor2(var2) {

        var2.style.border = "5px solid black";
        var2.style.color = "black";
    }

    /**
     * get backgroundPosition in String format
     * @param var1: col
     * @param var2: row
     * @returns {string} backgroundPosition in String format
     */
    function getBackgroundPosition(var1, var2) {
        var y = (var1) * -WIDTH;
        var x = (var2) * -HEIGHT;
        return  x + "px " + y + "px";
    }

    /**
     * initial the puzzle game
     */
    function reset() {
        // if (INGAME) {
            
        //     var puzzles = document.querySelectorAll(".puzzle");
        //     for (var i = 0; i < puzzles.length; i++) {
        //         puzzles[i].parentNode.removeChild(puzzles[i]);
        //     }
        //     INGAME = false;
        // }
        INGAME = false;
        document.getElementById("puzzlearea").innerHTML = "";
        var times = 1;
        for (var y = 0; y < SIZE; y++) {
            for (var x = 0; x < SIZE; x++) {
                var newDiv = document.createElement("div");
                newDiv.id = "square_" + y + "_" + x;
                newDiv.style.left = (x * WIDTH ) + "px";
                newDiv.style.top = (y * HEIGHT ) + "px";
                newDiv.style.backgroundPosition = getBackgroundPosition(y,x);

                if (times === 16) {
                    newDiv.className = "empty";
                } else {
                    newDiv.innerHTML = (times++).toString();
                    newDiv.className = "puzzle";
                }

                document.getElementById("puzzlearea").appendChild(newDiv);
            }
        }

        // add :hover effect
        var squares = document.getElementsByClassName("puzzle");

        // squares.push(document.getElementsByClassName("empty")[0]);
        for (var i = 0; i < squares.length; i++) {
            var square = squares[i];

            square.addEventListener("mouseenter", function (e) {
                if (hasEmptySquare(getAdjacentSquares(e.target))) {
                    changeColor1(e.target);
                }
            });

            square.addEventListener("mouseleave", function (e) {
                if (hasEmptySquare(getAdjacentSquares(e.target))) {
                    changeColor2(e.target);
                }
            });
        }

        // set the button useful
        document.getElementById("shufflebutton").addEventListener("click", shuffle);

        // set empty square
        document.getElementsByClassName("empty")[0].addEventListener("mouseenter", function (e) {
            if (hasEmptySquare(getAdjacentSquares(e.target))) {
                changeColor1(e.target);
            }
        });

        document.getElementsByClassName("empty")[0].addEventListener("mouseleave", function (e) {
            if (hasEmptySquare(getAdjacentSquares(e.target))) {
                changeColor2(e.target);
            }
        });

    }

    /**
     * get all of the adjacent squares
     * @param var1 {*}: square
     * @returns {Array}
     */
    function getAdjacentSquares(var1) {

        var id = var1.id.split("_");

        var row = parseInt(id[1]);
        var col = parseInt(id[2]);

        var adjacents = [];

        if(row < 3){
            adjacents.push(getSquare(row+1, col));
        }
        if(row > 0){
            adjacents.push(getSquare(row-1, col));
        }
        if(col < 3){
            adjacents.push(getSquare(row, col+1));
        }
        if(col > 0){
            adjacents.push(getSquare(row, col-1));
        }

        return adjacents;
    }

    /**
     *according to the position get the id
     * @param var1: number of row
     * @param var2: number of col
     */
    function getSquare(var1, var2) {
        var id = "square_" + var1.toString() + "_" + var2.toString();
        return document.getElementById(id);
    }

    /**
     * get empty square when the div close to a empty div, else return false
     * @param var1
     */
    function getEmptySquare(var1) {
        for (var i = 0; i < var1.length; i++) {
            if (var1[i].className === "empty") {
                return var1[i];
            }
        }
        return false;

    }

    /**
     * check if the div has adjacent empty div
     * @param var1
     * @returns {boolean}
     */
    function hasEmptySquare(var1) {
            for (var i = 0; i < var1.length; i++) {
                if (var1[i].className === "empty") {
                    return true;
                }
            }
            return false;
    }

    /**
     * check the div's order
      * @returns {boolean}: if the user got the right answer
     */
    function checkOrder() {
        if (!INGAME || getSquare(3, 3).className != "empty") {
            return false;
        }

        var n = 1;
        for (var y = 0; y < SIZE; y++) {
            for (var x = 0; x < SIZE; x++) {                
                if (n <= 15 && getSquare(y, x).innerHTML != n.toString()) {
                    console.log("y = " +y +"x = " + x);
                    console.log(n);
                    console.log(getSquare(y, x).innerHTML);
                    console.log("false");
                    return false;
                    
                }
                n++;
            }
        }

        if (confirm("You got it, do you want to restart?")) {
            reset();
            return true;
        }

    }

    /**
     *  get random number from (from) to (to);
     * @param from
     * @param to
     * @returns {*} return a number between the two numbers
     */
    function random(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    /**
     * randomly switch 100 times and get a random solvable puzzle
     */
    function shuffle() {
        var randomTimes = 100;
        

        while (randomTimes>0) {
            var tempDivs = getAdjacentSquares(document.getElementsByClassName("empty")[0]);
            var location = random(0, tempDivs.length-1);
            console.log(location);
            shift(tempDivs[location]);
            randomTimes--;
        }
        INGAME = true;
    }

})();