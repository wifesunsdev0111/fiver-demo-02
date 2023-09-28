import moment from 'moment';


  export default function CalculateSessionDuration(now, then) {
    console.log("then is ", then, "now is ", now);
        const timeDifference = moment(then,"DD/MM/YYYY, HH:mm:ss").diff(moment(now,"DD/MM/YYYY, HH:mm:ss"))/1000;
        console.log("Time difference is " + timeDifference + ' seconds');
        return timeDifference;
        
    }