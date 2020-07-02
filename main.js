console.log("main.js started");

import myModule from './makul.js';
import { dataframe } from './makul.js';
import comps from './comps.js';

// ----------------------------------------

// console.log(myModule);
myModule.componentList = comps;
// console.log(myModule);
// myModule.display("comp1");
// console.log(myModule);

var df_1 = dataframe.create({
    columns: ["b1", "b2", "b3"],
    rows: [[1 , 2, 3], ["yeah", "hayt", "dur"]],
    meta: {
        "id": "df1",
        "name": "Data Frame 1"
    }
});

var df_2 = dataframe.createFromDicts([{"h1": 1, "h2": 2, "h3": 3}, {"h1": "a", "h2": "b", "h3": "c"}]);
var df_3 = dataframe.createFromLists([["header1", "header2", "header3"], [1,2,3], ["a", "b", "c"]]);
var df_4 = dataframe.createFromLists([["header1", "header2", "header3"], [3,4,5], ["d", "e", "f"]]);

df_1.add([3 , 4, 5]);

var df_5 = df_3.merge(df_4);

df_1.print();
// df_2.print();
// df_3.print();
// ----------------------------------------

var myLi = ["list element 1", 2, "dur bea"];

myModule.create("container", {
    id: "container_1",
    "style": {
        "backgroundColor": "FloralWhite",
    }
});

myModule.create("card", {
    id: "fir",
    "style": {
        "width": "80%",
    }
});

myModule.create("card", {
    name: "main_cards",
    data: myLi,
    parent_id: "fir",
    "style": {
        "width": "90%",
        "boxShadow": "3px 3px 3px DeepPink"
    },
});


// ----------------------------------------

myModule.create("view", {
    id: "view_1",
    elements: ["container_1", "deneme"]
});

myModule.create("route", {
    id: "route_1",
    view: "view_1",
    route: "/home"
});

// ----------------------------------------

myModule.create("table", {
    id: "t1",
    data: df_5.getHTML(),
    "parent_id": "container_1",
});

myModule.create("paragraph", {
    id: "about",
    data: "this is about me not u!",
});

myModule.create("view", {
    id: "view_2",
    elements: ["about"]
});

myModule.create("route", {
    id: "route_2",
    view: "view_2",
    route: "/about"
});

myModule.create("link", {
    id: "link_1",
    data: "tıkla kazan",
    route_id: "route_2",
    url: "#"
});

myModule.create("link", {
    id: "link_2",
    data: "tıkla bea",
    route_id: "route_1",
    url: "#"
});



// ----------------------------------------

var el = document.getElementById("deneme");

el.onclick = function (e) {
    console.log(e);
};

// ----------------------------------------

el.addEventListener("click", function(){
    console.log("deneme");
    myModule.display("comp1");
    myModule.display("comp2");
    myModule.display("myList");
    myModule.display("card1");
    myModule.create("card", {
        "data": "this is a text",
        "id": "some_id",
        "parent_id": "deneme",
        "style": {
            "backgroundColor": "MediumOrchid"
        }
    });
    myLi.forEach(i => myModule.create("card", {
        "data": i,
        "id": "myLi_" + myLi.indexOf(i),
        "parent_id": "deneme"
    }));
    myModule.display("myList2", {
        data: myLi,
        "style": {
            "width": "30%",
            "boxShadow": "3px 3px 3px DarkTurquoise"
        },
    });
})