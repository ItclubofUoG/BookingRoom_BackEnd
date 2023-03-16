var mysql = require("mysql");
var con =  mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database:"booking_room"
});
var room = [];
async function insert(oldSchedule) {

    await con.connect(function(err){
        if (err) throw err;
        console.log("Connected");
    })
    await con.query("SELECT * FROM room", function (err, result, fields) {
        if (err) throw err;
        console.log(result);

        console.log(oldSchedule);

        const schedule = oldSchedule.map(([date, slot, roomName, cls]) => [date, slot, findIdByRoomName(result, roomName), cls]);

        console.log(schedule);
        con.query("INSERT INTO `schedule`(`Date` ,`Slot`, `Roomid`, `Class`) VALUES ?", [schedule], function (err, result, fields) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });
        con.end();
    });

};
const findIdByRoomName = (data, roomName) => {
    const foundObject = data.find(object => object.RoomName === roomName);
    return foundObject ? foundObject.id : null;
};
// insert([  
//     [ '2001-04-03T17:00:00.000Z', '4', 'G405', 'GBC0902' ],
//     [ '2001-04-04T17:00:00.000Z', '1', 'G405', 'GBC0902' ],
//     [ '2001-04-04T17:00:00.000Z', '2', 'G405', 'GBC0902' ],
// ]);
module.exports = {
	insert
};