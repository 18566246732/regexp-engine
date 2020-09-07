// expect function deepCloneCycleObject(object:any) {
//     const rawObjProto = Object.getPrototypeOf(Object);

// }

export function decycle(object: any, replacer: any) {
    "use strict";
    const objects = new WeakMap();     // object to path mappings
    // const protoMap = new WeakMap();
    return (function derez(value, path) {
        let oldPath;   // The path of an earlier occurance of value
        let nu: any;         // The new object or array
        if (replacer !== undefined) {
            value = replacer(value);
        }
        if (
            typeof value === "object"
            && value !== null
            && !(value instanceof Boolean)
            && !(value instanceof Date)
            && !(value instanceof Number)
            && !(value instanceof RegExp)
            && !(value instanceof String)
        ) {
            oldPath = objects.get(value);
            if (oldPath !== undefined) {
                return {$ref: oldPath};
            }
            objects.set(value, path);
            if (Array.isArray(value)) {
                nu = [];
                value.forEach((element, i) => {
                    nu[i] = derez(element, path + "[" + i + "]");
                });
            } else {
                nu = {};
                Object.keys(value).forEach((name) => {
                    nu[name] = derez(
                        value[name],
                        path + "[" + JSON.stringify(name) + "]"
                    );
                });
            }
            Object.setPrototypeOf(nu, Object.getPrototypeOf(value));
            return nu;
        }
        return value;
    }(object, "$"));
}

export function retrocycle($: any) {
    "use strict";
    const px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;
    (function rez(value) {
        if (value && typeof value === "object") {
            if (Array.isArray(value)) {
                value.forEach((element, i)  => {
                    if (typeof element === "object" && element !== null) {
                        const path = element.$ref;
                        if (typeof path === "string" && px.test(path)) {
                            // tslint:disable-next-line: no-eval
                            value[i] = eval(path);
                        } else {
                            rez(element);
                        }
                    }
                });
            } else {
                Object.keys(value).forEach((name) => {
                    const item = value[name];
                    if (typeof item === "object" && item !== null) {
                        const path = item.$ref;
                        if (typeof path === "string" && px.test(path)) {
                            // tslint:disable-next-line: no-eval
                            value[name] = eval(path);
                        } else {
                            rez(item);
                        }
                    }
                });
            }
        }
    }($));
    return $;
}



