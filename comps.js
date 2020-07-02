var comp1 = {
    "name": "comp1",
    "tag": "span",
    "id": "myspan",
    "data": "haydaaa",
    "style": {
        "color": "blue",
    },
    "parent_id": "deneme",
};

var comp2 = {
    "name": "comp2",
    "tag": "p",
    "id": "myspan",
    "data": "component delete now!",
    "style": {
        "color": "lightcoral",
        "width": "40%",
        "textShadow": "1px 1px 1px yellow"
    },
    "submodule": "x"
};

var card1 = {
    "name": "card1",
    "type": "card",
    "id": "card1",
    "data": "güzel",
    "parent_id": "container_1",
}

var liObj = {
    "name": "liObj",
    "tag": "li",
    "id": "myli",
    "data": "this is inner",
    "style": {
        "color": "red",
    },
    "parent_id": "myul",
};

var liObj2 = {
    "name": "liObj2",
    "tag": "li",
    "id": "myli2",
    "data": "this is inner 2",
    "style": {
        "color": "red",
    },
    "parent_id": "myul",
};

var myList = {
    "name": "myList",
    "tag": "ul",
    "id": "myul",
    "style": {
        "color": "cyan",
        "backgroundColor": "pink"
    },
    "parent_id": "deneme",
};

var myList2 = {
    "name": "myList2",
    "tag": "ol",
    "id": "myList2",
    "style": {
        "color": "blue",
        "backgroundColor": "cyan"
    },
};


export default {
    comp1,
    myList,
    liObj,
    liObj2,
    card1,
    comp2,
    myList2
};
