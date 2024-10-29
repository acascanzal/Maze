window.addEventListener('load', () => maze.init());

const maze = {
    init(){
        const body = document.querySelector('body');
        const title = "Maze";
        const subtitle = "By Alain Cascan";
        const header = this.generateHeader(title,subtitle);
        body.appendChild(header);


        const main = this.generateMain();
        body.appendChild(main);

        const copyright = "© 2024 Alain Cascan";
        const footer = this.generateFooter(copyright);
        body.appendChild(footer);

        this.maze = remoteMaze;
        this.newMaze(7,7);



    },

    generateHeader(title, subtitle){
        const header = document.createElement('header');

        const div = document.createElement('div');
        div.className = 'header';

        const h1 = document.createElement('h1');
        h1.textContent = title;

        const h2 = document.createElement('h2');
        h2.textContent = subtitle;

        div.appendChild(h1);
        div.appendChild(h2);
        header.appendChild(div);
        return header;

    },

    generateFooter(copyright){
        const footer = document.createElement('footer');
        const div = document.createElement('div');
        div.className = 'footer';
        const p = document.createElement('p');
        p.textContent = copyright;
        div.appendChild(p);
        footer.appendChild(div);
        return footer;
    },

    generateMain(){
        const main = document.createElement('main');
        const div = document.createElement('div');
        div.className = 'main';


        const mazeLegend = "Labyrinth";
        const cellFieldset = this.generateMazeFieldset(mazeLegend); //this is the maze
        div.appendChild(cellFieldset);

        const controlsLegend = "Controls";
        const controlsFieldset = this.generateControlsFieldset(controlsLegend); //this is the controls
        div.appendChild(controlsFieldset);


        main.appendChild(div);
        return main;
    },

    generateMazeFieldset(legend){
        const fieldset = this.makeFieldset(legend);

        const fieldDiv = document.createElement('div');
        fieldDiv.className = "field";

        const sizebar = this.generateSizeBar();
        
        
        fieldset.appendChild(fieldDiv);
        fieldset.appendChild(sizebar);

        return fieldset;
    },

    generateSizeBar(){
        const sizebar = document.createElement('div');
        sizebar.className = 'size-bar';

        const smallButton = this.generateButton('Small', 'btn_small');
        const mediumButton = this.generateButton('Medium', 'btn_medium');
        const largeButton = this.generateButton('Large', 'btn_large');

        smallButton.addEventListener('click', () => this.newMaze(7,7));
        mediumButton.addEventListener('click', () => this.newMaze(12,12));
        largeButton.addEventListener('click', () => this.newMaze(18,18));

        sizebar.appendChild(smallButton);
        sizebar.appendChild(mediumButton);
        sizebar.appendChild(largeButton);

        return sizebar;

    },

    generateButton(label,id){
        const button = document.createElement('button');
        button.textContent = label;
        button.type = 'button';
        if (id){
            button.id = id;
        }    
        return button;

    },

    generateControlsFieldset(legend, id){
        const fieldset = this.makeFieldset(legend);
        const communicationP = document.createElement('p');
        communicationP.id = 'communicationP';
        const fieldsetCommunication = this.makeFieldset("Communication", [communicationP]);


        const controlHolder = this.generateControlHolder();


        fieldset.appendChild(controlHolder);
        fieldset.appendChild(fieldsetCommunication);

        return fieldset;
    },

    makeFieldset(legend,elements = []){
        const fieldset = document.createElement('fieldset');
        const legendElement = document.createElement('legend');
        legendElement.textContent = legend;
        fieldset.appendChild(legendElement);
        elements.forEach(element => {
            fieldset.appendChild(element);
        });
        return fieldset;
    },

    generateField(width, height){
        const oldField = document.querySelector('.field');
        const newField = document.createElement('div');
        newField.className = 'field';

        
        
        for (let i = 0; i < height; i++){
            const row = document.createElement('div');
            row.className = 'row';

            for (let j = 0; j < width; j++){
                const squareType="unknow";
                let square = this.generateSquare(squareType,i,j);
                square.style.width = `calc(100% / ${width})`;

                row.appendChild(square);
            }

            newField.appendChild(row);
            

        }
        

        oldField.replaceWith(newField);
    },

    generateSquare(type, row, column, content = []){
        const squareHolder = document.createElement('div');
        squareHolder.className = 'square-holder';
        
        const squareSizer = document.createElement('div');
        squareSizer.className = 'square-sizer';

        const squareContent = document.createElement('div');
        squareContent.className = 'square-content';
        if (row !== undefined){
            squareContent.dataset.row = row;
        }
        if (column !== undefined){
            squareContent.dataset.column = column;

        }
        if (type){
            squareContent.classList.add(type);
        }


        if (content.length != 0){

            content.forEach(element => {
                squareContent.appendChild(element); 
            });
        }

        squareSizer.appendChild(squareContent);
        squareHolder.appendChild(squareSizer);
        return squareHolder;
    },

    async newMaze(width,height){
        this.generateField(width,height);
        const object = await this.maze.generate(width,height);
        this.positionPlayer(object.playerX, object.playerY);
    },

    generateControlHolder(){
        const controlHolder = document.createElement('div');
        controlHolder.className = 'control-holder';
        
        

        const content = [];


        const directionSpacers = Array(4).fill(null).map(() => {
            const spacer = document.createElement('div');
            spacer.className = 'direction-spacer';
            return spacer;
        });



        let upButton = document.createElement('div');
        upButton.className = 'direction-arrow up';
        upButton.style.pointerEvents = 'auto'; // Asegura que sea clickeable
        upButton.addEventListener('click', () => this.mazeMove(-1,0));


        const leftButton = document.createElement('div');
        leftButton.className = 'direction-arrow';
        leftButton.classList.add('left');
        leftButton.addEventListener('click', () => this.mazeMove(0,-1));

        const rightButton = document.createElement('div');
        rightButton.className = 'direction-arrow';
        rightButton.classList.add('right');
        rightButton.addEventListener('click', () => this.mazeMove(0,1));


        const downButton = document.createElement('div');
        downButton.className = 'direction-arrow';
        downButton.classList.add('down');
        downButton.addEventListener('click', () => this.mazeMove(1,0));



        const playerButton = document.createElement('div');
        playerButton.className = 'direction-spacer';
        playerButton.classList.add('player');
        playerButton.addEventListener('click', async () => await this.autoSolve());


        

        content.push(directionSpacers[0], upButton, directionSpacers[1], leftButton, playerButton, rightButton, directionSpacers[2], downButton, directionSpacers[3]);


        const square = this.generateSquare(null, undefined,undefined,content);


        controlHolder.appendChild(square);



        return controlHolder;

    },

    async mazeMove(dx,dy){
        const object = await this.maze.move(dx, dy);
        switch (object.cell){
            case 0:
                this.positionPlayer(object.playerX, object.playerY);
                break;
            case 1:
                this.positionGoal(object.playerX, object.playerY);

                this.showPopUp('You win!');
                break;
            case 2:
                const wall = document.querySelector(`.square-content[data-row="${object.playerX+dx}"][data-column="${object.playerY+dy}"]`);
                wall.classList.add('wall');
                wall.classList.remove('unknow');
                break;
        }
        return object.cell;

        
    },
    positionGoal(x,y){
        const oldPlayer = document.querySelector('.player.square-content');
        if (oldPlayer){
            oldPlayer.classList.remove('player');
            oldPlayer.classList.add('walkeable');
        }
        const goal = document.querySelector(`.square-content[data-row="${x}"][data-column="${y}"]`);
        goal.classList.add('target');
        goal.classList.remove('unknow');
    },

    positionPlayer(x,y){
        const oldPlayer = document.querySelector('.player.square-content');
        if (oldPlayer){
            oldPlayer.classList.remove('player');
            oldPlayer.classList.add('walkeable');
        }
        const newPlayer = document.querySelector(`.square-content[data-row="${x}"][data-column="${y}"]`);
        newPlayer.classList.add('player');
        newPlayer.classList.remove('unknow');
    },

    showPopUp(message){
        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const popUp = document.createElement('div');
        popUp.className = 'popup';

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;

        const replayButton = document.createElement('button');
        replayButton.type = 'button';
        replayButton.textContent = 'replay';
        replayButton.addEventListener('click', () => {
            document.querySelector('body').removeChild(overlay);
            document.querySelector('body').removeChild(popUp);
            this.newMaze(7, 7); // Reset the maze or implement your replay logic here
        });

        popUp.appendChild(messageDiv);
        popUp.appendChild(replayButton);

        document.querySelector('body').appendChild(overlay);
        document.querySelector('body').appendChild(popUp);
    },

    async autoSolve() {
        console.log('autoSolve');
        const directions = [
            { dx: 0, dy: -1 }, // left
            { dx: -1, dy: 0 }, // up
            { dx: 0, dy: 1 },  // right
            { dx: 1, dy: 0 }   // down
        ];
    
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
        const solve = async (x, y, visited) => {

            if (visited.has(`${x},${y}`)) {
                return false;
            }
            visited.add(`${x},${y}`);

            for (const element of directions) {
                
                const { dx, dy } = element;
                const newX = x + dx;
                const newY = y + dy;
                if (visited.has(`${newX},${newY}`)) {
                    continue;
                }
    
                await sleep(2);
                const cell = await this.mazeMove(dx, dy);
                if (cell === 1) { // Target
                    return true;
                }else if (cell === 0) { // Way
                    if (await solve(newX, newY, visited)) {
                        return true;
                    }
                    await this.mazeMove(-dx, -dy);               
                }
            }
            return false;
        };
    
        const visited = new Set();
        await solve(this.maze.playerX, this.maze.playerY, visited);
    }

    
};

const localMaze = {

    playerX: 1,
    playerY: 1,

    // 0 = ways, 1 = target, 2 = walls
    maze: [
        [2,2,2,2,2,2,2],
        [2,0,0,0,2,0,2],
        [2,0,2,0,2,0,2],
        [2,0,2,0,0,0,2],
        [2,0,2,2,2,0,2],
        [2,0,0,1,2,0,2],
        [2,2,2,2,2,2,2]
    ],
    generate(width, height){
        this.playerX = 1;
        this.playerY = 1;
        return {playerX: this.playerX, playerY: this.playerY};
    },
    move(dx,dy){
        if (dx < -1 || dx > 1 || dy < -1 || dy > 1){
            alert('Invalid move');
            return;
        }

        const newX = this.playerX + dx;
        const newY = this.playerY + dy;
        const cell = this.maze[newX][newY];

        if (cell !== 2){
            this.playerX = newX;
            this.playerY = newY;
        }
        return {playerX: this.playerX, playerY: this.playerY, cell};
    }

};

const remoteMaze = {
    token: '',
    userid: 'alcait02',
    playerX: 0,
    playerY: 0,

    async generate(width, height) {
        const url = `https://www2.hs-esslingen.de/~melcher/it/maze/?request=generate&userid=${this.userid}&width=${width}&height=${height}`;
        
        try {
            const response = await fetch(url);

            
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'ok' && data.code === 200) {
                this.token = data.token;
                this.playerX = data.playerX;
                this.playerY = data.playerY;
                
                return { playerX: this.playerX, playerY: this.playerY };
            } else {
                throw new Error('Failed to generate maze: invalid response');
            }
        } catch (error) {
            document.getElementById('communicationP').textContent = 'Failed to generate maze, look the console for more information';
            console.error('Error:', error.message);
        }
    },

    async move(dx, dy) {
        if (dx < -1 || dx > 1 || dy < -1 || dy > 1) {
            alert('Invalid move dx or dy');
            return;
        }
        const url = `https://www2.hs-esslingen.de/~melcher/it/maze/?request=move&userid=${this.userid}&token=${this.token}&dx=${dx}&dy=${dy}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();
            

            if (data.status === 'ok') {
                this.playerX = data.code.playerX;
                this.playerY = data.code.playerY;
                return { playerX: this.playerX, playerY: this.playerY, cell: data.code.cell };
            } else {
                throw new Error('Failed to move player: invalid response');
            }
        } catch (error) {
            document.getElementById('communicationP').textContent = 'Failed to move player, look the console for more information';
            console.error('Error:', error.message);
        }
    }
};


