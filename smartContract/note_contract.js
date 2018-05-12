"use strict";

var NoteItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.key = obj.key;
        this.author = obj.author;
        this.contentItems = obj.contentItems;
    } else {
        this.key = "";
        this.author = "";
        this.contentItems
        this.value = "";
    }
};

var NoteContentItem = function (text) {
    if (text) {
        var obj = JSON.parse(text);
        this.time = obj.time;
        this.content = obj.content;
    } else {
        this.time = "";
        this.content = "";
    }

}

NoteItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

NoteContentItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
}
//竟然不支持getLocalString方法 我也是醉了
function getNowTimeString(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+ 1;
    var day = date.getDate();
    var Times = adapterNum(year)+"年"+adapterNum(month)+"月"+adapterNum(day)+"日";
    return Times;
}

function adapterNum(val){
    var num = Number(val);
    if(num < 10) {
        num = '0' + num;
    }
    return num;
}

var Note = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new NoteItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

Note.prototype = {
    init: function () {
        // todo
    },

    save: function (key, value) {
        key = key.trim();
        value = value.trim();
        if (key === "" || value === "") {
            throw new Error("empty key / value");
        }
        if (value.length > 64 || key.length > 64) {
            throw new Error("key / value exceed limit length")
        }

        var from = Blockchain.transaction.from;
        var noteItem = this.repo.get(key);
        if (noteItem == null) {
            noteItem = new NoteItem();
            noteItem.author = from;
            noteItem.key = key;
            noteItem.contentItems = new Array();
        }
        var contentItem = new NoteContentItem();
        contentItem["time"] = getNowTimeString();
        contentItem["content"] = value;
        noteItem.contentItems.push(contentItem);
        this.repo.put(key, noteItem);
    },

    get: function (key) {
        key = key.trim();
        if (key === "") {
            throw new Error("empty key")
        }
        return this.repo.get(key);
    },



};
module.exports = Note;