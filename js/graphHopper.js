(function (doc) {
    var moduleMap = {};
    var fileMap = {};
    var readyFunctions = [];

    var noop = function () {
    };

    var uuid = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    var Gh = function () {
    };

    var addListener = document.addEventListener || document.attachEvent,
        removeListener = document.removeEventListener || document.detachEvent;

    var eventName = document.addEventListener ? "DOMContentLoaded" : "onreadystatechange";

    addListener.call(document, eventName, function () {
        for (var i = readyFunctions.length - 1; i >= 0; i--) {
            if (readyFunctions[i]) {
                for (var j = 0; j < readyFunctions[i].length; j++) {
                    readyFunctions[i][j]();
                }
            }
        }
    }, false);

    //简单的对象属性复制，把源对象上的属性复制到自己身上，只复制一层
    Object.prototype.extend = function (base) {
        for (var key in base) {
            if (base.hasOwnProperty(key)) {
                this[key] = base[key];
            }
        }
        return this;
    };

    var Observer = {
        on: function (eventType, handler) {
            if (!this.eventMap) {
                this.eventMap = {};
            }

            //multiple event listener
            if (!this.eventMap[eventType]) {
                this.eventMap[eventType] = [];
            }
            this.eventMap[eventType].push(handler);
        },

        off: function (eventType, handler) {
            for (var i = 0; i < this.eventMap[eventType].length; i++) {
                if (this.eventMap[eventType][i] === handler) {
                    this.eventMap[eventType].splice(i, 1);
                    break;
                }
            }
        },

        fire: function (event) {
            var eventType = event.type;
            if (this.eventMap && this.eventMap[eventType]) {
                for (var i = 0; i < this.eventMap[eventType].length; i++) {
                    this.eventMap[eventType][i](event);
                }
            }
        }
    };

    window.Gh = Gh.extend({
        base: "js/modules/",

        define: function (name, dependencies, factory) {
            if (!moduleMap[name]) {
                var module = {
                    name: name,
                    dependencies: dependencies,
                    factory: factory
                };

                moduleMap[name] = module;
            }

            return moduleMap[name];
        },

        use: function (name) {
            var module = moduleMap[name];

            if (!module.entity) {
                var args = [];
                for (var i = 0; i < module.dependencies.length; i++) {
                    if (moduleMap[module.dependencies[i]].entity) {
                        args.push(moduleMap[module.dependencies[i]].entity);
                    }
                    else {
                        args.push(this.use(module.dependencies[i]));
                    }
                }

                module.entity = module.factory.apply(noop, args);
            }

            return module.entity;
        },

        require: function (pathArr, callback) {
            var slashDotSlashRe = /\/\.\//g;
            var dotRe = /\./g;
//      var base = this.base;
            var bases = {
                'Gh': this.base
            };
            var filePath = [];
            for (var i = 0; i < pathArr.length; i++) {
                filePath[i] = getPath(pathArr[i]);
//        loadFile(pathArr[i]);
                loadFile(filePath[i]);
            }

            function getPath(className) {
                var path = '',

                    prefix = getPrefix(className);

                if (prefix.length > 0) {
                    if (prefix === className) {
                        return bases[prefix];
                    }

                    path = bases[prefix];
                    className = className.substring(prefix.length + 1);
                }

                if (path.length > 0) {
                    path += '/';
                }

                return path.replace(slashDotSlashRe, '/') + className.replace(dotRe, "/") + '.js';
            }

            function getPrefix(className) {
                var prefix, deepestPrefix = '';

                if (bases.hasOwnProperty(className)) {
                    return className;
                }

                for (prefix in bases) {
                    if (bases.hasOwnProperty(prefix) && prefix + '.' === className.substring(0, prefix.length + 1)) {
                        if (prefix.length > deepestPrefix.length) {
                            deepestPrefix = prefix;
                        }
                    }
                }

                return deepestPrefix;
            }

            function loadFile(file) {
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', file);
                script.onload = script.onreadystatechange = function () {
                    if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                        fileMap[file] = true;
                        //head.removeChild(script);
                        checkAllFiles();
                    }
                };
                head.appendChild(script);
            }

            function checkAllFiles() {
                var allLoaded = true;
                for (var i = 0; i < filePath.length; i++) {
                    if (!fileMap[filePath[i]]) {
                        allLoaded = false;
                        break;
                    }
                }

                if (allLoaded && callback) {
                    callback();
                }
            }
        },

        ready: function (handler, priority) {
            priority = (priority == null) ? 1 : priority;

            if (!readyFunctions[priority]) {
                readyFunctions[priority] = [];
            }
            readyFunctions[priority].push(handler);
        },

        error: function () {

        },

        log: function (obj) {
            try {
                console.log(obj);
            }
            catch (ex) {

            }
        }
    }).extend(Observer);

    //Observer
    Gh.define("Observer", [], function () {
        return Observer;
    });

    Gh.on("ready", function () {
        Gh.require(["Gh.core.binding"], function () {
            var binding = Gh.use("DOMBinding");
            binding.parse(doc.body);
        });
    });
})(document);
