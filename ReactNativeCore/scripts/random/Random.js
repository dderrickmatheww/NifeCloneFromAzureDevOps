import firstNames from './first-names';
import lastNames from './names';
import places from './places';
const Random = {

   
    first_names: function(){
        return this.getRandom(firstNames);
    }
        
    ,
    last_names: function(){
        return this.getRandom(lastNames);
    }
    ,
    places: function(){
        return this.getRandom(places);
    },
    avatar:"https://source.unsplash.com/random"
    ,
    ipsum:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ,
    status:[
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero, non volutpat.",
        "ed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,"
    ],
    randomWeekDate:function(){
        let start = new Date();
        start = new Date(start.setDate(start.getDate()-7));
        let end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    },
    randomDOB:function(){
        let start = new Date(0);
        let end = new Date();
        end = new Date(end.setFullYear(end.getFullYear() - 21 ));
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    },
    //choose one of the arrays above
    getRandom: function(randomArr){
        let max = randomArr.length;
        let randomNum = Math.floor(Math.random() * Math.floor(max));
        return randomArr[randomNum];
    }
    
}

export default Random;