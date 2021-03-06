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

myModule.setContext({
    title: "My App"
});

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
df_2.add(["x" , "b", 9]);

var df_5 = df_3.merge(df_4);

df_1.print();
// df_2.print();
// df_3.print();

// console.log("df_2 find h2 b", df_2.find("h2", "b"));
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
myModule.display("comp3");

myModule.create("view", {
    id: "view_1",
    elements: ["container_1", "mydiv"]
});

myModule.create("route", {
    id: "homeRoute",
    view: "view_1",
    route: "Home",
    default: true
});

// ----------------------------------------

myModule.create("table", {
    id: "t1",
    data: df_5.getHTML(),
    parent_id: "container_1",
});

myModule.create("paragraph", {
    id: "about",
    data: "this is about me not u!",
});

myModule.create("view", {
    id: "view_2",
    elements: ["about", "container_2"]
});

myModule.create("route", {
    id: "aboutRoute",
    view: "view_2",
    route: "About"
});

// myModule.create("link", {
//     id: "link_1",
//     data: "about",
//     url: "#",
//     function: {
//         name: "displayRoute",
//         parameters: "aboutRoute",
//         eventType: "click"
//     },
// });

// myModule.create("link", {
//     id: "link_2",
//     data: "Go home",
//     url: "#",
//     function: {
//         name: "displayRoute",
//         parameters: "homeRoute",
//         eventType: "click"
//     },
// });



// ----------------------------------------

myModule.create("container", {
    id: "container_2",
    "style": {
        "backgroundColor": "HoneyDew",
    }
});


var el = document.getElementById("container_2");

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

