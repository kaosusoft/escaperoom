exports.getDay = function (str) {
    var date = new Date(str);
    return date.getDay();
};

exports.getDayToday = function () {
    var date = new Date();
    return date.getDay();
};

exports.getDateYYYYMMDD = function () {
    var date = new Date();
    var dateStr = "";

    dateStr += (date.getFullYear());
    dateStr += '-';
    if (date.getMonth() < 9) { dateStr += '0'; }
    dateStr += (date.getMonth() + 1);
    dateStr += '-';
    if (date.getDate() < 10) { dateStr += '0'; }
    dateStr += (date.getDate());
    return dateStr;
}

exports.getDateYMDHMS = function () {
    var date = new Date();
    var dateStr = "";

    dateStr += (date.getYear() - 100);
    if (date.getMonth() < 9) { dateStr += '0'; }
    dateStr += (date.getMonth() + 1);
    if (date.getDate() < 10) { dateStr += '0'; }
    dateStr += (date.getDate());
    if (date.getHours() < 10) { dateStr += '0'; }
    dateStr += (date.getHours());
    if (date.getMinutes() < 10) { dateStr += '0'; }
    dateStr += (date.getMinutes());
    if (date.getSeconds() < 10) { dateStr += '0'; }
    dateStr += (date.getSeconds());
    return dateStr;
}


// { "name": "생강생강", "per":35.5,"win":11,"lose":20,
// "data": [
//     { "name": "그랜져", "win": 1, "lose": 1,"date":"211028" }, 
//     { "name": "미 야/36", "win": 2, "lose": 1,"date":"211028" }, 
//     { "name": "종지엔", "win": 0, "lose": 1,"date":"211028" }, 
//     { "name": "새우냠냠", "win": 1, "lose": 0,"date":"211028" }, 
//     { "name": "지은향39", "win": 1, "lose": 2,"date":"211028" }, 
//     { "name": "쉐인", "win": 0, "lose": 1,"date":"211028" }, 
//     { "name": "가오수", "win": 0, "lose": 2,"date":"211028" }, 
//     { "name": "백설탕=악당", "win": 4, "lose": 5,"date":"211028" }, 
//     { "name": "반디반디", "win": 0, "lose": 2,"date":"211028" }, 
//     { "name": "넬이/35", "win": 0, "lose": 3,"date":"211028" }, 
//     { "name": "순간/40", "win": 0, "lose": 1,"date":"211028" }, 
//     { "name": "팔목", "win": 0, "lose": 1,"date":"211028" }, 
//     { "name": "데리바사삭", "win": 1, "lose": 0,"date":"211028" }, 
//     { "name": "레딘", "win": 1, "lose": 0,"date":"211028" }] 
// }