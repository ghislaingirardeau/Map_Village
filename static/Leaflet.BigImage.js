!(function (t, e) {
    "function" == typeof define && define.amd ? define(["leaflet"], t) : "object" == typeof exports && (module.exports = t(require("leaflet"))), void 0 !== e && e.L && (e.L.YourPlugin = t(L));
})(function (t) {
    (t.Control.BigImage = t.Control.extend({
        options: {
            position: "topright",
            title: "Get image",
            printControlLabel: "&#128438;",
            printControlClasses: [],
            printControlTitle: "Get image",
            _unicodeClass: "bigimage-unicode-icon",
            maxScale: 10,
            minScale: 1,
            inputTitle: "Choose scale:",
            downloadTitle: "Download",
        },
        onAdd: function (t) {
            this._map = t;
            const e = this.options.printControlTitle,
                i = this.options.printControlLabel;
            let n = this.options.printControlClasses;
            return -1 != i.indexOf("&") && n.push(this.options._unicodeClass), this._createControl(i, e, n, this._click, this);
        },
        _click: function (t) {
            this._container.classList.add("leaflet-control-layers-expanded"), (this._containerParams.style.display = ""), this._controlPanel.classList.add("bigimage-unicode-icon-disable");
        },
        _createControl: function (e, i, n, o, s) {
            (this._container = document.createElement("div")),
                (this._container.id = "print-container"),
                this._container.classList.add("leaflet-bar"),
                this._container.addEventListener("wheel", t.DomEvent.stop),
                (this._containerParams = document.createElement("div")),
                (this._containerParams.id = "print-params"),
                (this._containerParams.style.display = "none"),
                this._createCloseButton();
            let a = document.createElement("h6");
            return (
                (a.style.width = "100%"),
                (a.innerHTML = this.options.inputTitle),
                this._containerParams.appendChild(a),
                this._createScaleInput(),
                this._createDownloadButton(),
                this._container.appendChild(this._containerParams),
                this._createControlPanel(n, s, e, i, o),
                t.DomEvent.disableScrollPropagation(this._container),
                t.DomEvent.disableClickPropagation(this._container),
                this._container
            );
        },
        _createDownloadButton: function () {
            (this._downloadBtn = document.createElement("div")),
                this._downloadBtn.classList.add("download-button"),
                (this._downloadBtn = document.createElement("div")),
                this._downloadBtn.classList.add("download-button"),
                (this._downloadBtn.innerHTML = this.options.downloadTitle),
                this._downloadBtn.addEventListener("click", () => {
                    let t = this._scaleInput.value;
                    !t || t < this.options.minScale || t > this.options.maxScale
                        ? (this._scaleInput.value = this.options.minScale)
                        : (this._containerParams.classList.add("print-disabled"), (this._loader.style.display = "block"), this._print());
                }),
                this._containerParams.appendChild(this._downloadBtn);
        },
        _createScaleInput: function () {
            (this._scaleInput = document.createElement("input")),
                (this._scaleInput.style.width = "100%"),
                (this._scaleInput.type = "number"),
                (this._scaleInput.min = this.options.minScale),
                (this._scaleInput.max = this.options.maxScale),
                (this._scaleInput.id = "scale"),
                (this._scaleInput.name = "scale"),
                this._containerParams.appendChild(this._scaleInput);
        },
        _createCloseButton: function () {
            let t = document.createElement("div");
            t.classList.add("close"),
                (t.innerHTML = "&times;"),
                t.addEventListener("click", () => {
                    this._container.classList.remove("leaflet-control-layers-expanded"), (this._containerParams.style.display = "none"), this._controlPanel.classList.remove("bigimage-unicode-icon-disable");
                }),
                this._containerParams.appendChild(t);
        },
        _createControlPanel: function (e, i, n, o, s) {
            let a = document.createElement("a");
            (a.innerHTML = n),
                (a.id = "print-btn"),
                a.setAttribute("title", o),
                e.forEach(function (t) {
                    a.classList.add(t);
                }),
                t.DomEvent.on(a, "click", s, i),
                this._container.appendChild(a),
                (this._controlPanel = a),
                (this._loader = document.createElement("div")),
                (this._loader.id = "print-loading"),
                this._container.appendChild(this._loader);
        },
        _getLayers: function (e) {
            let i = this,
                n = [];
            i._map.eachLayer(function (e) {
                n.push(
                    new Promise((n) => {
                        try {
                            e instanceof t.Marker && e._icon && e._icon.src
                                ? i._getMarkerLayer(e, n)
                                : e instanceof t.TileLayer
                                ? i._getTileLayer(e, n)
                                : e instanceof t.Circle
                                ? (i.circles[e._leaflet_id] || (i.circles[e._leaflet_id] = e), n())
                                : e instanceof t.Path
                                ? i._getPathLayer(e, n)
                                : n();
                        } catch (t) {
                            console.log(t), n();
                        }
                    })
                );
            }),
                Promise.all(n).then(() => {
                    e();
                });
        },
        _getTileLayer: function (e, i) {
            let n = this;
            (n.tiles = []), (n.tileSize = e._tileSize.x), (n.tileBounds = t.bounds(n.bounds.min.divideBy(n.tileSize)._floor(), n.bounds.max.divideBy(n.tileSize)._floor()));
            for (let e = n.tileBounds.min.y; e <= n.tileBounds.max.y; e++) for (let i = n.tileBounds.min.x; i <= n.tileBounds.max.x; i++) n.tiles.push(new t.Point(i, e));
            let o = [];
            n.tiles.forEach((i) => {
                let s = i.clone();
                e._adjustTilePoint && e._adjustTilePoint(i);
                let a = s.scaleBy(new t.Point(n.tileSize, n.tileSize)).subtract(n.bounds.min);
                i.y < 0 ||
                    o.push(
                        new Promise((t) => {
                            n._loadTile(i, a, e, t);
                        })
                    );
            }),
                Promise.all(o).then(() => {
                    i();
                });
        },
        _loadTile: function (t, e, i, n) {
            let o = this,
                s = t.x + ":" + t.y + ":" + o.zoom,
                a = new Image();
            (a.crossOrigin = "Anonymous"),
                (a.onload = function () {
                    o.tilesImgs[s] || (o.tilesImgs[s] = { img: a, x: e.x, y: e.y }), n();
                }),
                (a.src = i.getTileUrl(t));
        },
        _getMarkerLayer: function (e, i) {
            let n = this;
            if (n.markers[e._leaflet_id]) return void i();
            let o = n._map.project(e._latlng);
            if (
                ((o = o.subtract(new t.Point(n.bounds.min.x, n.bounds.min.y))),
                e.options.icon && e.options.icon.options && e.options.icon.options.iconAnchor && ((o.x -= e.options.icon.options.iconAnchor[0]), (o.y -= e.options.icon.options.iconAnchor[1])),
                n._pointPositionIsNotCorrect(o))
            )
                i();
            else {
                let t = new Image();
                (t.crossOrigin = "Anonymous"),
                    (t.onload = function () {
                        (n.markers[e._leaflet_id] = { img: t, x: o.x, y: o.y }), i();
                    }),
                    (t.src = e._icon.src);
            }
        },
        _pointPositionIsNotCorrect: function (t) {
            return t.x < 0 || t.y < 0 || t.x > this.canvas.width || t.y > this.canvas.height;
        },
        _getPathLayer: function (e, i) {
            let n = this,
                o = 0,
                s = [];
            !e._mRadius && e._latlngs
                ? ((e.options.fill ? e._latlngs[0] : e._latlngs).forEach((e) => {
                      let i = n._map.project(e);
                      (i = i.subtract(new t.Point(n.bounds.min.x, n.bounds.min.y))), s.push(i), i.x < n.canvas.width && i.y < n.canvas.height && (o = 1);
                  }),
                  o && (n.path[e._leaflet_id] = { parts: s, closed: e.options.fill, options: e.options }),
                  i())
                : i();
        },
        _changeScale: function (t) {
            if (!t || t <= 1) return 0;
            let e = ((this.bounds.max.x - this.bounds.min.x) / 2) * (t - 1),
                i = ((this.bounds.max.y - this.bounds.min.y) / 2) * (t - 1);
            (this.bounds.min.x -= e), (this.bounds.min.y -= i), (this.bounds.max.x += e), (this.bounds.max.y += i), (this.canvas.width *= t), (this.canvas.height *= t);
        },
        _drawPath: function (t) {
            let e = this;
            e.ctx.beginPath();
            let i = 0,
                n = t.options;
            t.parts.forEach((t) => {
                e.ctx[i++ ? "lineTo" : "moveTo"](t.x, t.y);
            }),
                t.closed && e.ctx.closePath(),
                this._feelPath(n);
        },
        _drawCircle: function (e, i) {
            if (e._empty()) return;
            let n = this._map.project(e._latlng);
            n = n.subtract(new t.Point(this.bounds.min.x, this.bounds.min.y));
            let o = Math.max(Math.round(e._radius), 1),
                s = (Math.max(Math.round(e._radiusY), 1) || o) / o;
            1 !== s && (this.ctx.save(), this.scale(1, s)), this.ctx.beginPath(), this.ctx.arc(n.x, n.y / s, o, 0, 2 * Math.PI, !1), 1 !== s && this.ctx.restore(), this._feelPath(e.options);
        },
        _feelPath: function (t) {
            t.fill && ((this.ctx.globalAlpha = t.fillOpacity), (this.ctx.fillStyle = t.fillColor || t.color), this.ctx.fill(t.fillRule || "evenodd")),
                t.stroke &&
                    0 !== t.weight &&
                    (this.ctx.setLineDash && this.ctx.setLineDash((t && t._dashArray) || []),
                    (this.ctx.globalAlpha = t.opacity),
                    (this.ctx.lineWidth = t.weight),
                    (this.ctx.strokeStyle = t.color),
                    (this.ctx.lineCap = t.lineCap),
                    (this.ctx.lineJoin = t.lineJoin),
                    this.ctx.stroke());
        },
        _print: function () {
            let t = this;
            (t.tilesImgs = {}), (t.markers = {}), (t.path = {}), (t.circles = {});
            let e = t._map.getSize();
            (t.zoom = t._map.getZoom()),
                (t.bounds = t._map.getPixelBounds()),
                (t.canvas = document.createElement("canvas")),
                (t.canvas.width = e.x),
                (t.canvas.height = e.y),
                (t.ctx = t.canvas.getContext("2d")),
                this._changeScale(document.getElementById("scale").value),
                new Promise(function (e, i) {
                    t._getLayers(e);
                })
                    .then(
                        () =>
                            new Promise((e, i) => {
                                for (const [e, i] of Object.entries(t.tilesImgs)) t.ctx.drawImage(i.img, i.x, i.y, t.tileSize, t.tileSize);
                                for (const [e, i] of Object.entries(t.path)) t._drawPath(i);
                                for (const [e, i] of Object.entries(t.markers)) t.ctx.drawImage(i.img, i.x, i.y);
                                for (const [e, i] of Object.entries(t.circles)) t._drawCircle(i);
                                e();
                            })
                    )
                    .then(() => {
                        t.canvas.toBlob(function (t) {
                            let e = document.createElement("a");
                            (e.download = "bigImage.png"), (e.href = URL.createObjectURL(t)), e.click();
                        }),
                            t._containerParams.classList.remove("print-disabled"),
                            (t._loader.style.display = "none");
                    });
        },
    })),
        (t.control.bigImage = function (e) {
            return new t.Control.BigImage(e);
        });
}, window);
