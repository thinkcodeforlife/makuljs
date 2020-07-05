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
    instanceCount: 0,
    getSerie: function (columnName) {
        var idx = this.columns.indexOf(columnName);
        return this.rows.map(row => row[idx]);
    },
    sum: function (columnName) {
        return this.getSerie(columnName).reduce((a,b) => a + b, 0);
    },
    min: function (columnName) {
        return this.sum(columnName) / this.getSerie(columnName).length;
    },
    max: function (columnName) {
        return Math.max(this.getSerie(columnName));
    },
    min: function (columnName) {
        return Math.min(this.getSerie(columnName));
    },
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
        style.id = "table_style";
        document.head.appendChild(style);
        // this.append(document.head, style);
        this.cssRules.forEach(cssRule => {
            style.sheet.insertRule(cssRule);
        });
    },
    createFromDicts: function (listOfDicts) {
        this.instanceCount++;
        var new_df = Object.create(this);
        var columns = Object.keys(listOfDicts[0]);
        var rows = listOfDicts.map(dict => Object.values(dict));
        new_df.columns = columns;
        new_df.rows = rows;
        new_df.meta = { id: "From_Dicts_" + this.instanceCount };
        new_df.setID();
        new_df.setName();
        new_df.createHTML();
        new_df.setCSSRules();
        return new_df;
    },
    createFromLists: function (lists) {
        this.instanceCount++;
        var new_df = Object.create(this);
        new_df.columns = lists[0];
        new_df.rows = lists.slice(1, lists.length);
        new_df.meta = { id: "From_Lists_" + this.instanceCount };
        new_df.setID();
        new_df.setName();
        new_df.createHTML();
        new_df.setCSSRules();
        return new_df;
    },
    create: function (options) {
        this.instanceCount++;
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
        // var row = this.rows.filter(row => row.id == row_id)[0];
        // this.rows.pop(row);
        this.rows.splice(row_id, 1);
        console.log("row deleted:", row);
        
    },
    edit: function (row_id, new_row) {
        this.rows[row_id] = new_row
    },
    find: function (column, value) {
        var idx = this.columns.indexOf(column);
        return this.rows.filter(row => row[idx] == value);
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
    componentTypes: [
        "container", "card", "box",
        "header", "paragraph",
        "input", "auth", "link", "button",
        "drawing", "img",
        "dropdown", "list", "table"
    ],
    requiredFields: ["id", "name", "data"],
    headerOptions: {
        tag: "h1",
        style: {
            color: "red"
        }
    },
    inputOptions: {
        tag: "input",
        style: {
            width: "50%"
        }
    },
    authOptions: {
        tag: "form",
        style: {
            color: "green"
        }
    },
    buttonOptions: {
        tag: "button",
        style: {
            color: "Lavender"
        }
    },
    drawingOptions: {
        tag: "canvas",
        style: {
            color: "LavenderBlush"
        }
    },
    imgOptions: {
        tag: "img",
        style: {
            border: "1px solid red",
            borderRadius: "50%",
        }
    },
    dropdownOptions: {
        tag: "select",
        style: {
            color: "red"
        }
    },
    listOptions: {
        tag: "ul",
        style: {
            color: "red"
        }
    },
    tableOptions: {
        tag: "table",
        style: {
            color: "blue"
        }
    },
    boxOptions: {
        highlightable: false,
        selectable: false,
        special: true,
        // messageType: "warning",
        tag: "div",
        style: {
            fontFamily: "Bahnschrift",
            textAlign: "center",
            width: "5%",
            margin: "0",
            padding: "1px",
            // opacity: 1,
            color: "black",
            backgroundColor: "darkgrey",
            // borderColor: "red",
            // borderStyle: "solid",
            // borderWidth: "1px",
            // boxShadow: "5px 5px 5px red",
        }
    },
    linkOptions: {
        highlightable: false,
        selectable: false,
        special: true,
        tag: "a",
        style: {
            fontFamily: "sans serif",
            color: "Green"
        },
    },
    paragraphOptions: {
        highlightable: true,
        selectable: false,
        tag: "p",
        style: {
            fontFamily: "consolas"
        },
    },
    containerOptions: {
        highlightable: false,
        selectable: false,
        tag: "div",
        style: {
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
        tag: "div",
        style: {
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
    defaultRouteId: null,
    changeActiveRouteId: function (routeId) {
        var routes = this.routes;
        var routeObj = routes.filter(r => r.id == routeId)[0];
        var btnId = `nav_btn_${routeObj["route"]}`;
        var ids = routes.map(r => `nav_btn_${r.route}`);
        var elems = ids.map(id => document.getElementById(id));
        // console.log("routeObj", routeObj);
        // console.log("routeId", routeId);
        // console.log("btnId", btnId);
        // console.log("routes", routes);
        // console.log("ids", ids);
        // console.log("elems", elems);
        elems.forEach(e => {
            console.log("e.classList 1", e.classList);
            // console.log("e.id", e.id);
            console.log("e", e);
            if (e.id == btnId) {
                // e.classList = ["active"];
                // e.className = 'active';
                e.classList.add("active")
                console.log("e.classList 3", e.classList);
            } else {
                e.classList.remove("active");
            }
            console.log("e.classList 2", e.classList);
        });
    },
    viewOptions: {
        state: 0,
        viewStyleId: "view_style",
        navId: "topnav",
        buttonIds: [],
        activeRouteId: null,
        getHTML: function () {
            var html = `<div id="${this.viewOptions.navId}" class="topnav">`;
            var classActive = "";
            // console.log("this.routes", this.routes);
            var btnId = null;
            for (var i in this.routes) {
                btnId = `nav_btn_${this.routes[i].route}`;
                this.viewOptions.buttonIds.push({ id: btnId, route_id: this.routes[i].id});
                // console.log("btnId", btnId);
                if (this.viewOptions.activeRouteId == this.routes[i].id) {
                    classActive = 'class="active"';
                } else {
                    classActive = "";
                }
                // console.log("i", i);
                html += `<a id="${btnId}" ${classActive} href="#">${this.routes[i].route}</a>`;
            }
            html += "</div>";
            // console.log("html", html);
            return html;
        },
        addCSSRules: function () {
            // console.log("this.viewOptions.CSSRules", this.viewOptions.CSSRules);
            var style = document.createElement('style');
            style.id = this.viewOptions.viewStyleId;
            document.head.appendChild(style);
            // this.append(document.head, style);
            this.viewOptions.CSSRules.forEach(cssRule => {
                style.sheet.insertRule(cssRule);
            });
        },
        getButtons: function () {
            // console.log("this 3", this);
            // var ids = this.viewOptions.buttonIds.map(btn => btn.id);
            var ids = this.buttonIds.map(btn => btn.id);
            var elems = ids.map(id => document.getElementById(id));
            // console.log("getButtons::elems", elems);
            // console.log("getButtons::ids", ids);
            return elems
        },
        getRouteIds: function () {
            // var params = this.viewOptions.buttonIds.map(btn => btn.route_id);
            var params = this.buttonIds.map(btn => btn.route_id);
            // console.log("getRouteIds::params", params);
            return params;
        },
        clearButtonsEvents: function () {
            // console.log("this 2", this);
            // var elems = this.viewOptions.getButtons();
            var elems = this.getButtons();
            // console.log("clearButtonsEvents::elems", elems);
            elems.forEach(elem => {
                elem != null ? elem.removeEventListener("click", this.displayRoute, true) : console.log("clearButtonsEvents::elem", elem);
            });
            // this.viewOptions.buttonIds = [];
            this.buttonIds = [];
        },
        injectDefaultView: function () {
            if (!document.head.contains(document.getElementById(this.viewOptions.viewStyleId))) {
                this.viewOptions.addCSSRules = this.viewOptions.addCSSRules.bind(this);
                this.viewOptions.addCSSRules();
            }
            if (this.viewOptions.state) return;
            var rootElement = this.getAppRoot();

            this.viewOptions.activeRouteId = this.defaultRouteId;

            // console.log("this.viewOptions.activeRouteId", this.viewOptions.activeRouteId);
            // console.log("this.defaultRouteId", this.defaultRouteId);

            this.viewOptions.getHTML = this.viewOptions.getHTML.bind(this);
            var nav = document.getElementById(this.viewOptions.navId);
            if (document.body.contains(nav)) {
                // console.log("this.viewOptions.navId", this.viewOptions.navId);
                nav.parentNode.removeChild(nav);
            }
            // this.viewOptions.clearButtonsEvents = this.viewOptions.clearButtonsEvents.bind(this);

            // console.log("this", this);

            this.viewOptions.clearButtonsEvents();

            rootElement.insertAdjacentHTML('beforebegin', this.viewOptions.getHTML());

            // this.viewOptions.getRouteIds = this.viewOptions.getRouteIds.bind(this);
            // this.viewOptions.getButtons = this.viewOptions.getButtons.bind(this);

            var elems = this.viewOptions.getButtons();
            for (var i=0, max=elems.length; i<max;i++) {
                this.subscribeEvent("click", this.displayRoute, this.viewOptions.getRouteIds()[i], elems[i]);
            }
            this.viewOptions.state = 1;
        },
        CSSRules: [
            ".topnav { background-color: #333; overflow: hidden; }",
            ".topnav a { float: left;color: #f2f2f2; text-align: center; padding: 14px 16px; text-decoration: none; font-size: 17px; }",
            ".topnav a:hover { background-color: #ddd;color: black; }",
            ".topnav a.active { background-color: #4CAF50; color: white; }"
        ]
    },
    positionMapping: {
        1: "10%",
        2: "40%",
        3: "75%",
    },
    elems: [],
    selectedElems: [],
    openNotifications: [],
    // fragments: [],
    appendList: [],
    views: [],
    routes: [],
    context: [],
    rootId: null,
    getAppRoot: function () {
        var rootId = this.rootId || "app";
        var rootElement = document.getElementById(rootId);
        // console.log("getAppRoot::rootElement", rootElement);
        return rootElement;
    },
    setAppRoot: function (id) {
        this.rootId = id;
    },
    setContext: function (params) {
        this.context.push(params);
        this.injectContext();
    },
    injectContext: function () {
        var all = document.getElementsByTagName("*");
        var el = null;
        var dict = null;
        var key = null;
        // var replaced = null;
        for (var i in all) {
            el = all[i];
            var regPattern = /\{\{.*\}\}/;
            var a = regPattern.exec(el);
            try {
                var found = el.innerText.match(regPattern);
            } catch {
                var found = false;
            }            
            if (found && found.index == 0) {
                // console.log("found", found);
                // console.log("el", el);
                // console.log("regPattern", regPattern);
                // console.log("a", a);
                // console.log("this.context", this.context);
                for (var j in this.context) {
                    dict = this.context[j];
                    // console.log("j", j);
                    // console.log("dict", dict);
                    for (var k in Object.keys(dict)) {
                        key = Object.keys(dict)[k];
                        // replaced = el.innerText.replace(regPattern, dict[key]);
                        // console.log("key", key);
                        // console.log("Replace -->", replaced);
                        el.innerText = dict[key];
                    }
                }
            }
        }
    },
    getOptions: function (elem) {
        var componentType = elem.dataset.componentType;
        // console.log("componentType", componentType);
        var highlightable = false;
        var selectable = false;
        var options = {highlightable, selectable};
        if (typeof componentType !== "undefined") {
            var optionString = componentType + "Options";
            options = this[optionString];
            // console.log("optionString", optionString);
            // console.log("Options", options);
        };
        return options;
    },
    setDefaultStyles: function (elem) {
        var styleOptions = this.getOptions(elem)["style"];
        for (var i in styleOptions) {
            elem.style[i] = styleOptions[i];
        }
    },
    setStyles: function (element, styleOptions) {
        for (var i in styleOptions) {
            element.style[i] = styleOptions[i];
        }
    },
    displayRoute: function (route_id) {
        this.changeActiveRouteId(route_id);
        // var routes = this.routes;
        // console.log("routes", routes);
        // console.log("route_id", route_id);
        var route = this.routes.filter(r => r.id == route_id)[0];
        var view = this.views.filter(v => v.id == route["view"])[0];
        var elems = view["elements"];
        // console.log("route", route);
        // console.log("view", view);
        // console.log("elems", elems);
        // ------------------------------------------
        var elem = null;
        var comp = false;
        var v = null;
        this.elems.forEach(id => {
            comp = false;
            elem = document.getElementById(id);
            elems.forEach(i => {
                v = document.getElementById(i);
                if (v.contains(elem))
                    comp = true;
            });
            // if (!comp && elems.indexOf(id) == -1 && seen.indexOf(id) == -1) {
            if (!comp && elems.indexOf(id) == -1) {
                elem.style.display = "none";
            } else {
                elem.style.display = "block";
            }
        });
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
    subscribeEvent: function (eventType, func, param, elem) {
        func = func.bind(this);
        elem.addEventListener(eventType, () => {
            func(param);
        });
    },
    subscribeEvents: function (id) {
        var elem = document.getElementById(id);
        var styleOptions = elem.style.cssText;
        var defaultOptions = this.getOptions(elem);
        var highlightable = defaultOptions["highlightable"];
        var selectable = defaultOptions["selectable"];
        var special = defaultOptions["special"];
        if (special) {
            this.subscribeSpecialEvents(elem);
        }
        if (highlightable && selectable) {
            this.subscribeBothEvents(elem, styleOptions);
        } else if (highlightable) {
            this.subscribeHighlightEvents(elem, styleOptions);
        } else if (selectable) {
            this.subscribeSelectEvents(elem, styleOptions);
        }
        
    },
    subscribeSpecialEvents: function (elem) {

        // console.log("elem", elem);
        // console.log("this['displayRoute']", this["displayRoute"]);

        var funcName = elem.dataset.func;
        var func = this[funcName];
        var params = elem.dataset.params;
        var eventType = elem.dataset.eventType;

        // console.log("elem.dataset.componentType", elem.dataset.componentType);
        // console.log("elem.tagName", elem.tagName);
        // console.log("funcName", funcName);
        // console.log("func", func);
        // console.log("params", params);

        // elem.addEventListener("click", f.bind(this));
        // elem.addEventListener("click", () => {
        //     func(params);
        // });
        // elem.addEventListener("click", func.bind(this));

        elem.addEventListener(eventType, function () {
            func = func.bind(makul);
            func(params);
        });
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
    getParent: function (parent_id) {
        // console.log("parent_id", parent_id);
        if (parent_id == 0) {
            parent_id = "app";
        }
        var parent = document.getElementById(parent_id);
        // console.log("parent 0", parent);
        return parent;
    },
    // appendFragment: function (parent, child) {
    //     var fragment = new DocumentFragment();
    //     fragment.appendChild(child);
    //     this.fragments.push({ parent, fragment });
    // },
    // appendFragments: function () {
    //     this.fragments.forEach(i => {
    //         i.parent.appendChild(i.fragment);
    //     })
    // },
    appendAll: function () {
        console.log("this.appendList", this.appendList);
        var parent = null;
        this.appendList.forEach(item => {
            parent = item["parent"];            
            console.log("parent 1", parent);
            if (parent == null) {
                parent = this.getParent(item["parent_id"]);
                console.log("parent 2", parent);
            }
            console.log("parent 3", parent);
            parent.innerHTML = parent.innerHTML + "<br>";
            parent.appendChild(item["child"]);
        });
    },
    append: function (parent_id, parent, child) {
        this.appendList.push({ parent_id, parent, child });
    },
    appendElement: function(elem, parent_id) {
        parent = this.getParent(parent_id);
        parent.appendChild(elem);
        // this.append(parent_id, parent, elem);
        if (!(elem.id in this.elems)) {
            this.elems.push(elem.id);
        }
    },
    setPosition: function (elem, verticalPosition, horizontalPosition) {
        elem.style.margin = 0;
        elem.style.position = "relative";
        elem.style.display = "inline-block";
        var vp = this.positionMapping[verticalPosition];
        var hp = this.positionMapping[horizontalPosition];
        elem.style.top = vp;
        elem.style.left = hp;
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
    close: function (parent_id) {
        // console.log("parent_id", parent_id);
        if (typeof parent_id !== "undefined") {
            var elem = document.getElementById(parent_id);
            // console.log("elem", elem);
            elem.style.display = 'none';
        }
    },
    getElementTag: function (componentType) {
        var optionString = componentType + "Options";
        var options = this[optionString];
        return options["tag"];
    },
    createComponent: function (componentType, options) {
        var id = options["id"];
        var parent_id = options["parent_id"] || 0;
        var styleOptions = options["style"];
        // console.log("4 guys", id, parent_id, componentType, styleOptions);
        var element = this.createElement(id, parent_id, componentType, styleOptions);
        if (typeof options["data"] !== "undefined")
            element.innerText = options["data"];
        if (typeof options["function"] !== "undefined") {
            var funcName = options["function"]["name"];
            var params = options["function"]["parameters"];
            var eventType = options["function"]["eventType"];
            element.dataset.func = funcName;
            element.dataset.params = params;
            element.dataset.eventType = eventType;
        }
        return element;
    },
    createElement: function (id, parent_id, componentType, styleOptions) {
        var element = this.createElementMeta(componentType, styleOptions);
        element.id = id;
        this.appendElement(element, parent_id);
        return element;
    },
    createElementMeta: function (componentType, styleOptions) {
        var elementType = this.getElementTag(componentType);
        var element = document.createElement(elementType);
        element.dataset.componentType = componentType;
        this.setDefaultStyles(element);
        this.setStyles(element, styleOptions);
        return element;
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
    create: function(componentType, options) {
        var divs = document.getElementsByTagName("div");
        var l = divs.length;
        for (var i = 0; i < l; i++) {
            if (options["id"] == divs[i].id)
                return
        }
        var id = options["id"];
        switch(componentType) {
            case "card":
                // var elCard = null;
                if (Array.isArray(options.data)) {
                    options.data.forEach(i => {
                        var data = i;
                        id = options.name + options.data.indexOf(i);
                        var alteredOptions = { ...options, id, data }

                        // elCard = this.createCard(options["style"]);
                        // elCard.id = id;
                        // elCard.innerText = i;
                        // elCard.dataset.componentType = componentType;
                        // var parent_id = options["parent_id"] || 0;
                        // this.appendElement(elCard, parent_id);

                        this.createComponent(componentType, alteredOptions);
                    });
                } else {

                    // elCard = this.createCard(options["style"]);
                    // elCard.id = id;
                    // elCard.dataset.componentType = componentType;
                    // if (typeof options["data"] !== "undefined")
                    //     elCard.innerText = options["data"];
                    // var parent_id = options["parent_id"] || 0;
                    // this.appendElement(elCard, parent_id);

                    this.createComponent(componentType, options);

                }
                break;
            case "view":
                var elements = options["elements"];
                var viewObj = { id, elements };
                this.views.push(viewObj);
                break;
            case "drawing":
                break;
            case "paragraph":

                // var p = document.createElement("p");
                // p.id = id;
                // p.innerText = options["data"];
                // p.dataset.componentType = componentType;
                // this.setDefaultStyles(p);
                // var parent_id = options["parent_id"] || 0;
                // this.appendElement(p, parent_id);

                this.createComponent(componentType, options);

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
                this.createComponent(componentType, options);
                break;
            case "route":
                var view = options["view"];
                var route = options["route"];
                var routeObj = { id, view, route };
                this.routes.push(routeObj);
                var isDefault = options["default"];
                if (isDefault) this.defaultRouteId = id;
                // console.log("isDefault", isDefault);
                // console.log("this.defaultRouteId", this.defaultRouteId);
                this.viewOptions.state = 0;
                this.viewOptions.injectDefaultView = this.viewOptions.injectDefaultView.bind(this);
                this.viewOptions.injectDefaultView();
                break;
            case "link":
                var a = this.createComponent(componentType, options);
                a.href = options["url"];
                // a.target = "_blank";

                // var a = document.createElement("a");
                // a.id = id;
                // a.innerText = options["data"];
                // a.dataset.componentType = componentType;
                // this.setStyles(a);
                // var parent_id = options["parent_id"] || 0;
                // this.appendElement(a, parent_id);
                
                // if (typeof options["route_id"] !== "undefined") {
                //     var route_id = options["route_id"];
                //     a.dataset.params = route_id;
                //     a.dataset.func = "displayRoute";
                // }
                break;
            case "table":
                var html = options["data"];
                var parent_id = options["parent_id"] || "app";
                var elem = document.getElementById(parent_id);
                elem.insertAdjacentHTML('beforeend', html);
                break;
            case "button":
                break;
            case "box":
                var box = this.createComponent(componentType, options);
                this.setPosition(box, options["position"]["verticalPosition"], options["position"]["horizontalPosition"]);

                // var box = document.createElement("div");
                // box.id = id;
                // box.innerText = options["data"];
                // box.dataset.componentType = componentType;
                // var parent_id = options["parent_id"] || 0;
                // this.appendElement(box, parent_id);
                // this.setStyles(box);
                // box.dataset.func = options["onclick"];

                break;
            default:
                this.createComponent(componentType, options);
        }
        if (typeof options["submodule"] !== "undefined") {
            var submoduleName = c["submodule"]["name"];
            var verticalPosition = c["submodule"]["verticalPosition"];
            var horizontalPosition = c["submodule"]["horizontalPosition"];
            console.log("submoduleName 1", submoduleName);
            switch(submoduleName) {
                case "x":
                    console.log("submoduleName 2", submoduleName);
                    this.create("box", {
                        id: "switch_" + id,
                        data: "x",
                        parent_id: id,
                        function: {
                            name: "close",
                            parameters: id,
                            eventType: "click"
                        },
                        position: {
                            verticalPosition,
                            horizontalPosition
                        }
                    });
                    break;
            }
        }
        this.subscribeAllEvents();
    },
    display: function(component, options) {
        var componentList = this.componentList;
        var c = componentList[component];
        var id = c["id"];
        var el = null;
        if (typeof c !== "undefined" && !c["displayed"]){
            if (typeof c["type"] !== "undefined") {
                var type = c["type"];
                el = this.createComponent(type)
            } else {
                el = document.createElement(c["tag"]);
            }
            el.id = id;
            if (typeof c["style"] !== "undefined") {
                for (var i in c["style"]) {
                    el.style[i] = c["style"][i];
                }
            }
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
                            // this.append(el, listElem);
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
        if (typeof c["submodule"] !== "undefined") {
            var submoduleName = c["submodule"]["name"];
            var verticalPosition = c["submodule"]["verticalPosition"];
            var horizontalPosition = c["submodule"]["horizontalPosition"];
            // console.log("submodule 3", submoduleName);
            // console.log("verticalPosition", verticalPosition);
            // console.log("horizontalPosition", horizontalPosition);
            switch(submoduleName) {
                case "x":
                    // console.log("submoduleName 4", submoduleName);
                    this.create("box", {
                        id: "switch_" + id,
                        data: "x",
                        parent_id: id,
                        function: {
                            name: "close",
                            parameters: id,
                            eventType: "click"
                        },
                        position: {
                            verticalPosition,
                            horizontalPosition
                        }
                    });
                    break;
            }
        }
        // this.appendAll();
        this.subscribeAllEvents();
    }
}

export default makul;

export {
    dataframe
}
