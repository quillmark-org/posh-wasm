let H;
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
    let W, z, U, Q, K;
    W = "modulepreload";
    z = function(n, t) {
        return new URL(n, t).href;
    };
    U = {};
    Q = function(t, e, o) {
        let r = Promise.resolve();
        if (e && e.length > 0) {
            let I = function(p) {
                return Promise.all(p.map((y)=>Promise.resolve(y).then((E)=>({
                            status: "fulfilled",
                            value: E
                        }), (E)=>({
                            status: "rejected",
                            reason: E
                        }))));
            };
            const d = document.getElementsByTagName("link"), s = document.querySelector("meta[property=csp-nonce]"), w = s?.nonce || s?.getAttribute("nonce");
            r = I(e.map((p)=>{
                if (p = z(p, o), p in U) return;
                U[p] = !0;
                const y = p.endsWith(".css"), E = y ? '[rel="stylesheet"]' : "";
                if (o) for(let S = d.length - 1; S >= 0; S--){
                    const O = d[S];
                    if (O.href === p && (!y || O.rel === "stylesheet")) return;
                }
                else if (document.querySelector(`link[href="${p}"]${E}`)) return;
                const v = document.createElement("link");
                if (v.rel = y ? "stylesheet" : W, y || (v.as = "script"), v.crossOrigin = "", v.href = p, w && v.setAttribute("nonce", w), document.head.appendChild(v), y) return new Promise((S, O)=>{
                    v.addEventListener("load", S), v.addEventListener("error", ()=>O(new Error(`Unable to preload CSS for ${p}`)));
                });
            }));
        }
        function i(d) {
            const s = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (s.payload = d, window.dispatchEvent(s), !s.defaultPrevented) throw d;
        }
        return r.then((d)=>{
            for (const s of d || [])s.status === "rejected" && i(s.reason);
            return t().catch(i);
        });
    };
    K = "" + new URL("wasm_bg-B2x0-czq.wasm", import.meta.url).href;
    H = async (n = {}, t)=>{
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
    class m {
        static __wrap(t) {
            t = t >>> 0;
            const e = Object.create(m.prototype);
            return e.__wbg_ptr = t, L.register(e, e.__wbg_ptr, e), e;
        }
        __destroy_into_raw() {
            const t = this.__wbg_ptr;
            return this.__wbg_ptr = 0, L.unregister(this), t;
        }
        free() {
            const t = this.__destroy_into_raw();
            _.__wbg_document_free(t, 0);
        }
        static blueprintInstruction(t) {
            let e, o;
            try {
                const d = _.__wbindgen_add_to_stack_pointer(-16), s = f(t, _.__wbindgen_export, _.__wbindgen_export2), w = b;
                _.document_blueprintInstruction(d, s, w);
                var r = a().getInt32(d + 0, !0), i = a().getInt32(d + 4, !0);
                return e = r, o = i, l(r, i);
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
            return m.__wrap(t);
        }
        static currentSchemaVersion() {
            let t, e;
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_currentSchemaVersion(i);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, e = r, l(o, r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(t, e, 1);
            }
        }
        equals(t) {
            return D(t, m), _.document_equals(this.__wbg_ptr, t.__wbg_ptr) !== 0;
        }
        static formatDiagnostic(t) {
            let e, o;
            try {
                const d = _.__wbindgen_add_to_stack_pointer(-16);
                _.document_formatDiagnostic(d, g(t));
                var r = a().getInt32(d + 0, !0), i = a().getInt32(d + 4, !0);
                return e = r, o = i, l(r, i);
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
                return t = o, e = r, l(o, r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(t, e, 1);
            }
        }
        static fromJson(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), s = b;
                _.document_fromJson(i, d, s);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return m.__wrap(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        static fromMarkdown(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), s = b;
                _.document_fromMarkdown(i, d, s);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return m.__wrap(e);
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
                const I = _.__wbindgen_add_to_stack_pointer(-16), p = f(t, _.__wbindgen_export, _.__wbindgen_export2), y = b;
                var r = k(o) ? 0 : f(o, _.__wbindgen_export, _.__wbindgen_export2), i = b;
                _.document_makeCard(I, p, y, k(e) ? 0 : g(e), r, i);
                var d = a().getInt32(I + 0, !0), s = a().getInt32(I + 4, !0), w = a().getInt32(I + 8, !0);
                if (w) throw u(s);
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
                return t = o, e = r, l(o, r);
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
                return t = o, e = r, l(o, r);
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
                const d = _.__wbindgen_add_to_stack_pointer(-16), s = f(e, _.__wbindgen_export, _.__wbindgen_export2), w = b;
                _.document_removeCardExtNamespace(d, this.__wbg_ptr, t, s, w);
                var o = a().getInt32(d + 0, !0), r = a().getInt32(d + 4, !0), i = a().getInt32(d + 8, !0);
                if (i) throw u(r);
                return u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeCardField(t, e) {
            try {
                const d = _.__wbindgen_add_to_stack_pointer(-16), s = f(e, _.__wbindgen_export, _.__wbindgen_export2), w = b;
                _.document_removeCardField(d, this.__wbg_ptr, t, s, w);
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
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), s = b;
                _.document_removeExtNamespace(i, this.__wbg_ptr, d, s);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeField(t) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), s = b;
                _.document_removeField(i, this.__wbg_ptr, d, s);
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
                let s;
                return e !== 0 && (s = l(e, o).slice(), _.__wbindgen_export4(e, o * 1, 1)), s;
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
                const d = _.__wbindgen_add_to_stack_pointer(-16), s = f(e, _.__wbindgen_export, _.__wbindgen_export2), w = b;
                _.document_setCardExtNamespace(d, this.__wbg_ptr, t, s, w, g(o));
                var r = a().getInt32(d + 0, !0), i = a().getInt32(d + 4, !0);
                if (i) throw u(r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setCardKind(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(e, _.__wbindgen_export, _.__wbindgen_export2), s = b;
                _.document_setCardKind(i, this.__wbg_ptr, t, d, s);
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
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), s = b;
                _.document_setExtNamespace(i, this.__wbg_ptr, d, s, g(e));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setField(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), s = b;
                _.document_setField(i, this.__wbg_ptr, d, s, g(e));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setFill(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), s = b;
                _.document_setFill(i, this.__wbg_ptr, d, s, g(e));
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
                return t = o, e = r, l(o, r);
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
                return t = o, e = r, l(o, r);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export4(t, e, 1);
            }
        }
        static tryFromJson(t) {
            const e = f(t, _.__wbindgen_export, _.__wbindgen_export2), o = b, r = _.document_tryFromJson(e, o);
            return r === 0 ? void 0 : m.__wrap(r);
        }
        updateCardBody(t, e) {
            try {
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(e, _.__wbindgen_export, _.__wbindgen_export2), s = b;
                _.document_updateCardBody(i, this.__wbg_ptr, t, d, s);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw u(o);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        updateCardField(t, e, o) {
            try {
                const d = _.__wbindgen_add_to_stack_pointer(-16), s = f(e, _.__wbindgen_export, _.__wbindgen_export2), w = b;
                _.document_updateCardField(d, this.__wbg_ptr, t, s, w, g(o));
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
    Symbol.dispose && (m.prototype[Symbol.dispose] = m.prototype.free);
    class C {
        static __wrap(t) {
            t = t >>> 0;
            const e = Object.create(C.prototype);
            return e.__wbg_ptr = t, $.register(e, e.__wbg_ptr, e), e;
        }
        __destroy_into_raw() {
            const t = this.__wbg_ptr;
            return this.__wbg_ptr = 0, $.unregister(this), t;
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
                return t = o, e = r, l(o, r);
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
                return t = o, e = r, l(o, r);
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
                return C.__wrap(e);
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
                const i = _.__wbindgen_add_to_stack_pointer(-16), d = f(t, _.__wbindgen_export, _.__wbindgen_export2), s = b;
                _.quill_seedCard(i, this.__wbg_ptr, d, s);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
        seedDocument() {
            const t = _.quill_seedDocument(this.__wbg_ptr);
            return m.__wrap(t);
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
                D(t, m), _.quill_validate(i, this.__wbg_ptr, t.__wbg_ptr);
                var e = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw u(o);
                return u(e);
            } finally{
                _.__wbindgen_add_to_stack_pointer(16);
            }
        }
    }
    Symbol.dispose && (C.prototype[Symbol.dispose] = C.prototype.free);
    function X(n, t) {
        const e = Error(l(n, t));
        return g(e);
    }
    function Y(n, t) {
        const e = String(c(t)), o = f(e, _.__wbindgen_export, _.__wbindgen_export2), r = b;
        a().setInt32(n + 4, r, !0), a().setInt32(n + 0, o, !0);
    }
    function G(n, t) {
        const e = String(c(t)), o = f(e, _.__wbindgen_export, _.__wbindgen_export2), r = b;
        a().setInt32(n + 4, r, !0), a().setInt32(n + 0, o, !0);
    }
    function Z(n, t) {
        const e = c(t), o = typeof e == "bigint" ? e : void 0;
        a().setBigInt64(n + 8, k(o) ? BigInt(0) : o, !0), a().setInt32(n + 0, !k(o), !0);
    }
    function tt(n) {
        const t = c(n), e = typeof t == "boolean" ? t : void 0;
        return k(e) ? 16777215 : e ? 1 : 0;
    }
    function et(n, t) {
        const e = T(c(t)), o = f(e, _.__wbindgen_export, _.__wbindgen_export2), r = b;
        a().setInt32(n + 4, r, !0), a().setInt32(n + 0, o, !0);
    }
    function nt(n, t) {
        return c(n) in c(t);
    }
    function rt(n) {
        return typeof c(n) == "bigint";
    }
    function _t(n) {
        return typeof c(n) == "function";
    }
    function ot(n) {
        return c(n) === null;
    }
    function it(n) {
        const t = c(n);
        return typeof t == "object" && t !== null;
    }
    function at(n) {
        return typeof c(n) == "string";
    }
    function dt(n) {
        return c(n) === void 0;
    }
    function st(n, t) {
        return c(n) === c(t);
    }
    function ct(n, t) {
        return c(n) == c(t);
    }
    function ut(n, t) {
        const e = c(t), o = typeof e == "number" ? e : void 0;
        a().setFloat64(n + 8, k(o) ? 0 : o, !0), a().setInt32(n + 0, !k(o), !0);
    }
    function gt(n, t) {
        const e = c(t), o = typeof e == "string" ? e : void 0;
        var r = k(o) ? 0 : f(o, _.__wbindgen_export, _.__wbindgen_export2), i = b;
        a().setInt32(n + 4, i, !0), a().setInt32(n + 0, r, !0);
    }
    function bt(n, t) {
        throw new Error(l(n, t));
    }
    function ft() {
        return q(function(n, t) {
            const e = c(n).call(c(t));
            return g(e);
        }, arguments);
    }
    function wt(n) {
        return c(n).done;
    }
    function lt(n) {
        const t = c(n).entries();
        return g(t);
    }
    function pt(n) {
        const t = Object.entries(c(n));
        return g(t);
    }
    function mt(n, t) {
        let e, o;
        try {
            e = n, o = t, console.error(l(n, t));
        } finally{
            _.__wbindgen_export4(e, o, 1);
        }
    }
    function yt(n) {
        const t = Array.from(c(n));
        return g(t);
    }
    function ht() {
        return q(function(n, t) {
            globalThis.crypto.getRandomValues(B(n, t));
        }, arguments);
    }
    function vt() {
        return q(function(n, t) {
            const e = Reflect.get(c(n), c(t));
            return g(e);
        }, arguments);
    }
    function kt(n, t) {
        const e = c(n)[t >>> 0];
        return g(e);
    }
    function It(n, t) {
        const e = c(n)[t >>> 0];
        return g(e);
    }
    function xt(n, t) {
        const e = c(n)[c(t)];
        return g(e);
    }
    function Ct(n, t) {
        const e = c(n)[c(t)];
        return g(e);
    }
    function Et(n) {
        let t;
        try {
            t = c(n) instanceof ArrayBuffer;
        } catch  {
            t = !1;
        }
        return t;
    }
    function St(n) {
        let t;
        try {
            t = c(n) instanceof Map;
        } catch  {
            t = !1;
        }
        return t;
    }
    function At(n) {
        let t;
        try {
            t = c(n) instanceof Object;
        } catch  {
            t = !1;
        }
        return t;
    }
    function Ft(n) {
        let t;
        try {
            t = c(n) instanceof Uint8Array;
        } catch  {
            t = !1;
        }
        return t;
    }
    function jt(n) {
        return Array.isArray(c(n));
    }
    function qt(n) {
        return Number.isSafeInteger(c(n));
    }
    function Ot() {
        return g(Symbol.iterator);
    }
    function Mt(n) {
        const t = Object.keys(c(n));
        return g(t);
    }
    function Nt(n) {
        return c(n).length;
    }
    function Rt(n) {
        return c(n).length;
    }
    function Tt(n) {
        const t = new Uint8Array(c(n));
        return g(t);
    }
    function Bt() {
        const n = new Error;
        return g(n);
    }
    function Ut() {
        return g(new Map);
    }
    function Lt(n, t) {
        const e = new Error(l(n, t));
        return g(e);
    }
    function $t() {
        const n = new Array;
        return g(n);
    }
    function Dt() {
        const n = new Object;
        return g(n);
    }
    function Jt(n, t) {
        const e = new Uint8Array(B(n, t));
        return g(e);
    }
    function Pt() {
        return q(function(n) {
            const t = c(n).next();
            return g(t);
        }, arguments);
    }
    function Vt(n) {
        const t = c(n).next;
        return g(t);
    }
    function Wt(n, t, e) {
        Uint8Array.prototype.set.call(B(n, t), c(e));
    }
    function zt() {
        return q(function(n, t, e) {
            return Reflect.set(c(n), c(t), c(e));
        }, arguments);
    }
    function Qt(n, t, e) {
        c(n)[t >>> 0] = u(e);
    }
    function Kt(n, t, e) {
        c(n)[u(t)] = u(e);
    }
    function Ht(n, t, e) {
        const o = c(n).set(c(t), c(e));
        return g(o);
    }
    function Xt(n, t) {
        const e = c(t).stack, o = f(e, _.__wbindgen_export, _.__wbindgen_export2), r = b;
        a().setInt32(n + 4, r, !0), a().setInt32(n + 0, o, !0);
    }
    function Yt(n) {
        const t = c(n).value;
        return g(t);
    }
    function Gt(n) {
        return g(n);
    }
    function Zt(n) {
        return g(n);
    }
    function te(n, t) {
        const e = l(n, t);
        return g(e);
    }
    function ee(n) {
        const t = BigInt.asUintN(64, n);
        return g(t);
    }
    function ne(n) {
        const t = c(n);
        return g(t);
    }
    function re(n) {
        u(n);
    }
    const L = typeof FinalizationRegistry > "u" ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((n)=>_.__wbg_document_free(n >>> 0, 1)), $ = typeof FinalizationRegistry > "u" ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((n)=>_.__wbg_quill_free(n >>> 0, 1));
    function g(n) {
        F === h.length && h.push(h.length + 1);
        const t = F;
        return F = h[t], h[t] = n, t;
    }
    function D(n, t) {
        if (!(n instanceof t)) throw new Error(`expected instance of ${t.name}`);
    }
    function T(n) {
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
            r > 0 && (i += T(n[0]));
            for(let d = 1; d < r; d++)i += ", " + T(n[d]);
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
    function _e(n) {
        n < 1028 || (h[n] = F, F = n);
    }
    function B(n, t) {
        return n = n >>> 0, A().subarray(n / 1, n / 1 + t);
    }
    let x = null;
    function a() {
        return (x === null || x.buffer.detached === !0 || x.buffer.detached === void 0 && x.buffer !== _.memory.buffer) && (x = new DataView(_.memory.buffer)), x;
    }
    function l(n, t) {
        return n = n >>> 0, ie(n, t);
    }
    let M = null;
    function A() {
        return (M === null || M.byteLength === 0) && (M = new Uint8Array(_.memory.buffer)), M;
    }
    function c(n) {
        return h[n];
    }
    function q(n, t) {
        try {
            return n.apply(this, t);
        } catch (e) {
            _.__wbindgen_export3(g(e));
        }
    }
    let h = new Array(1024).fill(void 0);
    h.push(void 0, null, !0, !1);
    let F = h.length;
    function k(n) {
        return n == null;
    }
    function f(n, t, e) {
        if (e === void 0) {
            const s = j.encode(n), w = t(s.length, 1) >>> 0;
            return A().subarray(w, w + s.length).set(s), b = s.length, w;
        }
        let o = n.length, r = t(o, 1) >>> 0;
        const i = A();
        let d = 0;
        for(; d < o; d++){
            const s = n.charCodeAt(d);
            if (s > 127) break;
            i[r + d] = s;
        }
        if (d !== o) {
            d !== 0 && (n = n.slice(d)), r = e(r, o, o = d + n.length * 3, 1) >>> 0;
            const s = A().subarray(r + d, r + o), w = j.encodeInto(n, s);
            d += w.written, r = e(r, o, d, 1) >>> 0;
        }
        return b = d, r;
    }
    function u(n) {
        const t = c(n);
        return _e(n), t;
    }
    let N = new TextDecoder("utf-8", {
        ignoreBOM: !0,
        fatal: !0
    });
    N.decode();
    const oe = 2146435072;
    let R = 0;
    function ie(n, t) {
        return R += t, R >= oe && (N = new TextDecoder("utf-8", {
            ignoreBOM: !0,
            fatal: !0
        }), N.decode(), R = t), N.decode(A().subarray(n, n + t));
    }
    const j = new TextEncoder;
    "encodeInto" in j || (j.encodeInto = function(n, t) {
        const e = j.encode(n);
        return t.set(e), {
            read: n.length,
            written: e.length
        };
    });
    let b = 0, _;
    function ae(n) {
        _ = n;
    }
    URL = globalThis.URL;
    const de = await H({
        "./wasm_bg.js": {
            __wbindgen_object_clone_ref: ne,
            __wbindgen_object_drop_ref: re,
            __wbg_get_unchecked_17f53dad852b9588: It,
            __wbg_set_3bf1de9fab0cd644: Qt,
            __wbg_length_3d4ecd04bd8d22f1: Nt,
            __wbg_set_fde2cec06c23692b: Ht,
            __wbg_entries_2bf997cf82353e47: lt,
            __wbg_next_0340c4ae324393c3: Pt,
            __wbg_instanceof_Object_7c99480a1cdfb911: At,
            __wbg_instanceof_Map_1b76fd4635be43eb: St,
            __wbg_done_9158f7cc8751ba32: wt,
            __wbg_value_ee3a06f4579184fa: Yt,
            __wbg_keys_2fd1bfdda7e278ca: Mt,
            __wbg_new_227d7c05414eb861: Bt,
            __wbg_stack_3b0d974bbf31e44f: Xt,
            __wbg_error_a6fa202b58aa1cd3: mt,
            __wbg_get_with_ref_key_6412cf3094599694: xt,
            __wbg_set_6be42768c690e380: Kt,
            __wbg_get_8360291721e2339f: kt,
            __wbg_String_8564e559799eccda: Y,
            __wbg_get_with_ref_key_f64427178466f623: Ct,
            __wbg_String_b51de6b05a10845b: G,
            __wbg_getRandomValues_3f44b700395062e5: ht,
            __wbg_new_from_slice_b5ea43e23f6008c0: Jt,
            __wbg_new_0c7403db6e782f19: Tt,
            __wbg_length_9f1775224cf1d815: Rt,
            __wbg_prototypesetcall_a6b02eb00b0f4ce2: Wt,
            __wbg_call_14b169f759b26747: ft,
            __wbg_instanceof_Uint8Array_152ba1f289edcf3f: Ft,
            __wbg_instanceof_ArrayBuffer_7c8433c6ed14ffe3: Et,
            __wbg_new_34d45cc8e36aaead: Ut,
            __wbg_new_682678e2f47e32bc: $t,
            __wbg_from_0dbf29f09e7fb200: yt,
            __wbg_isArray_c3109d14ffc06469: jt,
            __wbg_new_5e360d2ff7b9e1c3: Lt,
            __wbg_isSafeInteger_4fc213d1989d6d2a: qt,
            __wbg_new_aa8d0fa9762c29bd: Dt,
            __wbg_entries_e0b73aa8571ddb56: pt,
            __wbg_iterator_013bc09ec998c2a7: Ot,
            __wbg_get_1affdbdd5573b16a: vt,
            __wbg_set_022bee52d0b05b19: zt,
            __wbg_next_7646edaa39458ef7: Vt,
            __wbg___wbindgen_in_a5d8b22e52b24dd1: nt,
            __wbg___wbindgen_throw_6b64449b9b9ed33c: bt,
            __wbg___wbindgen_is_null_52ff4ec04186736f: ot,
            __wbg___wbindgen_jsval_eq_d3465d8a07697228: st,
            __wbg_Error_960c155d3d49e4c2: X,
            __wbg___wbindgen_is_bigint_ec25c7f91b4d9e93: rt,
            __wbg___wbindgen_is_object_63322ec0cd6ea4ef: it,
            __wbg___wbindgen_is_string_6df3bf7ef1164ed3: at,
            __wbg___wbindgen_number_get_c7f42aed0525c451: ut,
            __wbg___wbindgen_string_get_7ed5322991caaec5: gt,
            __wbg___wbindgen_boolean_get_6ea149f0a8dcc5ff: tt,
            __wbg___wbindgen_is_function_3baa9db1a987f47d: _t,
            __wbg___wbindgen_is_undefined_29a43b4d42920abd: dt,
            __wbg___wbindgen_jsval_loose_eq_cac3565e89b4134c: ct,
            __wbg___wbindgen_bigint_get_as_i64_3d3aba5d616c6a51: Z,
            __wbg___wbindgen_debug_string_ab4b34d23d6778bd: et,
            __wbindgen_cast_0000000000000001: Gt,
            __wbindgen_cast_0000000000000002: Zt,
            __wbindgen_cast_0000000000000003: te,
            __wbindgen_cast_0000000000000004: ee
        }
    }, K), { memory: se, __wbg_document_free: ce, __wbg_quill_free: ue, document_blueprintInstruction: ge, document_cardCount: be, document_cards: fe, document_clone: we, document_currentSchemaVersion: le, document_equals: pe, document_formatDiagnostic: me, document_formatRules: ye, document_fromJson: he, document_fromMarkdown: ve, document_insertCard: ke, document_main: Ie, document_makeCard: xe, document_moveCard: Ce, document_pushCard: Ee, document_quillRef: Se, document_quillRefHint: Ae, document_removeCard: Fe, document_removeCardExt: je, document_removeCardExtNamespace: qe, document_removeCardField: Oe, document_removeExt: Me, document_removeExtNamespace: Ne, document_removeField: Re, document_replaceBody: Te, document_schemaVersionOf: Be, document_setCardExt: Ue, document_setCardExtNamespace: Le, document_setCardKind: $e, document_setExt: De, document_setExtNamespace: Je, document_setField: Pe, document_setFill: Ve, document_setQuillRef: We, document_toJson: ze, document_toMarkdown: Qe, document_tryFromJson: Ke, document_updateCardBody: He, document_updateCardField: Xe, document_warnings: Ye, init: Ge, quill_backendId: Ze, quill_blueprint: tn, quill_fromTree: en, quill_metadata: nn, quill_schema: rn, quill_seedCard: _n, quill_seedDocument: on, quill_seedMain: an, quill_toTree: dn, quill_validate: sn, __wbindgen_export: cn, __wbindgen_export2: un, __wbindgen_export3: gn, __wbindgen_export4: bn, __wbindgen_add_to_stack_pointer: fn, __wbindgen_start: J } = de, wn = Object.freeze(Object.defineProperty({
        __proto__: null,
        __wbg_document_free: ce,
        __wbg_quill_free: ue,
        __wbindgen_add_to_stack_pointer: fn,
        __wbindgen_export: cn,
        __wbindgen_export2: un,
        __wbindgen_export3: gn,
        __wbindgen_export4: bn,
        __wbindgen_start: J,
        document_blueprintInstruction: ge,
        document_cardCount: be,
        document_cards: fe,
        document_clone: we,
        document_currentSchemaVersion: le,
        document_equals: pe,
        document_formatDiagnostic: me,
        document_formatRules: ye,
        document_fromJson: he,
        document_fromMarkdown: ve,
        document_insertCard: ke,
        document_main: Ie,
        document_makeCard: xe,
        document_moveCard: Ce,
        document_pushCard: Ee,
        document_quillRef: Se,
        document_quillRefHint: Ae,
        document_removeCard: Fe,
        document_removeCardExt: je,
        document_removeCardExtNamespace: qe,
        document_removeCardField: Oe,
        document_removeExt: Me,
        document_removeExtNamespace: Ne,
        document_removeField: Re,
        document_replaceBody: Te,
        document_schemaVersionOf: Be,
        document_setCardExt: Ue,
        document_setCardExtNamespace: Le,
        document_setCardKind: $e,
        document_setExt: De,
        document_setExtNamespace: Je,
        document_setField: Pe,
        document_setFill: Ve,
        document_setQuillRef: We,
        document_toJson: ze,
        document_toMarkdown: Qe,
        document_tryFromJson: Ke,
        document_updateCardBody: He,
        document_updateCardField: Xe,
        document_warnings: Ye,
        init: Ge,
        memory: se,
        quill_backendId: Ze,
        quill_blueprint: tn,
        quill_fromTree: en,
        quill_metadata: nn,
        quill_schema: rn,
        quill_seedCard: _n,
        quill_seedDocument: on,
        quill_seedMain: an,
        quill_toTree: dn,
        quill_validate: sn
    }, Symbol.toStringTag, {
        value: "Module"
    }));
    ae(wn);
    J();
    const ln = {
        typst: {
            load: ()=>Q(()=>import("./wasm-OoL1PHSA.js").then(async (m)=>{
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
    function pn(n, t) {
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
    class mn {
        #t = new Map;
        #r = new Map;
        #e;
        #_ = new Map;
        constructor(t){
            const e = {
                ...ln,
                ...t?.backends ?? {}
            }, o = {};
            for (const [r, i] of Object.entries(e))o[r] = pn(r, i);
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
            const { mod: i, engine: d } = await this.#i(t), s = this.#a(i, t, e);
            let w = null;
            try {
                return w = i.Document.fromJson(o.toJson()), r({
                    mod: i,
                    engine: d,
                    quill: s,
                    doc: w
                });
            } finally{
                w?.free();
            }
        }
        async render(t, e, o) {
            return this.#o(t.backendId, t, e, ({ engine: r, quill: i, doc: d })=>r.render(i, d, o ?? void 0));
        }
        async open(t, e) {
            return this.#o(t.backendId, t, e, ({ engine: o, quill: r, doc: i })=>new yn(o.open(r, i)));
        }
        async supportedFormats(t) {
            return this.#n(t.backendId).formats.slice();
        }
        async supportsCanvas(t) {
            return this.#n(t.backendId).canvas;
        }
    }
    class yn {
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
    function hn(n) {
        const t = {};
        for (const [e, o] of Object.entries(n)){
            const r = atob(o), i = new Uint8Array(r.length);
            for(let d = 0; d < r.length; d++)i[d] = r.charCodeAt(d);
            t[e] = i;
        }
        return t;
    }
    function vn(n) {
        let t = "";
        for(let o = 0; o < n.length; o += 32768)t += String.fromCharCode.apply(null, n.subarray(o, o + 32768));
        return btoa(t);
    }
    function P(n) {
        return Array.isArray(n) ? n.map((t)=>({
                severity: t.severity,
                message: t.message,
                code: t.code,
                location: t.location
            })) : [];
    }
    async function V(n, t = {}) {
        const e = hn(n), o = C.fromTree(e), r = t.markdown != null && t.markdown !== "" ? m.fromMarkdown(t.markdown) : o.seedDocument(), d = await new mn().render(o, r, {
            format: t.format || "pdf"
        });
        return {
            metadata: o.metadata,
            outputFormat: d.outputFormat,
            renderTimeMs: d.renderTimeMs,
            warnings: P(d.warnings),
            artifacts: d.artifacts.map((s)=>({
                    format: s.format,
                    mimeType: s.mimeType,
                    length: s.bytes.length,
                    base64: vn(s.bytes)
                }))
        };
    }
    window.renderQuill = V;
    window.__bridgeReady = !0;
    window.chrome?.webview && (window.chrome.webview.addEventListener("message", async (n)=>{
        const t = n.data;
        try {
            const e = await V(t.tree, t.opts || {});
            window.chrome.webview.postMessage(JSON.stringify({
                id: t.id,
                ok: !0,
                result: e
            }));
        } catch (e) {
            window.chrome.webview.postMessage(JSON.stringify({
                id: t?.id,
                ok: !1,
                error: String(e?.message || e),
                diagnostics: P(e?.diagnostics)
            }));
        }
    }), window.addEventListener("unhandledrejection", (n)=>window.chrome.webview.postMessage(JSON.stringify({
            type: "error",
            error: "unhandledrejection: " + String(n.reason?.message || n.reason)
        }))), window.addEventListener("error", (n)=>window.chrome.webview.postMessage(JSON.stringify({
            type: "error",
            error: "error: " + String(n.message)
        }))), window.chrome.webview.postMessage(JSON.stringify({
        type: "ready"
    })));
})();
export { H as _, __tla };
