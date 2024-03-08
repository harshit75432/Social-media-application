var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function getTime(t){
    let date = new Date(t)
    let str = "";
    let hours = date.getHours()
    let minutes = date.getMinutes()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    str += hours + ":" + minutes+ " ";
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}

function getDate(t){
    console.log("date: "+t);
    let str1 = t.toString().split(' ')[0]
    let str2 = t.toString().split(' ')[1]
    let str3 = t.toString().split(' ')[2]
    let str4 = t.toString().split(' ')[3]
    let date = str1 +" "+ str2 + " " + str3+ " " + str4
    return date
}



getDateAndTime = {
    getTime,
    getDate
} 

module.exports = getDateAndTime