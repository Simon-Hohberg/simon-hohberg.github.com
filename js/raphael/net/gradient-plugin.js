/*global Raphael:true*/
(function() {
    if (Raphael.vml) {
        Raphael.el.strokeLinearGradient = function() {
            // not supporting VML yet
            return this; // maintain chainability
        };
    } else {
        var setAttr = function(el, attr) {
            var key;
            if (attr) {
                for (key in attr) {
                    if (attr.hasOwnProperty(key)) {
                        el.setAttribute(key, attr[key]);
                    }
                }
            } else {
                return document.createElementNS("http://www.w3.org/2000/svg", el);
            }

            return null;
        };

        var defLinearGrad = function(defId, stops) {
            var def = setAttr("linearGradient");
            var i, l;
            def.id = defId;

            for (i = 0, l = stops.length; i < l; i += 1) {
                var stopEle = setAttr("stop");
                var stop = stops[i];
                setAttr(stopEle, stop);

                def.appendChild(stopEle);
            }

            return def;
        };

        Raphael.el.strokeLinearGradient = function(defId, width, stops) {

            if (stops) {
                this.paper.defs.appendChild(defLinearGrad(defId, stops));
            }

            setAttr(this.node, {
                "stroke": "url(#" + defId + ")",
                "stroke-width": width
            });

            return this; // maintain chainability
        };

        Raphael.st.strokeLinearGradient = function(defId, width, stops) {
            return this.forEach(function(el) {
                el.strokeLinearGradient(defId, width, stops);
            });
        };

        Raphael.fn.defineLinearGradient = function(defId, stops) {

            this.defs.appendChild(defLinearGrad(defId, stops));
        };
    }
}());
