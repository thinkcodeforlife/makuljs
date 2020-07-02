console.log("makul.js started");

function checkCSS(el) {
    var sheets = document.styleSheets, ret = [];
    el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector 
        || el.msMatchesSelector || el.oMatchesSelector;
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (el.matches(rules[r].selectorText)) {
                ret.push(rules[r].cssText);
            }
        }
    }
    return ret;
}

function checkCSSText(tagName) {
    for (var i = 0, len = document.styleSheets.length; i < len; i++) {
        for (var i2 = 0, len2 = document.styleSheets[i].rules.length; i2 < len2; i2++) {
            if (tagName == document.styleSheets[i].rules[i2].selectorText) {
                return true
            }
        }
    }
    return false
}

var dataframe = {
    columns: [],
    rows: [],
    meta: {},
    html: null,
    cssRules: [
        "table { font-family: arial, sans-serif; border-collapse: collapse; width: 100%; }",
        "td, th { border: 1px solid #dddddd; text-align: left; padding: 8px; }",
        "tr:nth-child(even) { background-color: #dddddd; }"
    ],
    getColumns: function () {
        return this.columns;
    },
    getRows: function () {
        return this.rows;
    },
    getMeta: function () {
        return this.meta;
    },
    setID: function () {
        var id = this.meta.id || "Table_" + Math.floor(Math.random() * 100);
        this.meta.id = id;
    },
    getID: function () {
        return this.meta.id
    },
    setName: function () {
        var name = this.meta.name || this.getID();
        this.meta.name = name;
    },
    getName: function () {
        return this.meta.name;
    },
    getParent: function () {
        return document.getElementById(this.meta.parent_id) || document.body;
    },
    getElement: function () {
        return document.getElementById(this.getID());
    },
    setCSSRules: function () {
        var checkCSS = checkCSSText("table");
        if (checkCSS) return false;
        var style = document.createElement('style');
        document.head.appendChild(style);
        this.cssRules.forEach(cssRule => {
            style.sheet.insertRule(cssRule);
        });
    },
    createFromDicts: function (listOfDicts) {
        var new_df = Object.create(this);
        var columns = Object.keys(listOfDicts[0]);
        var rows = listOfDicts.map(dict => Object.values(dict));
        new_df.columns = columns;
        new_df.rows = rows;
        new_df.setID();
        new_df.setName();
        new_df.createHTML();
        new_df.setCSSRules();
        return new_df;
    },
    createFromLists: function (lists) {
        var new_df = Object.create(this);
        new_df.columns = lists[0];
        new_df.rows = lists.slice(1, lists.length);
        new_df.setID();
        new_df.setName();
        new_df.createHTML();
        new_df.setCSSRules();
        return new_df;
    },
    create: function (options) {
        var new_df = Object.create(this);
        new_df.columns = options["columns"];
        new_df.rows = options["rows"];
        for (var i in options["meta"]) {
            new_df.meta[i] = options["meta"][i];
        }
        new_df.setID();
        new_df.setName();
        new_df.createHTML();
        new_df.setCSSRules();
        return new_df;
    },
    add: function (data) {
        var c = 0;
        var row = [];
        for (var i in data) {
            row[c] = data[i];
            c++;
        }
        this.rows.push(row);
    },
    merge: function (df2) {
        var columns1 = this.getColumns();
        var columns2 = df2.getColumns();
        var idx1 = -1, idx2 = -1, compare = 1, factor = null;
        columns1.forEach(column => {
            idx1 = columns1.indexOf(column);
            idx2 = columns2.indexOf(column);
            factor = idx1 == idx2;
            compare *= factor;
        });
        if ( compare ) {
            var new_df = Object.create(this);
            new_df.rows += df2.getRows();
            return new_df;
        }
        return null;
    },
    delete: function (row_id) {
        var row = this.rows.filter(row => row.id == row_id)[0];
        this.rows.pop(row);
        console.log("row deleted:", row);
        
    },
    edit: function (row_id, new_row) {
        var row = this.rows.filter(row => row.id == row_id)[0];
        var idx = this.rows.indexOf(row);
        this.rows[idx] = new_row;
    },
    drop: function () {
        this.columns = [];
        this.rows = [];
        this.meta = {};
    },
    addCSS: function (desiredCSSOptions) {
        var el = this.getElement();
        for (var i in desiredCSSOptions) {
            el.style[i] = desiredCSSOptions[i];
        }
    },
    createHTML: function () {
        var html = `<h3>${this.getName()}</h3>`;
        html += `<table id="${this.getID()}"><thead><tr>`;
        this.columns.forEach(column => {
            html += `<th>${column}</th>`;
        });
        html += `</tr></thead><tbody>`;
        this.rows.forEach(row => {
            html += `<tr>`;
            row.forEach(col => {
                html += `<td>${col}</td>`;
            });
            html += `</tr>`;
        });
        html += `</tbody></table>`;
        this.html = html;
    },
    getHTML: function () {
        return this.html;
    },
    print: function () {
        this.getParent().insertAdjacentHTML('beforeend', this.getHTML());
    },
};

var makul = {
    componentList: null,
    componentTypes: ["card", "drawing", "paragraph", "header", "img", "list", "input", "auth", "container", "view", "button", "table", "link"],
    requiredFields: ["id", "name", "data"],
    linkOptions: {
        highlightable: false,
        selectable: false,
        style: {
            fontFamily: "sans serif"
        },
    },
    paragraphOptions: {
        highlightable: false,
        selectable: false,
        style: {
            fontFamily: "consolas"
        },
    },
    containerOptions: {
        highlightable: false,
        selectable: false,
        style :{
            opacity: 1,
            // textAlign: "center",
            padding: "2px",
            margin: "auto",
            color: "black",
            backgroundColor: "Ivory",
            // borderColor: "darkgray",
            // borderStyle: "solid",
            // borderWidth: "1px",
            // boxShadow: "5px 5px 5px grey",
            width: "98%",
        }
    },
    cardOptions: {
        highlightable: true,
        selectable: true,
        style :{
            opacity: 1,
            textAlign: "center",
            padding: "5px",
            margin: "auto",
            color: "darkblue",
            backgroundColor: "ghostwhite",
            borderColor: "darkgray",
            borderStyle: "solid",
            borderWidth: "1px",
            boxShadow: "5px 5px 5px grey",
            width: "10%",
        }
    },
    hoverOptions: {
        backgroundColor: "background-color: AliceBlue;",
        fontSize: "font-size: 16px;",
        border: "border: 2px solid MidnightBlue;",
        boxShadow: "box-shadow: 3px 3px 3px CornflowerBlue;",
    },
    selectOptions: {
        backgroundColor: "background-color: Beige;",
        // fontSize: "font-size: 16px;",
        border: "border: 1px solid Chartreuse;",
        boxShadow: "box-shadow: 1px 1px 1px DeepSkyBlue;",
    },
    notificationOptions: {
        time: 1500,
        style: {
            backgroundColor: "LightGoldenRodYellow",
            borderColor: "Gold",
            borderStyle: "solid",
            borderWidth: "1px",
            boxShadow: "3px 3px 3px grey",
            position: "fixed",
            top: "80px",
            right: "50px",
            height: "40px",
            width: "300px",
            margin: "3px",
            padding: "4px",
            textAlign: "center",
            verticalAlign: "middle",
            // opacity: "0.85"
        }
    },
    elems: [],
    selectedElems: [],
    openNotifications: [],
    views: [],
    routes: [],
    getOptions: function (tagName) {
        var highlightable = false;
        var selectable = false;
        if (tagName.toLowerCase() == "div") {
            return {
                highlightable: true,
                selectable: true
            }
        }
        return {highlightable, selectable}
    },
    displayRoute: function (route_id) {
        var route = this.routes.filter(r => r.id == route_id)[0];
        var view = this.views.filter(v => v.id == route["view"])[0];
        var elems = view["elements"];
        console.log("route", route);
        console.log("view", view);
        console.log("elems", elems);
        var all = document.getElementsByTagName("*");
        var next_id = "";
        for (var i = 0, max = all.length; i < max; i++) {
            var compare = document.body.contains(all[i]);
            next_id = all[i].id
            console.log("compare", compare);
            console.log("next_id", next_id);
            if (compare) {
                console.log("next_id->2", next_id);
                console.log("indexOf", );
                if (elems.indexOf(next_id) == -1) {
                    console.log("next_id->2->3", next_id);
                    // all[i].style.border = "1px solid Green";
                    all[i].style.display = "none";
                }
            }
        }
    },
    destroyNotifications: function () {
        this.openNotifications.forEach((id) => {
            window.setTimeout(() => this.destroyElem(id), this.notificationOptions.time);
        });
        this.openNotifications = [];
    },
    fadeIn: function (elem, fadeInBottomValue, fadeInTopValue) {
        var op = 0.1;  // initial opacity
        var top = parseInt(elem.style.top);
        console.log("top", top);
        console.log("fadeInTopValue", fadeInTopValue);
        if (top < fadeInTopValue) {
            top = fadeInBottomValue;
        }
        elem.style.opacity = op;
        elem.style.display = 'block';
        var timer = setInterval(function () {
            if (op >= 0.85){
                clearInterval(timer);
            }
            elem.style.opacity = op;
            elem.style.filter = 'alpha(opacity=' + op * 100 + ")";
            top -= 3;
            elem.style.top = top + "px";
            op += op * 0.1;
        }, 5);
    },
    highlightDivision: function (event) {
        var elem = event.srcElement;
        var hoverOptions = this.hoverOptions;
        elem.style.cssText += Object.values(hoverOptions).join(' ');
    },
    dampDivision: function (event, styleOptions) {
        var elem = event.srcElement;
        elem.style.cssText = styleOptions;
        if (this.selectedElems.indexOf(elem) > -1)
            this.selectedElems.pop(elem);
    },
    selectDivision: function (event) {
        var elem = event.srcElement;
        var selectedElems = this.selectedElems;
        if (selectedElems.indexOf(elem) == -1) {
            selectedElems.push(elem);
        }
        selectedElems.forEach((elem) => {
            elem.style.cssText += Object.values(this.selectOptions).join(' ');
            this.openNotificationCard(elem);
        });
    },
    subscribeAllEvents: function () {
        this.elems.forEach(id => {
            this.subscribeEvents(id);
        });
    },
    subscribeEvents: function (id) {
        var elem = document.getElementById(id);
        var styleOptions = elem.style.cssText;
        var defaultOptions = this.getOptions(elem.tagName);
        // console.log("tag of elem:", elem.tagName);
        // console.log("defaultOptions:", defaultOptions);
        var highlightable = defaultOptions["highlightable"];
        var selectable = defaultOptions["selectable"];
        if (highlightable && selectable) {
            this.subscribeBothEvents(elem, styleOptions);
        } else if (highlightable) {
            this.subscribeHighlightEvents(elem, styleOptions);
        } else if (selectable) {
            this.subscribeSelectEvents(elem, styleOptions);
        }
        
    },
    subscribeHighlightEvents: function (elem, styleOptions) {
        elem.addEventListener("mouseenter", this.highlightDivision.bind(this));
        elem.addEventListener("mouseleave", (e) => this.dampDivision(e, styleOptions));
    },
    subscribeSelectEvents: function (elem, styleOptions) {
        elem.addEventListener("mouseleave", (e) => this.dampDivision(e, styleOptions));
        elem.addEventListener("click", this.selectDivision.bind(this));
    },
    subscribeBothEvents: function (elem, styleOptions) {
        elem.addEventListener("mouseenter", this.highlightDivision.bind(this));
        elem.addEventListener("mouseleave", (e) => this.dampDivision(e, styleOptions));
        elem.addEventListener("click", this.selectDivision.bind(this));
    },
    appendElement: function(elem, parent_id) {
        if (parent_id != 0) {
            var parent = document.getElementById(parent_id);
        } else {
            var parent = document.body;
        }
        parent.innerHTML = parent.innerHTML + "<br>";
        parent.appendChild(elem);
        if (!(elem.id in this.elems)) {
            this.elems.push(elem.id);
        }
    },
    openNotificationCard: function (elem) {
        var new_id = elem.id + "_notification";
        if (document.getElementById(new_id) == null && this.openNotifications.indexOf(new_id) != -1) return;
        if (document.getElementById(new_id) == null) {
            var elCard = this.createCard(this.notificationOptions.style);
            elCard.id = new_id;
            elCard.innerText = `Element: ${elem.id} is selected`;
            console.log("element is absent!");
            document.body.appendChild(elCard);
        } else {
            var elCard = document.getElementById(new_id);
            elCard.style.display = 'block';
        }
        // console.log("elCard.style.display", elCard.style.display);
        var fadeInBottomValue = parseInt(this.notificationOptions.style.top);
        var fadeInTopValue = fadeInBottomValue - parseInt(this.notificationOptions.style.height);
        this.fadeIn(elCard, fadeInBottomValue, fadeInTopValue);
        this.openNotifications.push(new_id);
        this.destroyNotifications();
    },
    destroyElem: function (id) {
        var elem = document.getElementById(id);
        elem.style.display = 'none';
    },
    createCard: function (styleOptions) { 
        var el = document.createElement("div");
        for (var i in this.cardOptions.style) {
            el.style[i] = this.cardOptions.style[i];
        }
        for (var i in styleOptions) {
            el.style[i] = styleOptions[i];
        }
        return el;
    },
    createContainer: function (styleOptions) { 
        var el = document.createElement("div");
        for (var i in this.containerOptions["style"]) {
            el.style[i] = this.containerOptions.style[i];
        }
        for (var i in styleOptions) {
            el.style[i] = styleOptions[i];
        }
        return el;
    },
    createView: function (options) {
        var view = document.createElement("div");
        return view;
    },
    create: function(componentType, options) {
        var divs = document.getElementsByTagName("div");
        var l = divs.length;
        for (var i = 0; i < l; i++) {
            if (options["id"] == divs[i].id)
                return
        }
        // var highlightable = false;
        // var selectable = false;
        var id = options["id"];
        switch(componentType) {
            case "card":
                var elCard = null;
                if (Array.isArray(options.data)) {
                    options.data.forEach(i => {
                        id = options.name + options.data.indexOf(i);
                        elCard = this.createCard(options["style"]);
                        elCard.id = id;
                        elCard.innerText = i;
                        var parent_id = options["parent_id"] || 0;
                        this.appendElement(elCard, parent_id);
                    });
                } else {
                    elCard = this.createCard(options["style"]);
                    elCard.id = id;
                    if (typeof options["data"] !== "undefined")
                        elCard.innerText = options["data"];
                    var parent_id = options["parent_id"] || 0;
                    this.appendElement(elCard, parent_id);
                }
                // highlightable = this.cardOptions["highlightable"];
                // if (typeof options["highlightable"] !== "undefined") {
                //     highlightable = options["highlightable"];
                // }
                // selectable = this.cardOptions["selectable"];
                // if (typeof options["selectable"] !== "undefined") {
                //     selectable = options["selectable"];
                // }
                break;
            case "view":
                var elements = options["elements"];
                var viewObj = { id, elements };
                this.views.push(viewObj);
                break;
            case "drawing":
                break;
            case "paragraph":
                var p = document.createElement("p");
                p.id = id;
                p.innerText = options["data"];
                p.style.fontFamily = this.paragraphOptions["style"].fontFamily;
                // highlightable = this.paragraphOptions["highlightable"];
                // if (typeof options["highlightable"] !== "undefined") {
                //     highlightable = options["highlightable"];
                // }
                // selectable = this.paragraphOptions["selectable"];
                // if (typeof options["selectable"] !== "undefined") {
                //     selectable = options["selectable"];
                // }
                var parent_id = options["parent_id"] || 0;
                this.appendElement(p, parent_id);
                break;
            case "header":
                break;
            case "img":
                break;
            case "list":
                break;
            case "input":
                break;
            case "auth":
                break;
            case "container":
                var elCon = this.createContainer(options["style"]);
                elCon.id = id;
                document.body.appendChild(elCon);
                // highlightable = this.containerOptions["highlightable"];
                // if (typeof options["highlightable"] !== "undefined") {
                //     highlightable = options["highlightable"];
                // }
                // selectable = this.containerOptions["selectable"];
                // if (typeof options["selectable"] !== "undefined") {
                //     selectable = options["selectable"];
                // }
                break;
            case "route":
                var view = options["view"];
                var route = options["route"];
                var routeObj = { id, view, route };
                this.routes.push(routeObj);
                break;
            case "link":
                var a = document.createElement("a");
                a.id = id;
                a.innerText = options["data"];
                a.href = options["url"];
                a.style.fontFamily = this.linkOptions["style"].fontFamily;
                // highlightable = this.linkOptions["highlightable"];
                // if (typeof options["highlightable"] !== "undefined") {
                //     highlightable = options["highlightable"];
                // }
                // selectable = this.linkOptions["selectable"];
                // if (typeof options["selectable"] !== "undefined") {
                //     selectable = options["selectable"];
                // }
                // a.target = "_blank";
                if (typeof options["route_id"] !== "undefined") {
                    var route_id = options["route_id"];
                    a.onclick = function () {
                        makul.displayRoute(route_id);
                    };
                }
                var parent_id = options["parent_id"] || 0;
                this.appendElement(a, parent_id);
                break;
            case "table":
                var html = options["data"];
                var parent_id = options["parent_id"] || 0;
                var elem = document.getElementById(parent_id) || document.body;
                elem.insertAdjacentHTML('beforeend', html);
                break;
            case "button":
                break;
        }
        // console.log("componentType", componentType);
        // console.log("highlightable", highlightable);
        // console.log("selectable", selectable);
        // if (highlightable && selectable) {
        //     this.subscribeAllEvents();
        // } else if (highlightable) {
        //     this.subscribeHighlightEvents(id);
        // } else if (selectable) {
        //     this.subscribeSelectEvents(id);
        // }
        this.subscribeAllEvents();
    },
    display: function(component, options) {
        var highlightable = false;
        var selectable = false;
        var componentList = this.componentList;
        var c = componentList[component];
        if (typeof c !== "undefined" && !c["displayed"]){
            if (typeof c["type"] !== "undefined" && c["type"] == "card") {
                
                var el = this.createCard();
            } else {
                var el = document.createElement(c["tag"]);
                if (typeof c["name"] !== "undefined") {
                    for (var i in c["style"]) {
                        el.style[i] = c["style"][i];
                    }
                }
            }
            el.id = c["id"];
            if (typeof c["name"] !== "undefined")
                el.name = c["name"];
            if (typeof c["data"] !== "undefined")
                el.innerText = c["data"];
            if (typeof options !== "undefined") {
                for (var i in options["style"]) {
                    el.style[i] = options["style"][i];
                };
                var listElem = null;
                if (Array.isArray(options.data)) {
                    if (c.tag == "ol" || c.tag == "ul") {
                        options.data.forEach(i => {
                            listElem = document.createElement("li");
                            listElem.innerText = i;
                            el.appendChild(listElem);
                        });
                    }
                }
            }
            var parent_id = c["parent_id"] || 0;
            this.appendElement(el, parent_id);
            c["displayed"] = true;
            if (c["tag"] == "ul") {
                for(var elem in componentList) {
                    var item = componentList[elem];
                    if (item["tag"] == "li" && item["parent_id"] == c["id"]) {
                        this.display(item["name"]);
                    }
                }
            }
        }
        if (typeof c["highlightable"] !== "undefined") {
            highlightable = c["highlightable"];
        }
        if (typeof c["selectable"] !== "undefined") {
            selectable = c["selectable"];
        }
        console.log("display::tag", c["tag"] ? c["tag"] : "no tag specified");
        console.log("display::componentType", c["type"] ? c["type"] : "no type specified");
        console.log("display::highlightable", highlightable);
        console.log("display::selectable", selectable);
        if (highlightable && selectable) {
            this.subscribeAllEvents();
        } else if (highlightable) {
            this.subscribeHighlightEvents(id);
        } else if (selectable) {
            this.subscribeSelectEvents(id);
        }
    }
}

export default makul;

export {
    dataframe
}
