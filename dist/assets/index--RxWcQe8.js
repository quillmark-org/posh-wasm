let G;
let __tla = (async ()=>{
    (function() {
        const t = document.createElement("link").relList;
        if (t && t.supports && t.supports("modulepreload")) return;
        for (const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);
        new MutationObserver((r)=>{
            for (const i of r)if (i.type === "childList") for (const d of i.addedNodes)d.tagName === "LINK" && d.rel === "modulepreload" && o(d);
        }).observe(document, {
            childList: !0,
            subtree: !0
        });
        function e(r) {
            const i = {};
            return r.integrity && (i.integrity = r.integrity), r.referrerPolicy && (i.referrerPolicy = r.referrerPolicy), r.crossOrigin === "use-credentials" ? i.credentials = "include" : r.crossOrigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin", i;
        }
        function o(r) {
            if (r.ep) return;
            r.ep = !0;
            const i = e(r);
            fetch(r.href, i);
        }
    })();
    let K, H, P, X, Y;
    K = "modulepreload";
    H = function(n, t) {
        return new URL(n, t).href;
    };
    P = {};
    X = function(t, e, o) {
        let r = Promise.resolve();
        if (e && e.length > 0) {
            let x = function(p) {
                return Promise.all(p.map((h)=>Promise.resolve(h).then((S)=>({
                            status: "fulfilled",
                            value: S
                        }), (S)=>({
                            status: "rejected",
                            reason: S
                        }))));
            };
            const d = document.getElementsByTagName("link"), c = document.querySelector("meta[property=csp-nonce]"), l = c?.nonce || c?.getAttribute("nonce");
            r = x(e.map((p)=>{
                if (p = H(p, o), p in P) return;
                P[p] = !0;
                const h = p.endsWith(".css"), S = h ? '[rel="stylesheet"]' : "";
                if (o) for(let F = d.length - 1; F >= 0; F--){
                    const M = d[F];
                    if (M.href === p && (!h || M.rel === "stylesheet")) return;
                }
                else if (document.querySelector(`link[href="${p}"]${S}`)) return;
                const k = document.createElement("link");
                if (k.rel = h ? "stylesheet" : K, h || (k.as = "script"), k.crossOrigin = "", k.href = p, l && k.setAttribute("nonce", l), document.head.appendChild(k), h) return new Promise((F, M)=>{
                    k.addEventListener("load", F), k.addEventListener("error", ()=>M(new Error(`Unable to preload CSS for ${p}`)));
                });
            }));
        }
        function i(d) {
            const c = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (c.payload = d, window.dispatchEvent(c), !c.defaultPrevented) throw d;
        }
        return r.then((d)=>{
            for (const c of d || [])c.status === "rejected" && i(c.reason);
            return t().catch(i);
        });
    };
    Y = "" + new URL("wasm_bg-B2x0-czq.wasm", import.meta.url).href;
    G = async (n = {}, t)=>{
        let e;
        if (t.startsWith("data:")) {
            const o = t.replace(/^data:.*?base64,/, "");
            let r;
            if (typeof Buffer == "function" && typeof Buffer.from == "function") r = Buffer.from(o, "base64");
            else if (typeof atob == "function") {
                const i = atob(o);
                r = new Uint8Array(i.length);
                for(let d = 0; d < i.length; d++)r[d] = i.charCodeAt(d);
            } else throw new Error("Cannot decode base64-encoded data URL");
            e = await WebAssembly.instantiate(r, n);
        } else {
            const o = await fetch(t), r = o.headers.get("Content-Type") || "";
            if ("instantiateStreaming" in WebAssembly && r.startsWith("application/wasm")) e = await WebAssembly.instantiateStreaming(o, n);
            else {
                const i = await o.arrayBuffer();
                e = await WebAssembly.instantiate(i, n);
            }
        }
        return e.instance.exports;
    };
    class y {
        static __wrap(t) {
            t = t >>> 0;
            const e = Object.create(y.prototype);
            return e.__wbg_ptr = t, V.register(e, e.__wbg_ptr, e), e;
        }
        __destroy_into_raw() {
            const t = this.__wbg_ptr;
            return this.__wbg_ptr = 0, V.unregister(this), t;
        }
        free() {
            const t = this.__destroy_into_raw();
            _.__wbg_document_free(t, 0);
        }
        static blueprintInstruction(t) {
            let e, o;
            try {
                const d = _.__wbindgen_add_to_stack_pointer(-16), c = f(t, _.__wbindgen_export, _.__wbindgen_export2), l = b;
                _.document_blueprintInstruction(d, c, l);
                var r = a().getInt32(d + 0, !0), i = a().getInt32(d + 4, !0);
                return e = r, o = i, w(r, i);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(e, o, 1);
            }
        }
        get cardCount() {
            return _.document_cardCount(this.__wbg_ptr) >>> 0;
        }
        get cards() {
            try {
                const r = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_cards(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), e = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw u(e);
                return u(t);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        clone() {
            const t = _.document_clone(this.__wbg_ptr);
            return y.__wrap(t);
        }
        static currentSchemaVersion() {
            let t, e;
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_currentSchemaVersion(i);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, e = r, w(o, r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(t, e, 1);
            }
        }
        equals(t) {
            return Q(t, y), _.document_equals(this.__wbg_ptr, t.__wbg_ptr) !== 0;
        }
        static formatDiagnostic(t) {
            let e, o;
            try {
                const d = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_formatDiagnostic(d, g(t));
                var r = a().getInt32(d + 0, !0), i = a().getInt32(d + 4, !0);
                return e = r, o = i, w(r, i);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(e, o, 1);
            }
        }
        static formatRules() {
            let t, e;
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_formatRules(i);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, e = r, w(o, r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(t, e, 1);
            }
        }
        static fromJson(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), c = b;
                _.document_fromJson(i, d, c);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return y.__wrap(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        static fromMarkdown(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), c = b;
                _.document_fromMarkdown(i, d, c);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return y.__wrap(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        insertCard(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_insertCard(i, this.__wbg_ptr, t, g(e));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        get main() {
            try {
                const r = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_main(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), e = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw u(e);
                return u(t);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        static makeCard(t, e, o) {
            try {
                const x = _.__wbindgen_add_to_stack_pointer(-16), p = f(t, _.__wbindgen_export, _.__wbindgen_export2), h = b;
                var r = I(o) ? 0 : f(o, _.__wbindgen_export, _.__wbindgen_export2), i = b;
                _.document_makeCard(x, p, h, I(e) ? 0 : g(e), r, i);
                var d = a().getInt32(x + 0, !0), c = a().getInt32(x + 4, !0), l = a().getInt32(x + 8, !0);
                if (l) throw u(c);
                return u(d);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        moveCard(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_moveCard(i, this.__wbg_ptr, t, e);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        pushCard(t) {
            try {
                const r = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_pushCard(r, this.__wbg_ptr, g(t));
                var e = a().getInt32(r + 0, !0), o = a().getInt32(r + 4, !0);
                if (o) throw u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        get quillRef() {
            let t, e;
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_quillRef(i, this.__wbg_ptr);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, e = r, w(o, r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(t, e, 1);
            }
        }
        static quillRefHint() {
            let t, e;
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_quillRefHint(i);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, e = r, w(o, r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(t, e, 1);
            }
        }
        removeCard(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_removeCard(i, this.__wbg_ptr, t);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeCardExt(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_removeCardExt(i, this.__wbg_ptr, t);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeCardExtNamespace(t, e) {
            try {
                const d = _.__wbindgen_add_to_stack_pointer(-16), c = f(e, _.__wbindgen_export, _.__wbindgen_export2), l = b;
                _.document_removeCardExtNamespace(d, this.__wbg_ptr, t, c, l);
                var o = a().getInt32(d + 0, !0), r = a().getInt32(d + 4, !0), i = a().getInt32(d + 8, !0);
                if (i) throw u(r);
                return u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeCardField(t, e) {
            try {
                const d = _.__wbindgen_add_to_stack_pointer(-16), c = f(e, _.__wbindgen_export, _.__wbindgen_export2), l = b;
                _.document_removeCardField(d, this.__wbg_ptr, t, c, l);
                var o = a().getInt32(d + 0, !0), r = a().getInt32(d + 4, !0), i = a().getInt32(d + 8, !0);
                if (i) throw u(r);
                return u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeExt() {
            try {
                const r = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_removeExt(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), e = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw u(e);
                return u(t);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeExtNamespace(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), c = b;
                _.document_removeExtNamespace(i, this.__wbg_ptr, d, c);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeField(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), c = b;
                _.document_removeField(i, this.__wbg_ptr, d, c);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        replaceBody(t) {
            const e = f(t, _.__wbindgen_export, _.__wbindgen_export2), o = b;
            _.document_replaceBody(this.__wbg_ptr, e, o);
        }
        static schemaVersionOf(t) {
            try {
                const r = _.__wbindgen_add_to_stack_pointer(-16), i = f(t, _.__wbindgen_export, _.__wbindgen_export2), d = b;
                _.document_schemaVersionOf(r, i, d);
                var e = a().getInt32(r + 0, !0), o = a().getInt32(r + 4, !0);
                let c;
                return e !== 0 && (c = w(e, o).slice(), _.__wbindgen_export4(e, o * 1, 1)), c;
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setCardExt(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_setCardExt(i, this.__wbg_ptr, t, g(e));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setCardExtNamespace(t, e, o) {
            try {
                const d = _.__wbindgen_add_to_stack_pointer(-16), c = f(e, _.__wbindgen_export, _.__wbindgen_export2), l = b;
                _.document_setCardExtNamespace(d, this.__wbg_ptr, t, c, l, g(o));
                var r = a().getInt32(d + 0, !0), i = a().getInt32(d + 4, !0);
                if (i) throw u(r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setCardKind(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(e, _.__wbindgen_export, _.__wbindgen_export2), c = b;
                _.document_setCardKind(i, this.__wbg_ptr, t, d, c);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setExt(t) {
            try {
                const r = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_setExt(r, this.__wbg_ptr, g(t));
                var e = a().getInt32(r + 0, !0), o = a().getInt32(r + 4, !0);
                if (o) throw u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setExtNamespace(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), c = b;
                _.document_setExtNamespace(i, this.__wbg_ptr, d, c, g(e));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setField(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), c = b;
                _.document_setField(i, this.__wbg_ptr, d, c, g(e));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setFill(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), c = b;
                _.document_setFill(i, this.__wbg_ptr, d, c, g(e));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setQuillRef(t) {
            try {
                const r = _.__wbindgen_add_to_stack_pointer(-16), i = f(t, _.__wbindgen_export, _.__wbindgen_export2), d = b;
                _.document_setQuillRef(r, this.__wbg_ptr, i, d);
                var e = a().getInt32(r + 0, !0), o = a().getInt32(r + 4, !0);
                if (o) throw u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        toJson() {
            let t, e;
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_toJson(i, this.__wbg_ptr);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, e = r, w(o, r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(t, e, 1);
            }
        }
        toMarkdown() {
            let t, e;
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_toMarkdown(i, this.__wbg_ptr);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, e = r, w(o, r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(t, e, 1);
            }
        }
        static tryFromJson(t) {
            const e = f(t, _.__wbindgen_export, _.__wbindgen_export2), o = b, r = _.document_tryFromJson(e, o);
            return r === 0 ? void 0 : y.__wrap(r);
        }
        updateCardBody(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(e, _.__wbindgen_export, _.__wbindgen_export2), c = b;
                _.document_updateCardBody(i, this.__wbg_ptr, t, d, c);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        updateCardField(t, e, o) {
            try {
                const d = _.__wbindgen_add_to_stack_pointer(-16), c = f(e, _.__wbindgen_export, _.__wbindgen_export2), l = b;
                _.document_updateCardField(d, this.__wbg_ptr, t, c, l, g(o));
                var r = a().getInt32(d + 0, !0), i = a().getInt32(d + 4, !0);
                if (i) throw u(r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        get warnings() {
            try {
                const r = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_warnings(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), e = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw u(e);
                return u(t);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
    }
    Symbol.dispose && (y.prototype[Symbol.dispose] = y.prototype.free);
    class E {
        static __wrap(t) {
            t = t >>> 0;
            const e = Object.create(E.prototype);
            return e.__wbg_ptr = t, J.register(e, e.__wbg_ptr, e), e;
        }
        __destroy_into_raw() {
            const t = this.__wbg_ptr;
            return this.__wbg_ptr = 0, J.unregister(this), t;
        }
        free() {
            const t = this.__destroy_into_raw();
            _.__wbg_quill_free(t, 0);
        }
        get backendId() {
            let t, e;
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.quill_backendId(i, this.__wbg_ptr);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, e = r, w(o, r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(t, e, 1);
            }
        }
        get blueprint() {
            let t, e;
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.quill_blueprint(i, this.__wbg_ptr);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, e = r, w(o, r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(t, e, 1);
            }
        }
        static fromTree(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.quill_fromTree(i, g(t));
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return E.__wrap(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        get metadata() {
            try {
                const r = _.__wbindgen_add_to_stack_pointer(-16);
                _.quill_metadata(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), e = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw u(e);
                return u(t);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        get schema() {
            try {
                const r = _.__wbindgen_add_to_stack_pointer(-16);
                _.quill_schema(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), e = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw u(e);
                return u(t);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        seedCard(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), c = b;
                _.quill_seedCard(i, this.__wbg_ptr, d, c);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        seedDocument() {
            const t = _.quill_seedDocument(this.__wbg_ptr);
            return y.__wrap(t);
        }
        seedMain() {
            try {
                const r = _.__wbindgen_add_to_stack_pointer(-16);
                _.quill_seedMain(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), e = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw u(e);
                return u(t);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        toTree() {
            const t = _.quill_toTree(this.__wbg_ptr);
            return u(t);
        }
        validate(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                Q(t, y), _.quill_validate(i, this.__wbg_ptr, t.__wbg_ptr);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
    }
    Symbol.dispose && (E.prototype[Symbol.dispose] = E.prototype.free);
    function Z(n, t) {
        const e = Error(w(n, t));
        return g(e);
    }
    function tt(n, t) {
        const e = String(s(t)), o = f(e, _.__wbindgen_export, _.__wbindgen_export2), r = b;
        a().setInt32(n + 4, r, !0), a().setInt32(n + 0, o, !0);
    }
    function et(n, t) {
        const e = String(s(t)), o = f(e, _.__wbindgen_export, _.__wbindgen_export2), r = b;
        a().setInt32(n + 4, r, !0), a().setInt32(n + 0, o, !0);
    }
    function nt(n, t) {
        const e = s(t), o = typeof e == "bigint" ? e : void 0;
        a().setBigInt64(n + 8, I(o) ? BigInt(0) : o, !0), a().setInt32(n + 0, !I(o), !0);
    }
    function rt(n) {
        const t = s(n), e = typeof t == "boolean" ? t : void 0;
        return I(e) ? 16777215 : e ? 1 : 0;
    }
    function _t(n, t) {
        const e = U(s(t)), o = f(e, _.__wbindgen_export, _.__wbindgen_export2), r = b;
        a().setInt32(n + 4, r, !0), a().setInt32(n + 0, o, !0);
    }
    function ot(n, t) {
        return s(n) in s(t);
    }
    function it(n) {
        return typeof s(n) == "bigint";
    }
    function at(n) {
        return typeof s(n) == "function";
    }
    function dt(n) {
        return s(n) === null;
    }
    function st(n) {
        const t = s(n);
        return typeof t == "object" && t !== null;
    }
    function ct(n) {
        return typeof s(n) == "string";
    }
    function ut(n) {
        return s(n) === void 0;
    }
    function gt(n, t) {
        return s(n) === s(t);
    }
    function bt(n, t) {
        return s(n) == s(t);
    }
    function ft(n, t) {
        const e = s(t), o = typeof e == "number" ? e : void 0;
        a().setFloat64(n + 8, I(o) ? 0 : o, !0), a().setInt32(n + 0, !I(o), !0);
    }
    function lt(n, t) {
        const e = s(t), o = typeof e == "string" ? e : void 0;
        var r = I(o) ? 0 : f(o, _.__wbindgen_export, _.__wbindgen_export2), i = b;
        a().setInt32(n + 4, i, !0), a().setInt32(n + 0, r, !0);
    }
    function wt(n, t) {
        throw new Error(w(n, t));
    }
    function pt() {
        return O(function(n, t) {
            const e = s(n).call(s(t));
            return g(e);
        }, arguments);
    }
    function mt(n) {
        return s(n).done;
    }
    function yt(n) {
        const t = s(n).entries();
        return g(t);
    }
    function ht(n) {
        const t = Object.entries(s(n));
        return g(t);
    }
    function vt(n, t) {
        let e, o;
        try {
            e = n, o = t, console.error(w(n, t));
        } finally{
            _.__wbindgen_export4(e, o, 1);
        }
    }
    function kt(n) {
        const t = Array.from(s(n));
        return g(t);
    }
    function It() {
        return O(function(n, t) {
            globalThis.crypto.getRandomValues(L(n, t));
        }, arguments);
    }
    function xt() {
        return O(function(n, t) {
            const e = Reflect.get(s(n), s(t));
            return g(e);
        }, arguments);
    }
    function Ct(n, t) {
        const e = s(n)[t >>> 0];
        return g(e);
    }
    function Et(n, t) {
        const e = s(n)[t >>> 0];
        return g(e);
    }
    function St(n, t) {
        const e = s(n)[s(t)];
        return g(e);
    }
    function Ft(n, t) {
        const e = s(n)[s(t)];
        return g(e);
    }
    function At(n) {
        let t;
        try {
            t = s(n) instanceof ArrayBuffer;
        } catch  {
            t = !1;
        }
        return t;
    }
    function jt(n) {
        let t;
        try {
            t = s(n) instanceof Map;
        } catch  {
            t = !1;
        }
        return t;
    }
    function qt(n) {
        let t;
        try {
            t = s(n) instanceof Object;
        } catch  {
            t = !1;
        }
        return t;
    }
    function Ot(n) {
        let t;
        try {
            t = s(n) instanceof Uint8Array;
        } catch  {
            t = !1;
        }
        return t;
    }
    function Mt(n) {
        return Array.isArray(s(n));
    }
    function Rt(n) {
        return Number.isSafeInteger(s(n));
    }
    function Nt() {
        return g(Symbol.iterator);
    }
    function Tt(n) {
        const t = Object.keys(s(n));
        return g(t);
    }
    function Bt(n) {
        return s(n).length;
    }
    function Ut(n) {
        return s(n).length;
    }
    function Lt(n) {
        const t = new Uint8Array(s(n));
        return g(t);
    }
    function $t() {
        const n = new Error;
        return g(n);
    }
    function Dt() {
        return g(new Map);
    }
    function Pt(n, t) {
        const e = new Error(w(n, t));
        return g(e);
    }
    function Vt() {
        const n = new Array;
        return g(n);
    }
    function Jt() {
        const n = new Object;
        return g(n);
    }
    function Qt(n, t) {
        const e = new Uint8Array(L(n, t));
        return g(e);
    }
    function Wt() {
        return O(function(n) {
            const t = s(n).next();
            return g(t);
        }, arguments);
    }
    function zt(n) {
        const t = s(n).next;
        return g(t);
    }
    function Kt(n, t, e) {
        Uint8Array.prototype.set.call(L(n, t), s(e));
    }
    function Ht() {
        return O(function(n, t, e) {
            return Reflect.set(s(n), s(t), s(e));
        }, arguments);
    }
    function Xt(n, t, e) {
        s(n)[t >>> 0] = u(e);
    }
    function Yt(n, t, e) {
        s(n)[u(t)] = u(e);
    }
    function Gt(n, t, e) {
        const o = s(n).set(s(t), s(e));
        return g(o);
    }
    function Zt(n, t) {
        const e = s(t).stack, o = f(e, _.__wbindgen_export, _.__wbindgen_export2), r = b;
        a().setInt32(n + 4, r, !0), a().setInt32(n + 0, o, !0);
    }
    function te(n) {
        const t = s(n).value;
        return g(t);
    }
    function ee(n) {
        return g(n);
    }
    function ne(n) {
        return g(n);
    }
    function re(n, t) {
        const e = w(n, t);
        return g(e);
    }
    function _e(n) {
        const t = BigInt.asUintN(64, n);
        return g(t);
    }
    function oe(n) {
        const t = s(n);
        return g(t);
    }
    function ie(n) {
        u(n);
    }
    const V = typeof FinalizationRegistry > "u" ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((n)=>_.__wbg_document_free(n >>> 0, 1)), J = typeof FinalizationRegistry > "u" ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((n)=>_.__wbg_quill_free(n >>> 0, 1));
    function g(n) {
        j === v.length && v.push(v.length + 1);
        const t = j;
        return j = v[t], v[t] = n, t;
    }
    function Q(n, t) {
        if (!(n instanceof t)) throw new Error(`expected instance of ${t.name}`);
    }
    function U(n) {
        const t = typeof n;
        if (t == "number" || t == "boolean" || n == null) return `${n}`;
        if (t == "string") return `"${n}"`;
        if (t == "symbol") {
            const r = n.description;
            return r == null ? "Symbol" : `Symbol(${r})`;
        }
        if (t == "function") {
            const r = n.name;
            return typeof r == "string" && r.length > 0 ? `Function(${r})` : "Function";
        }
        if (Array.isArray(n)) {
            const r = n.length;
            let i = "[";
            r > 0 && (i += U(n[0]));
            for(let d = 1; d < r; d++)i += ", " + U(n[d]);
            return i += "]", i;
        }
        const e = /\[object ([^\]]+)\]/.exec(toString.call(n));
        let o;
        if (e && e.length > 1) o = e[1];
        else return toString.call(n);
        if (o == "Object") try {
            return "Object(" + JSON.stringify(n) + ")";
        } catch  {
            return "Object";
        }
        return n instanceof Error ? `${n.name}: ${n.message}
${n.stack}` : o;
    }
    function ae(n) {
        n < 1028 || (v[n] = j, j = n);
    }
    function L(n, t) {
        return n = n >>> 0, A().subarray(n / 1, n / 1 + t);
    }
    let C = null;
    function a() {
        return (C === null || C.buffer.detached === !0 || C.buffer.detached === void 0 && C.buffer !== _.memory.buffer) && (C = new DataView(_.memory.buffer)), C;
    }
    function w(n, t) {
        return n = n >>> 0, se(n, t);
    }
    let R = null;
    function A() {
        return (R === null || R.byteLength === 0) && (R = new Uint8Array(_.memory.buffer)), R;
    }
    function s(n) {
        return v[n];
    }
    function O(n, t) {
        try {
            return n.apply(this, t);
        } catch (e) {
            _.__wbindgen_export3(g(e));
        }
    }
    let v = new Array(1024).fill(void 0);
    v.push(void 0, null, !0, !1);
    let j = v.length;
    function I(n) {
        return n == null;
    }
    function f(n, t, e) {
        if (e === void 0) {
            const c = q.encode(n), l = t(c.length, 1) >>> 0;
            return A().subarray(l, l + c.length).set(c), b = c.length, l;
        }
        let o = n.length, r = t(o, 1) >>> 0;
        const i = A();
        let d = 0;
        for(; d < o; d++){
            const c = n.charCodeAt(d);
            if (c > 127) break;
            i[r + d] = c;
        }
        if (d !== o) {
            d !== 0 && (n = n.slice(d)), r = e(r, o, o = d + n.length * 3, 1) >>> 0;
            const c = A().subarray(r + d, r + o), l = q.encodeInto(n, c);
            d += l.written, r = e(r, o, d, 1) >>> 0;
        }
        return b = d, r;
    }
    function u(n) {
        const t = s(n);
        return ae(n), t;
    }
    let N = new TextDecoder("utf-8", {
        ignoreBOM: !0,
        fatal: !0
    });
    N.decode();
    const de = 2146435072;
    let B = 0;
    function se(n, t) {
        return B += t, B >= de && (N = new TextDecoder("utf-8", {
            ignoreBOM: !0,
            fatal: !0
        }), N.decode(), B = t), N.decode(A().subarray(n, n + t));
    }
    const q = new TextEncoder;
    "encodeInto" in q || (q.encodeInto = function(n, t) {
        const e = q.encode(n);
        return t.set(e), {
            read: n.length,
            written: e.length
        };
    });
    let b = 0, _;
    function ce(n) {
        _ = n;
    }
    URL = globalThis.URL;
    const ue = await G({
        "./wasm_bg.js": {
            __wbindgen_object_clone_ref: oe,
            __wbindgen_object_drop_ref: ie,
            __wbg_get_unchecked_17f53dad852b9588: Et,
            __wbg_set_3bf1de9fab0cd644: Xt,
            __wbg_length_3d4ecd04bd8d22f1: Bt,
            __wbg_set_fde2cec06c23692b: Gt,
            __wbg_entries_2bf997cf82353e47: yt,
            __wbg_next_0340c4ae324393c3: Wt,
            __wbg_instanceof_Object_7c99480a1cdfb911: qt,
            __wbg_instanceof_Map_1b76fd4635be43eb: jt,
            __wbg_done_9158f7cc8751ba32: mt,
            __wbg_value_ee3a06f4579184fa: te,
            __wbg_keys_2fd1bfdda7e278ca: Tt,
            __wbg_new_227d7c05414eb861: $t,
            __wbg_stack_3b0d974bbf31e44f: Zt,
            __wbg_error_a6fa202b58aa1cd3: vt,
            __wbg_get_with_ref_key_6412cf3094599694: St,
            __wbg_set_6be42768c690e380: Yt,
            __wbg_get_8360291721e2339f: Ct,
            __wbg_String_8564e559799eccda: tt,
            __wbg_get_with_ref_key_f64427178466f623: Ft,
            __wbg_String_b51de6b05a10845b: et,
            __wbg_getRandomValues_3f44b700395062e5: It,
            __wbg_new_from_slice_b5ea43e23f6008c0: Qt,
            __wbg_new_0c7403db6e782f19: Lt,
            __wbg_length_9f1775224cf1d815: Ut,
            __wbg_prototypesetcall_a6b02eb00b0f4ce2: Kt,
            __wbg_call_14b169f759b26747: pt,
            __wbg_instanceof_Uint8Array_152ba1f289edcf3f: Ot,
            __wbg_instanceof_ArrayBuffer_7c8433c6ed14ffe3: At,
            __wbg_new_34d45cc8e36aaead: Dt,
            __wbg_new_682678e2f47e32bc: Vt,
            __wbg_from_0dbf29f09e7fb200: kt,
            __wbg_isArray_c3109d14ffc06469: Mt,
            __wbg_new_5e360d2ff7b9e1c3: Pt,
            __wbg_isSafeInteger_4fc213d1989d6d2a: Rt,
            __wbg_new_aa8d0fa9762c29bd: Jt,
            __wbg_entries_e0b73aa8571ddb56: ht,
            __wbg_iterator_013bc09ec998c2a7: Nt,
            __wbg_get_1affdbdd5573b16a: xt,
            __wbg_set_022bee52d0b05b19: Ht,
            __wbg_next_7646edaa39458ef7: zt,
            __wbg___wbindgen_in_a5d8b22e52b24dd1: ot,
            __wbg___wbindgen_throw_6b64449b9b9ed33c: wt,
            __wbg___wbindgen_is_null_52ff4ec04186736f: dt,
            __wbg___wbindgen_jsval_eq_d3465d8a07697228: gt,
            __wbg_Error_960c155d3d49e4c2: Z,
            __wbg___wbindgen_is_bigint_ec25c7f91b4d9e93: it,
            __wbg___wbindgen_is_object_63322ec0cd6ea4ef: st,
            __wbg___wbindgen_is_string_6df3bf7ef1164ed3: ct,
            __wbg___wbindgen_number_get_c7f42aed0525c451: ft,
            __wbg___wbindgen_string_get_7ed5322991caaec5: lt,
            __wbg___wbindgen_boolean_get_6ea149f0a8dcc5ff: rt,
            __wbg___wbindgen_is_function_3baa9db1a987f47d: at,
            __wbg___wbindgen_is_undefined_29a43b4d42920abd: ut,
            __wbg___wbindgen_jsval_loose_eq_cac3565e89b4134c: bt,
            __wbg___wbindgen_bigint_get_as_i64_3d3aba5d616c6a51: nt,
            __wbg___wbindgen_debug_string_ab4b34d23d6778bd: _t,
            __wbindgen_cast_0000000000000001: ee,
            __wbindgen_cast_0000000000000002: ne,
            __wbindgen_cast_0000000000000003: re,
            __wbindgen_cast_0000000000000004: _e
        }
    }, Y), { memory: ge, __wbg_document_free: be, __wbg_quill_free: fe, document_blueprintInstruction: le, document_cardCount: we, document_cards: pe, document_clone: me, document_currentSchemaVersion: ye, document_equals: he, document_formatDiagnostic: ve, document_formatRules: ke, document_fromJson: Ie, document_fromMarkdown: xe, document_insertCard: Ce, document_main: Ee, document_makeCard: Se, document_moveCard: Fe, document_pushCard: Ae, document_quillRef: je, document_quillRefHint: qe, document_removeCard: Oe, document_removeCardExt: Me, document_removeCardExtNamespace: Re, document_removeCardField: Ne, document_removeExt: Te, document_removeExtNamespace: Be, document_removeField: Ue, document_replaceBody: Le, document_schemaVersionOf: $e, document_setCardExt: De, document_setCardExtNamespace: Pe, document_setCardKind: Ve, document_setExt: Je, document_setExtNamespace: Qe, document_setField: We, document_setFill: ze, document_setQuillRef: Ke, document_toJson: He, document_toMarkdown: Xe, document_tryFromJson: Ye, document_updateCardBody: Ge, document_updateCardField: Ze, document_warnings: tn, init: en, quill_backendId: nn, quill_blueprint: rn, quill_fromTree: _n, quill_metadata: on, quill_schema: an, quill_seedCard: dn, quill_seedDocument: sn, quill_seedMain: cn, quill_toTree: un, quill_validate: gn, __wbindgen_export: bn, __wbindgen_export2: fn, __wbindgen_export3: ln, __wbindgen_export4: wn, __wbindgen_add_to_stack_pointer: pn, __wbindgen_start: W } = ue, mn = Object.freeze(Object.defineProperty({
        __proto__: null,
        __wbg_document_free: be,
        __wbg_quill_free: fe,
        __wbindgen_add_to_stack_pointer: pn,
        __wbindgen_export: bn,
        __wbindgen_export2: fn,
        __wbindgen_export3: ln,
        __wbindgen_export4: wn,
        __wbindgen_start: W,
        document_blueprintInstruction: le,
        document_cardCount: we,
        document_cards: pe,
        document_clone: me,
        document_currentSchemaVersion: ye,
        document_equals: he,
        document_formatDiagnostic: ve,
        document_formatRules: ke,
        document_fromJson: Ie,
        document_fromMarkdown: xe,
        document_insertCard: Ce,
        document_main: Ee,
        document_makeCard: Se,
        document_moveCard: Fe,
        document_pushCard: Ae,
        document_quillRef: je,
        document_quillRefHint: qe,
        document_removeCard: Oe,
        document_removeCardExt: Me,
        document_removeCardExtNamespace: Re,
        document_removeCardField: Ne,
        document_removeExt: Te,
        document_removeExtNamespace: Be,
        document_removeField: Ue,
        document_replaceBody: Le,
        document_schemaVersionOf: $e,
        document_setCardExt: De,
        document_setCardExtNamespace: Pe,
        document_setCardKind: Ve,
        document_setExt: Je,
        document_setExtNamespace: Qe,
        document_setField: We,
        document_setFill: ze,
        document_setQuillRef: Ke,
        document_toJson: He,
        document_toMarkdown: Xe,
        document_tryFromJson: Ye,
        document_updateCardBody: Ge,
        document_updateCardField: Ze,
        document_warnings: tn,
        init: en,
        memory: ge,
        quill_backendId: nn,
        quill_blueprint: rn,
        quill_fromTree: _n,
        quill_metadata: on,
        quill_schema: an,
        quill_seedCard: dn,
        quill_seedDocument: sn,
        quill_seedMain: cn,
        quill_toTree: un,
        quill_validate: gn
    }, Symbol.toStringTag, {
        value: "Module"
    }));
    ce(mn);
    W();
    const yn = {
        typst: {
            load: ()=>X(()=>import("./wasm-B2ObiRFv.js").then(async (m)=>{
                        await m.__tla;
                        return m;
                    }), [], import.meta.url),
            formats: [
                "pdf",
                "svg",
                "png"
            ],
            canvas: !0
        }
    };
    function hn(n, t) {
        if (!t || typeof t != "object") throw new Error(`Engine: backend '${n}' must be a descriptor { load, formats, canvas }.`);
        const { load: e, formats: o, canvas: r } = t;
        if (typeof e != "function") throw new Error(`Engine: backend '${n}' descriptor needs a callable 'load'.`);
        if (!Array.isArray(o)) throw new Error(`Engine: backend '${n}' descriptor needs a 'formats' array.`);
        if (typeof r != "boolean") throw new Error(`Engine: backend '${n}' descriptor needs a boolean 'canvas'.`);
        return {
            load: e,
            formats: o,
            canvas: r
        };
    }
    class vn {
        #t = new Map;
        #r = new Map;
        #e;
        #_ = new Map;
        constructor(t){
            const e = {
                ...yn,
                ...t?.backends ?? {}
            }, o = {};
            for (const [r, i] of Object.entries(e))o[r] = hn(r, i);
            this.#e = o;
        }
        #n(t) {
            const e = this.#e[t];
            if (!e) throw new Error(`Engine: no backend registered for '${t}'. Known backends: ${Object.keys(this.#e).join(", ") || "(none)"}.`);
            return e;
        }
        async #i(t) {
            const e = this.#n(t);
            let o = this.#t.get(t);
            o || (o = Promise.resolve().then(e.load).catch((d)=>{
                throw this.#t.delete(t), d;
            }), this.#t.set(t, o));
            const r = await o;
            let i = this.#r.get(t);
            return i || (i = new r.Quillmark, this.#r.set(t, i)), {
                mod: r,
                engine: i
            };
        }
        #a(t, e, o) {
            let r = this.#_.get(e);
            r || (r = new WeakMap, this.#_.set(e, r));
            let i = r.get(o);
            return i || (i = t.Quill.fromTree(o.toTree()), r.set(o, i)), i;
        }
        async #o(t, e, o, r) {
            const { mod: i, engine: d } = await this.#i(t), c = this.#a(i, t, e);
            let l = null;
            try {
                return l = i.Document.fromJson(o.toJson()), r({
                    mod: i,
                    engine: d,
                    quill: c,
                    doc: l
                });
            } finally{
                l?.free();
            }
        }
        async render(t, e, o) {
            return this.#o(t.backendId, t, e, ({ engine: r, quill: i, doc: d })=>r.render(i, d, o ?? void 0));
        }
        async open(t, e) {
            return this.#o(t.backendId, t, e, ({ engine: o, quill: r, doc: i })=>new kn(o.open(r, i)));
        }
        async supportedFormats(t) {
            return this.#n(t.backendId).formats.slice();
        }
        async supportsCanvas(t) {
            return this.#n(t.backendId).canvas;
        }
    }
    class kn {
        constructor(t){
            this.#t = t;
        }
        #t;
        get pageCount() {
            return this.#t.pageCount;
        }
        get backendId() {
            return this.#t.backendId;
        }
        get supportsCanvas() {
            return this.#t.supportsCanvas;
        }
        get warnings() {
            return this.#t.warnings;
        }
        render(t) {
            return this.#t.render(t ?? void 0);
        }
        pageSize(t) {
            return this.#t.pageSize(t);
        }
        paint(t, e, o) {
            return this.#t.paint(t, e, o);
        }
        free() {
            this.#t.free();
        }
    }
    let m = null;
    const $ = new vn;
    function In(n) {
        const t = {};
        for (const [e, o] of Object.entries(n)){
            const r = atob(o), i = new Uint8Array(r.length);
            for(let d = 0; d < r.length; d++)i[d] = r.charCodeAt(d);
            t[e] = i;
        }
        return t;
    }
    function xn(n) {
        let t = "";
        for(let o = 0; o < n.length; o += 32768)t += String.fromCharCode.apply(null, n.subarray(o, o + 32768));
        return btoa(t);
    }
    function T(n) {
        return Array.isArray(n) ? n.map((t)=>({
                severity: t.severity ?? null,
                code: t.code ?? null,
                message: t.message ?? null,
                location: t.location ?? null,
                path: t.path ?? null,
                hint: t.hint ?? null
            })) : [];
    }
    function D() {
        if (!m) throw new Error("No quill loaded (send a loadQuill request first).");
    }
    function z(n) {
        return n != null && n !== "" ? y.fromMarkdown(n) : m.seedDocument();
    }
    async function Cn(n) {
        m = E.fromTree(In(n.tree));
        const t = await $.supportedFormats(m);
        return {
            id: n.id,
            ok: !0,
            kind: "quill",
            metadata: m.metadata,
            schema: m.schema,
            blueprint: m.blueprint,
            supportedFormats: t
        };
    }
    async function En(n) {
        D();
        const t = z(n.markdown), e = await $.render(m, t, {
            format: n.format || "pdf"
        });
        return {
            id: n.id,
            ok: !0,
            kind: "render",
            result: {
                outputFormat: e.outputFormat,
                renderTimeMs: e.renderTimeMs,
                warnings: T(e.warnings),
                artifacts: e.artifacts.map((o)=>({
                        format: o.format,
                        mimeType: o.mimeType,
                        length: o.bytes.length,
                        base64: xn(o.bytes)
                    }))
            }
        };
    }
    function Sn(n) {
        D();
        let t;
        try {
            t = z(n.markdown);
        } catch (e) {
            const o = e?.diagnostics?.length ? e.diagnostics : [
                {
                    severity: "error",
                    message: String(e?.message || e)
                }
            ];
            return {
                id: n.id,
                ok: !0,
                kind: "validate",
                diagnostics: T(o)
            };
        }
        return {
            id: n.id,
            ok: !0,
            kind: "validate",
            diagnostics: T(m.validate(t))
        };
    }
    async function Fn(n) {
        D();
        const t = await $.supportedFormats(m);
        return {
            id: n.id,
            ok: !0,
            kind: "info",
            metadata: m.metadata,
            schema: m.schema,
            blueprint: m.blueprint,
            supportedFormats: t
        };
    }
    if (window.chrome?.webview) {
        const n = (t)=>window.chrome.webview.postMessage(JSON.stringify(t));
        window.chrome.webview.addEventListener("message", async (t)=>{
            const e = t.data, o = e?.id;
            try {
                let r;
                switch(e?.type){
                    case "loadQuill":
                        r = await Cn(e);
                        break;
                    case "render":
                        r = await En(e);
                        break;
                    case "validate":
                        r = Sn(e);
                        break;
                    case "info":
                        r = await Fn(e);
                        break;
                    default:
                        r = {
                            id: o,
                            ok: !1,
                            error: "unknown request type: " + e?.type
                        };
                }
                n(r);
            } catch (r) {
                n({
                    id: o,
                    ok: !1,
                    error: String(r?.message || r),
                    diagnostics: T(r?.diagnostics)
                });
            }
        }), window.addEventListener("unhandledrejection", (t)=>n({
                type: "error",
                error: "unhandledrejection: " + String(t.reason?.message || t.reason)
            })), window.addEventListener("error", (t)=>n({
                type: "error",
                error: "error: " + String(t.message)
            })), n({
            type: "ready"
        });
    }
    window.__bridgeReady = !0;
})();
export { G as _, __tla };
