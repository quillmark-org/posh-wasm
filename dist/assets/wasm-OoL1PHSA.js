import { _ as $, __tla as __tla_0 } from "./index-Dt6P0FBx.js";
let l, h, O, q, H_;
let __tla = Promise.all([
    (()=>{
        try {
            return __tla_0;
        } catch  {}
    })()
]).then(async ()=>{
    const L = "" + new URL("wasm_bg-CKJggJyA.wasm", import.meta.url).href;
    l = class {
        static __wrap(t) {
            t = t >>> 0;
            const n = Object.create(l.prototype);
            return n.__wbg_ptr = t, U.register(n, n.__wbg_ptr, n), n;
        }
        __destroy_into_raw() {
            const t = this.__wbg_ptr;
            return this.__wbg_ptr = 0, U.unregister(this), t;
        }
        free() {
            const t = this.__destroy_into_raw();
            e.__wbg_document_free(t, 0);
        }
        static blueprintInstruction(t) {
            let n, o;
            try {
                const d = e.__wbindgen_add_to_stack_pointer(-16), g = w(t, e.__wbindgen_export, e.__wbindgen_export2), f = u;
                e.document_blueprintInstruction(d, g, f);
                var r = a().getInt32(d + 0, !0), i = a().getInt32(d + 4, !0);
                return n = r, o = i, p(r, i);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16), e.__wbindgen_export4(n, o, 1);
            }
        }
        get cardCount() {
            return e.document_cardCount(this.__wbg_ptr) >>> 0;
        }
        get cards() {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_cards(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), n = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw s(n);
                return s(t);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        clone() {
            const t = e.document_clone(this.__wbg_ptr);
            return l.__wrap(t);
        }
        static currentSchemaVersion() {
            let t, n;
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_currentSchemaVersion(i);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, n = r, p(o, r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16), e.__wbindgen_export4(t, n, 1);
            }
        }
        equals(t) {
            return v(t, l), e.document_equals(this.__wbg_ptr, t.__wbg_ptr) !== 0;
        }
        static formatDiagnostic(t) {
            let n, o;
            try {
                const d = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_formatDiagnostic(d, b(t));
                var r = a().getInt32(d + 0, !0), i = a().getInt32(d + 4, !0);
                return n = r, o = i, p(r, i);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16), e.__wbindgen_export4(n, o, 1);
            }
        }
        static formatRules() {
            let t, n;
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_formatRules(i);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, n = r, p(o, r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16), e.__wbindgen_export4(t, n, 1);
            }
        }
        static fromJson(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16), d = w(t, e.__wbindgen_export, e.__wbindgen_export2), g = u;
                e.document_fromJson(i, d, g);
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return l.__wrap(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        static fromMarkdown(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16), d = w(t, e.__wbindgen_export, e.__wbindgen_export2), g = u;
                e.document_fromMarkdown(i, d, g);
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return l.__wrap(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        insertCard(t, n) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_insertCard(i, this.__wbg_ptr, t, b(n));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw s(o);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        get main() {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_main(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), n = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw s(n);
                return s(t);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        static makeCard(t, n, o) {
            try {
                const E = e.__wbindgen_add_to_stack_pointer(-16), V = w(t, e.__wbindgen_export, e.__wbindgen_export2), J = u;
                var r = m(o) ? 0 : w(o, e.__wbindgen_export, e.__wbindgen_export2), i = u;
                e.document_makeCard(E, V, J, m(n) ? 0 : b(n), r, i);
                var d = a().getInt32(E + 0, !0), g = a().getInt32(E + 4, !0), f = a().getInt32(E + 8, !0);
                if (f) throw s(g);
                return s(d);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        moveCard(t, n) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_moveCard(i, this.__wbg_ptr, t, n);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw s(o);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        pushCard(t) {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_pushCard(r, this.__wbg_ptr, b(t));
                var n = a().getInt32(r + 0, !0), o = a().getInt32(r + 4, !0);
                if (o) throw s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        get quillRef() {
            let t, n;
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_quillRef(i, this.__wbg_ptr);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, n = r, p(o, r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16), e.__wbindgen_export4(t, n, 1);
            }
        }
        static quillRefHint() {
            let t, n;
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_quillRefHint(i);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, n = r, p(o, r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16), e.__wbindgen_export4(t, n, 1);
            }
        }
        removeCard(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_removeCard(i, this.__wbg_ptr, t);
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeCardExt(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_removeCardExt(i, this.__wbg_ptr, t);
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeCardExtNamespace(t, n) {
            try {
                const d = e.__wbindgen_add_to_stack_pointer(-16), g = w(n, e.__wbindgen_export, e.__wbindgen_export2), f = u;
                e.document_removeCardExtNamespace(d, this.__wbg_ptr, t, g, f);
                var o = a().getInt32(d + 0, !0), r = a().getInt32(d + 4, !0), i = a().getInt32(d + 8, !0);
                if (i) throw s(r);
                return s(o);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeCardField(t, n) {
            try {
                const d = e.__wbindgen_add_to_stack_pointer(-16), g = w(n, e.__wbindgen_export, e.__wbindgen_export2), f = u;
                e.document_removeCardField(d, this.__wbg_ptr, t, g, f);
                var o = a().getInt32(d + 0, !0), r = a().getInt32(d + 4, !0), i = a().getInt32(d + 8, !0);
                if (i) throw s(r);
                return s(o);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeExt() {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_removeExt(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), n = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw s(n);
                return s(t);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeExtNamespace(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16), d = w(t, e.__wbindgen_export, e.__wbindgen_export2), g = u;
                e.document_removeExtNamespace(i, this.__wbg_ptr, d, g);
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        removeField(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16), d = w(t, e.__wbindgen_export, e.__wbindgen_export2), g = u;
                e.document_removeField(i, this.__wbg_ptr, d, g);
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        replaceBody(t) {
            const n = w(t, e.__wbindgen_export, e.__wbindgen_export2), o = u;
            e.document_replaceBody(this.__wbg_ptr, n, o);
        }
        static schemaVersionOf(t) {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16), i = w(t, e.__wbindgen_export, e.__wbindgen_export2), d = u;
                e.document_schemaVersionOf(r, i, d);
                var n = a().getInt32(r + 0, !0), o = a().getInt32(r + 4, !0);
                let g;
                return n !== 0 && (g = p(n, o).slice(), e.__wbindgen_export4(n, o * 1, 1)), g;
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setCardExt(t, n) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_setCardExt(i, this.__wbg_ptr, t, b(n));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw s(o);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setCardExtNamespace(t, n, o) {
            try {
                const d = e.__wbindgen_add_to_stack_pointer(-16), g = w(n, e.__wbindgen_export, e.__wbindgen_export2), f = u;
                e.document_setCardExtNamespace(d, this.__wbg_ptr, t, g, f, b(o));
                var r = a().getInt32(d + 0, !0), i = a().getInt32(d + 4, !0);
                if (i) throw s(r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setCardKind(t, n) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16), d = w(n, e.__wbindgen_export, e.__wbindgen_export2), g = u;
                e.document_setCardKind(i, this.__wbg_ptr, t, d, g);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw s(o);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setExt(t) {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_setExt(r, this.__wbg_ptr, b(t));
                var n = a().getInt32(r + 0, !0), o = a().getInt32(r + 4, !0);
                if (o) throw s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setExtNamespace(t, n) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16), d = w(t, e.__wbindgen_export, e.__wbindgen_export2), g = u;
                e.document_setExtNamespace(i, this.__wbg_ptr, d, g, b(n));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw s(o);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setField(t, n) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16), d = w(t, e.__wbindgen_export, e.__wbindgen_export2), g = u;
                e.document_setField(i, this.__wbg_ptr, d, g, b(n));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw s(o);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setFill(t, n) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16), d = w(t, e.__wbindgen_export, e.__wbindgen_export2), g = u;
                e.document_setFill(i, this.__wbg_ptr, d, g, b(n));
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw s(o);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        setQuillRef(t) {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16), i = w(t, e.__wbindgen_export, e.__wbindgen_export2), d = u;
                e.document_setQuillRef(r, this.__wbg_ptr, i, d);
                var n = a().getInt32(r + 0, !0), o = a().getInt32(r + 4, !0);
                if (o) throw s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        toJson() {
            let t, n;
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_toJson(i, this.__wbg_ptr);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, n = r, p(o, r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16), e.__wbindgen_export4(t, n, 1);
            }
        }
        toMarkdown() {
            let t, n;
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_toMarkdown(i, this.__wbg_ptr);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, n = r, p(o, r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16), e.__wbindgen_export4(t, n, 1);
            }
        }
        static tryFromJson(t) {
            const n = w(t, e.__wbindgen_export, e.__wbindgen_export2), o = u, r = e.document_tryFromJson(n, o);
            return r === 0 ? void 0 : l.__wrap(r);
        }
        updateCardBody(t, n) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16), d = w(n, e.__wbindgen_export, e.__wbindgen_export2), g = u;
                e.document_updateCardBody(i, this.__wbg_ptr, t, d, g);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                if (r) throw s(o);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        updateCardField(t, n, o) {
            try {
                const d = e.__wbindgen_add_to_stack_pointer(-16), g = w(n, e.__wbindgen_export, e.__wbindgen_export2), f = u;
                e.document_updateCardField(d, this.__wbg_ptr, t, g, f, b(o));
                var r = a().getInt32(d + 0, !0), i = a().getInt32(d + 4, !0);
                if (i) throw s(r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        get warnings() {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16);
                e.document_warnings(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), n = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw s(n);
                return s(t);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
    };
    Symbol.dispose && (l.prototype[Symbol.dispose] = l.prototype.free);
    h = class {
        static __wrap(t) {
            t = t >>> 0;
            const n = Object.create(h.prototype);
            return n.__wbg_ptr = t, D.register(n, n.__wbg_ptr, n), n;
        }
        __destroy_into_raw() {
            const t = this.__wbg_ptr;
            return this.__wbg_ptr = 0, D.unregister(this), t;
        }
        free() {
            const t = this.__destroy_into_raw();
            e.__wbg_quill_free(t, 0);
        }
        get backendId() {
            let t, n;
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.quill_backendId(i, this.__wbg_ptr);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, n = r, p(o, r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16), e.__wbindgen_export4(t, n, 1);
            }
        }
        get blueprint() {
            let t, n;
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.quill_blueprint(i, this.__wbg_ptr);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, n = r, p(o, r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16), e.__wbindgen_export4(t, n, 1);
            }
        }
        static fromTree(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.quill_fromTree(i, b(t));
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return h.__wrap(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        get metadata() {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16);
                e.quill_metadata(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), n = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw s(n);
                return s(t);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        get schema() {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16);
                e.quill_schema(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), n = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw s(n);
                return s(t);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        seedCard(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16), d = w(t, e.__wbindgen_export, e.__wbindgen_export2), g = u;
                e.quill_seedCard(i, this.__wbg_ptr, d, g);
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        seedDocument() {
            const t = e.quill_seedDocument(this.__wbg_ptr);
            return l.__wrap(t);
        }
        seedMain() {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16);
                e.quill_seedMain(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), n = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw s(n);
                return s(t);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        toTree() {
            const t = e.quill_toTree(this.__wbg_ptr);
            return s(t);
        }
        validate(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                v(t, l), e.quill_validate(i, this.__wbg_ptr, t.__wbg_ptr);
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
    };
    Symbol.dispose && (h.prototype[Symbol.dispose] = h.prototype.free);
    O = class {
        __destroy_into_raw() {
            const t = this.__wbg_ptr;
            return this.__wbg_ptr = 0, N.unregister(this), t;
        }
        free() {
            const t = this.__destroy_into_raw();
            e.__wbg_quillmark_free(t, 0);
        }
        constructor(){
            const t = e.quillmark_new();
            return this.__wbg_ptr = t >>> 0, N.register(this, this.__wbg_ptr, this), this;
        }
        open(t, n) {
            try {
                const d = e.__wbindgen_add_to_stack_pointer(-16);
                v(t, h), v(n, l), e.quillmark_open(d, this.__wbg_ptr, t.__wbg_ptr, n.__wbg_ptr);
                var o = a().getInt32(d + 0, !0), r = a().getInt32(d + 4, !0), i = a().getInt32(d + 8, !0);
                if (i) throw s(r);
                return q.__wrap(o);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        render(t, n, o) {
            try {
                const g = e.__wbindgen_add_to_stack_pointer(-16);
                v(t, h), v(n, l), e.quillmark_render(g, this.__wbg_ptr, t.__wbg_ptr, n.__wbg_ptr, m(o) ? 0 : b(o));
                var r = a().getInt32(g + 0, !0), i = a().getInt32(g + 4, !0), d = a().getInt32(g + 8, !0);
                if (d) throw s(i);
                return s(r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        supportedFormats(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                v(t, h), e.quillmark_supportedFormats(i, this.__wbg_ptr, t.__wbg_ptr);
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        supportsCanvas(t) {
            return v(t, h), e.quillmark_supportsCanvas(this.__wbg_ptr, t.__wbg_ptr) !== 0;
        }
    };
    Symbol.dispose && (O.prototype[Symbol.dispose] = O.prototype.free);
    q = class {
        static __wrap(t) {
            t = t >>> 0;
            const n = Object.create(q.prototype);
            return n.__wbg_ptr = t, z.register(n, n.__wbg_ptr, n), n;
        }
        __destroy_into_raw() {
            const t = this.__wbg_ptr;
            return this.__wbg_ptr = 0, z.unregister(this), t;
        }
        free() {
            const t = this.__destroy_into_raw();
            e.__wbg_rendersession_free(t, 0);
        }
        get backendId() {
            let t, n;
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.rendersession_backendId(i, this.__wbg_ptr);
                var o = a().getInt32(i + 0, !0), r = a().getInt32(i + 4, !0);
                return t = o, n = r, p(o, r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16), e.__wbindgen_export4(t, n, 1);
            }
        }
        get pageCount() {
            return e.rendersession_pageCount(this.__wbg_ptr) >>> 0;
        }
        pageSize(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.rendersession_pageSize(i, this.__wbg_ptr, t);
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        paint(t, n, o) {
            try {
                const g = e.__wbindgen_add_to_stack_pointer(-16);
                e.rendersession_paint(g, this.__wbg_ptr, b(t), n, b(o));
                var r = a().getInt32(g + 0, !0), i = a().getInt32(g + 4, !0), d = a().getInt32(g + 8, !0);
                if (d) throw s(i);
                return s(r);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        render(t) {
            try {
                const i = e.__wbindgen_add_to_stack_pointer(-16);
                e.rendersession_render(i, this.__wbg_ptr, m(t) ? 0 : b(t));
                var n = a().getInt32(i + 0, !0), o = a().getInt32(i + 4, !0), r = a().getInt32(i + 8, !0);
                if (r) throw s(o);
                return s(n);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
        get supportsCanvas() {
            return e.rendersession_supportsCanvas(this.__wbg_ptr) !== 0;
        }
        get warnings() {
            try {
                const r = e.__wbindgen_add_to_stack_pointer(-16);
                e.rendersession_warnings(r, this.__wbg_ptr);
                var t = a().getInt32(r + 0, !0), n = a().getInt32(r + 4, !0), o = a().getInt32(r + 8, !0);
                if (o) throw s(n);
                return s(t);
            } finally{
                e.__wbindgen_add_to_stack_pointer(16);
            }
        }
    };
    Symbol.dispose && (q.prototype[Symbol.dispose] = q.prototype.free);
    H_ = function() {
        e.init();
    };
    function W(_, t) {
        const n = Error(p(_, t));
        return b(n);
    }
    function Q(_, t) {
        const n = String(c(t)), o = w(n, e.__wbindgen_export, e.__wbindgen_export2), r = u;
        a().setInt32(_ + 4, r, !0), a().setInt32(_ + 0, o, !0);
    }
    function H(_, t) {
        const n = String(c(t)), o = w(n, e.__wbindgen_export, e.__wbindgen_export2), r = u;
        a().setInt32(_ + 4, r, !0), a().setInt32(_ + 0, o, !0);
    }
    function K(_, t) {
        const n = c(t), o = typeof n == "bigint" ? n : void 0;
        a().setBigInt64(_ + 8, m(o) ? BigInt(0) : o, !0), a().setInt32(_ + 0, !m(o), !0);
    }
    function Y(_) {
        const t = c(_), n = typeof t == "boolean" ? t : void 0;
        return m(n) ? 16777215 : n ? 1 : 0;
    }
    function P(_, t) {
        const n = M(c(t)), o = w(n, e.__wbindgen_export, e.__wbindgen_export2), r = u;
        a().setInt32(_ + 4, r, !0), a().setInt32(_ + 0, o, !0);
    }
    function X(_, t) {
        return c(_) in c(t);
    }
    function G(_) {
        return typeof c(_) == "bigint";
    }
    function Z(_) {
        return typeof c(_) == "function";
    }
    function tt(_) {
        return c(_) === null;
    }
    function et(_) {
        const t = c(_);
        return typeof t == "object" && t !== null;
    }
    function _t(_) {
        return typeof c(_) == "string";
    }
    function nt(_) {
        return c(_) === void 0;
    }
    function rt(_, t) {
        return c(_) === c(t);
    }
    function ot(_, t) {
        return c(_) == c(t);
    }
    function it(_, t) {
        const n = c(t), o = typeof n == "number" ? n : void 0;
        a().setFloat64(_ + 8, m(o) ? 0 : o, !0), a().setInt32(_ + 0, !m(o), !0);
    }
    function at(_, t) {
        const n = c(t), o = typeof n == "string" ? n : void 0;
        var r = m(o) ? 0 : w(o, e.__wbindgen_export, e.__wbindgen_export2), i = u;
        a().setInt32(_ + 4, i, !0), a().setInt32(_ + 0, r, !0);
    }
    function dt(_, t) {
        throw new Error(p(_, t));
    }
    function ct() {
        return I(function(_, t) {
            const n = c(_).call(c(t));
            return b(n);
        }, arguments);
    }
    function st(_) {
        const t = c(_).canvas;
        return m(t) ? 0 : b(t);
    }
    function gt(_) {
        const t = c(_).canvas;
        return b(t);
    }
    function bt(_) {
        return c(_).done;
    }
    function ut(_) {
        const t = c(_).entries();
        return b(t);
    }
    function wt(_) {
        const t = Object.entries(c(_));
        return b(t);
    }
    function ft(_, t) {
        let n, o;
        try {
            n = _, o = t, console.error(p(_, t));
        } finally{
            e.__wbindgen_export4(n, o, 1);
        }
    }
    function pt(_) {
        const t = Array.from(c(_));
        return b(t);
    }
    function lt() {
        return I(function(_, t) {
            globalThis.crypto.getRandomValues(A(_, t));
        }, arguments);
    }
    function mt(_) {
        return c(_).getTime();
    }
    function yt(_) {
        return c(_).getUTCDate();
    }
    function ht(_) {
        return c(_).getUTCFullYear();
    }
    function vt(_) {
        return c(_).getUTCMonth();
    }
    function It() {
        return I(function(_, t) {
            const n = Reflect.get(c(_), c(t));
            return b(n);
        }, arguments);
    }
    function kt(_, t) {
        const n = c(_)[t >>> 0];
        return b(n);
    }
    function xt(_, t) {
        const n = c(_)[t >>> 0];
        return b(n);
    }
    function Ct(_, t) {
        const n = c(_)[c(t)];
        return b(n);
    }
    function Ft(_, t) {
        const n = c(_)[c(t)];
        return b(n);
    }
    function qt(_) {
        let t;
        try {
            t = c(_) instanceof ArrayBuffer;
        } catch  {
            t = !1;
        }
        return t;
    }
    function Et(_) {
        let t;
        try {
            t = c(_) instanceof CanvasRenderingContext2D;
        } catch  {
            t = !1;
        }
        return t;
    }
    function St(_) {
        let t;
        try {
            t = c(_) instanceof Map;
        } catch  {
            t = !1;
        }
        return t;
    }
    function Rt(_) {
        let t;
        try {
            t = c(_) instanceof Object;
        } catch  {
            t = !1;
        }
        return t;
    }
    function jt(_) {
        let t;
        try {
            t = c(_) instanceof OffscreenCanvasRenderingContext2D;
        } catch  {
            t = !1;
        }
        return t;
    }
    function At(_) {
        let t;
        try {
            t = c(_) instanceof Uint8Array;
        } catch  {
            t = !1;
        }
        return t;
    }
    function Tt(_) {
        return Array.isArray(c(_));
    }
    function Mt(_) {
        return Number.isSafeInteger(c(_));
    }
    function Ot() {
        return b(Symbol.iterator);
    }
    function Ut(_) {
        const t = Object.keys(c(_));
        return b(t);
    }
    function Dt(_) {
        return c(_).length;
    }
    function Nt(_) {
        return c(_).length;
    }
    function zt() {
        return b(new Date);
    }
    function Bt(_) {
        const t = new Uint8Array(c(_));
        return b(t);
    }
    function Vt() {
        const _ = new Error;
        return b(_);
    }
    function Jt() {
        return b(new Map);
    }
    function $t(_, t) {
        const n = new Error(p(_, t));
        return b(n);
    }
    function Lt() {
        const _ = new Array;
        return b(_);
    }
    function Wt(_) {
        const t = new Date(c(_));
        return b(t);
    }
    function Qt() {
        const _ = new Object;
        return b(_);
    }
    function Ht(_, t) {
        const n = new Uint8Array(A(_, t));
        return b(n);
    }
    function Kt() {
        return I(function(_, t, n, o) {
            const r = new ImageData(he(_, t), n >>> 0, o >>> 0);
            return b(r);
        }, arguments);
    }
    function Yt() {
        return I(function(_) {
            const t = c(_).next();
            return b(t);
        }, arguments);
    }
    function Pt(_) {
        const t = c(_).next;
        return b(t);
    }
    function Xt() {
        return Date.now();
    }
    function Gt(_, t, n) {
        Uint8Array.prototype.set.call(A(_, t), c(n));
    }
    function Zt() {
        return I(function(_, t, n, o) {
            c(_).putImageData(c(t), n, o);
        }, arguments);
    }
    function te() {
        return I(function(_, t, n, o) {
            c(_).putImageData(c(t), n, o);
        }, arguments);
    }
    function ee() {
        return I(function(_, t, n) {
            return Reflect.set(c(_), c(t), c(n));
        }, arguments);
    }
    function _e(_, t, n) {
        c(_)[t >>> 0] = s(n);
    }
    function ne(_, t, n) {
        c(_)[s(t)] = s(n);
    }
    function re(_, t, n) {
        c(_)[s(t)] = s(n);
    }
    function oe(_, t, n) {
        const o = c(_).set(c(t), c(n));
        return b(o);
    }
    function ie(_, t) {
        c(_).height = t >>> 0;
    }
    function ae(_, t) {
        c(_).height = t >>> 0;
    }
    function de(_, t) {
        c(_).width = t >>> 0;
    }
    function ce(_, t) {
        c(_).width = t >>> 0;
    }
    function se(_, t) {
        const n = c(t).stack, o = w(n, e.__wbindgen_export, e.__wbindgen_export2), r = u;
        a().setInt32(_ + 4, r, !0), a().setInt32(_ + 0, o, !0);
    }
    function ge(_) {
        const t = c(_).value;
        return b(t);
    }
    function be(_) {
        return b(_);
    }
    function ue(_) {
        return b(_);
    }
    function we(_, t) {
        const n = A(_, t);
        return b(n);
    }
    function fe(_, t) {
        const n = p(_, t);
        return b(n);
    }
    function pe(_) {
        const t = BigInt.asUintN(64, _);
        return b(t);
    }
    function le(_) {
        const t = c(_);
        return b(t);
    }
    function me(_) {
        s(_);
    }
    const U = typeof FinalizationRegistry > "u" ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((_)=>e.__wbg_document_free(_ >>> 0, 1)), D = typeof FinalizationRegistry > "u" ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((_)=>e.__wbg_quill_free(_ >>> 0, 1)), N = typeof FinalizationRegistry > "u" ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((_)=>e.__wbg_quillmark_free(_ >>> 0, 1)), z = typeof FinalizationRegistry > "u" ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((_)=>e.__wbg_rendersession_free(_ >>> 0, 1));
    function b(_) {
        C === y.length && y.push(y.length + 1);
        const t = C;
        return C = y[t], y[t] = _, t;
    }
    function v(_, t) {
        if (!(_ instanceof t)) throw new Error(`expected instance of ${t.name}`);
    }
    function M(_) {
        const t = typeof _;
        if (t == "number" || t == "boolean" || _ == null) return `${_}`;
        if (t == "string") return `"${_}"`;
        if (t == "symbol") {
            const r = _.description;
            return r == null ? "Symbol" : `Symbol(${r})`;
        }
        if (t == "function") {
            const r = _.name;
            return typeof r == "string" && r.length > 0 ? `Function(${r})` : "Function";
        }
        if (Array.isArray(_)) {
            const r = _.length;
            let i = "[";
            r > 0 && (i += M(_[0]));
            for(let d = 1; d < r; d++)i += ", " + M(_[d]);
            return i += "]", i;
        }
        const n = /\[object ([^\]]+)\]/.exec(toString.call(_));
        let o;
        if (n && n.length > 1) o = n[1];
        else return toString.call(_);
        if (o == "Object") try {
            return "Object(" + JSON.stringify(_) + ")";
        } catch  {
            return "Object";
        }
        return _ instanceof Error ? `${_.name}: ${_.message}
${_.stack}` : o;
    }
    function ye(_) {
        _ < 1028 || (y[_] = C, C = _);
    }
    function A(_, t) {
        return _ = _ >>> 0, x().subarray(_ / 1, _ / 1 + t);
    }
    function he(_, t) {
        return _ = _ >>> 0, ve().subarray(_ / 1, _ / 1 + t);
    }
    let k = null;
    function a() {
        return (k === null || k.buffer.detached === !0 || k.buffer.detached === void 0 && k.buffer !== e.memory.buffer) && (k = new DataView(e.memory.buffer)), k;
    }
    function p(_, t) {
        return _ = _ >>> 0, ke(_, t);
    }
    let S = null;
    function x() {
        return (S === null || S.byteLength === 0) && (S = new Uint8Array(e.memory.buffer)), S;
    }
    let R = null;
    function ve() {
        return (R === null || R.byteLength === 0) && (R = new Uint8ClampedArray(e.memory.buffer)), R;
    }
    function c(_) {
        return y[_];
    }
    function I(_, t) {
        try {
            return _.apply(this, t);
        } catch (n) {
            e.__wbindgen_export3(b(n));
        }
    }
    let y = new Array(1024).fill(void 0);
    y.push(void 0, null, !0, !1);
    let C = y.length;
    function m(_) {
        return _ == null;
    }
    function w(_, t, n) {
        if (n === void 0) {
            const g = F.encode(_), f = t(g.length, 1) >>> 0;
            return x().subarray(f, f + g.length).set(g), u = g.length, f;
        }
        let o = _.length, r = t(o, 1) >>> 0;
        const i = x();
        let d = 0;
        for(; d < o; d++){
            const g = _.charCodeAt(d);
            if (g > 127) break;
            i[r + d] = g;
        }
        if (d !== o) {
            d !== 0 && (_ = _.slice(d)), r = n(r, o, o = d + _.length * 3, 1) >>> 0;
            const g = x().subarray(r + d, r + o), f = F.encodeInto(_, g);
            d += f.written, r = n(r, o, d, 1) >>> 0;
        }
        return u = d, r;
    }
    function s(_) {
        const t = c(_);
        return ye(_), t;
    }
    let j = new TextDecoder("utf-8", {
        ignoreBOM: !0,
        fatal: !0
    });
    j.decode();
    const Ie = 2146435072;
    let T = 0;
    function ke(_, t) {
        return T += t, T >= Ie && (j = new TextDecoder("utf-8", {
            ignoreBOM: !0,
            fatal: !0
        }), j.decode(), T = t), j.decode(x().subarray(_, _ + t));
    }
    const F = new TextEncoder;
    "encodeInto" in F || (F.encodeInto = function(_, t) {
        const n = F.encode(_);
        return t.set(n), {
            read: _.length,
            written: n.length
        };
    });
    let u = 0, e;
    function xe(_) {
        e = _;
    }
    URL = globalThis.URL;
    const Ce = await $({
        "./wasm_bg.js": {
            __wbindgen_object_clone_ref: le,
            __wbindgen_object_drop_ref: me,
            __wbg_get_unchecked_17f53dad852b9588: xt,
            __wbg_set_3bf1de9fab0cd644: _e,
            __wbg_length_3d4ecd04bd8d22f1: Dt,
            __wbg_set_fde2cec06c23692b: oe,
            __wbg_entries_2bf997cf82353e47: ut,
            __wbg_next_0340c4ae324393c3: Yt,
            __wbg_instanceof_Object_7c99480a1cdfb911: Rt,
            __wbg_instanceof_Map_1b76fd4635be43eb: St,
            __wbg_done_9158f7cc8751ba32: bt,
            __wbg_value_ee3a06f4579184fa: ge,
            __wbg_keys_2fd1bfdda7e278ca: Ut,
            __wbg_new_227d7c05414eb861: Vt,
            __wbg_stack_3b0d974bbf31e44f: se,
            __wbg_error_a6fa202b58aa1cd3: ft,
            __wbg_new_with_u8_clamped_array_and_sh_fe957411824b5158: Kt,
            __wbg_set_height_24d07d982f176ac6: ie,
            __wbg_set_width_adc925bca9c5351a: ce,
            __wbg_set_height_be9b2b920bd68401: ae,
            __wbg_set_width_5cda41d4d06a14dd: de,
            __wbg_instanceof_CanvasRenderingContext2d_24a3fe06e62b98d7: Et,
            __wbg_putImageData_c810e62ea70e761d: Zt,
            __wbg_canvas_2c0c6d263d4c52ad: st,
            __wbg_instanceof_OffscreenCanvasRenderingContext2d_285a274020b4f230: jt,
            __wbg_putImageData_cb4de9afd58963be: te,
            __wbg_canvas_374da9f3c5b3dd0e: gt,
            __wbg_get_with_ref_key_6412cf3094599694: Ct,
            __wbg_set_6be42768c690e380: ne,
            __wbg_get_8360291721e2339f: kt,
            __wbg_String_8564e559799eccda: Q,
            __wbg_get_with_ref_key_f64427178466f623: Ft,
            __wbg_set_f071dbb3bd088e0e: re,
            __wbg_String_b51de6b05a10845b: H,
            __wbg_getRandomValues_3f44b700395062e5: lt,
            __wbg_new_from_slice_b5ea43e23f6008c0: Ht,
            __wbg_new_0c7403db6e782f19: Bt,
            __wbg_length_9f1775224cf1d815: Nt,
            __wbg_prototypesetcall_a6b02eb00b0f4ce2: Gt,
            __wbg_call_14b169f759b26747: ct,
            __wbg_instanceof_Uint8Array_152ba1f289edcf3f: At,
            __wbg_instanceof_ArrayBuffer_7c8433c6ed14ffe3: qt,
            __wbg_new_34d45cc8e36aaead: Jt,
            __wbg_getUTCDate_5cd8b68e971333f7: yt,
            __wbg_getUTCMonth_62fa72a7522ef806: vt,
            __wbg_getUTCFullYear_f3b3950a0ccb9165: ht,
            __wbg_new_7913666fe5070684: Wt,
            __wbg_now_a9b7df1cbee90986: Xt,
            __wbg_new_0_4d657201ced14de3: zt,
            __wbg_getTime_da7c55f52b71e8c6: mt,
            __wbg_new_682678e2f47e32bc: Lt,
            __wbg_from_0dbf29f09e7fb200: pt,
            __wbg_isArray_c3109d14ffc06469: Tt,
            __wbg_new_5e360d2ff7b9e1c3: $t,
            __wbg_isSafeInteger_4fc213d1989d6d2a: Mt,
            __wbg_new_aa8d0fa9762c29bd: Qt,
            __wbg_entries_e0b73aa8571ddb56: wt,
            __wbg_iterator_013bc09ec998c2a7: Ot,
            __wbg_get_1affdbdd5573b16a: It,
            __wbg_set_022bee52d0b05b19: ee,
            __wbg_next_7646edaa39458ef7: Pt,
            __wbg___wbindgen_in_a5d8b22e52b24dd1: X,
            __wbg___wbindgen_throw_6b64449b9b9ed33c: dt,
            __wbg___wbindgen_is_null_52ff4ec04186736f: tt,
            __wbg___wbindgen_jsval_eq_d3465d8a07697228: rt,
            __wbg_Error_960c155d3d49e4c2: W,
            __wbg___wbindgen_is_bigint_ec25c7f91b4d9e93: G,
            __wbg___wbindgen_is_object_63322ec0cd6ea4ef: et,
            __wbg___wbindgen_is_string_6df3bf7ef1164ed3: _t,
            __wbg___wbindgen_number_get_c7f42aed0525c451: it,
            __wbg___wbindgen_string_get_7ed5322991caaec5: at,
            __wbg___wbindgen_boolean_get_6ea149f0a8dcc5ff: Y,
            __wbg___wbindgen_is_function_3baa9db1a987f47d: Z,
            __wbg___wbindgen_is_undefined_29a43b4d42920abd: nt,
            __wbg___wbindgen_jsval_loose_eq_cac3565e89b4134c: ot,
            __wbg___wbindgen_bigint_get_as_i64_3d3aba5d616c6a51: K,
            __wbg___wbindgen_debug_string_ab4b34d23d6778bd: P,
            __wbindgen_cast_0000000000000001: be,
            __wbindgen_cast_0000000000000002: ue,
            __wbindgen_cast_0000000000000003: we,
            __wbindgen_cast_0000000000000004: fe,
            __wbindgen_cast_0000000000000005: pe
        }
    }, L), { memory: Fe, __wbg_document_free: qe, __wbg_quill_free: Ee, __wbg_quillmark_free: Se, __wbg_rendersession_free: Re, document_blueprintInstruction: je, document_cardCount: Ae, document_cards: Te, document_clone: Me, document_currentSchemaVersion: Oe, document_equals: Ue, document_formatDiagnostic: De, document_formatRules: Ne, document_fromJson: ze, document_fromMarkdown: Be, document_insertCard: Ve, document_main: Je, document_makeCard: $e, document_moveCard: Le, document_pushCard: We, document_quillRef: Qe, document_quillRefHint: He, document_removeCard: Ke, document_removeCardExt: Ye, document_removeCardExtNamespace: Pe, document_removeCardField: Xe, document_removeExt: Ge, document_removeExtNamespace: Ze, document_removeField: t_, document_replaceBody: e_, document_schemaVersionOf: __, document_setCardExt: n_, document_setCardExtNamespace: r_, document_setCardKind: o_, document_setExt: i_, document_setExtNamespace: a_, document_setField: d_, document_setFill: c_, document_setQuillRef: s_, document_toJson: g_, document_toMarkdown: b_, document_tryFromJson: u_, document_updateCardBody: w_, document_updateCardField: f_, document_warnings: p_, init: l_, quill_backendId: m_, quill_blueprint: y_, quill_fromTree: h_, quill_metadata: v_, quill_schema: I_, quill_seedCard: k_, quill_seedDocument: x_, quill_seedMain: C_, quill_toTree: F_, quill_validate: q_, quillmark_new: E_, quillmark_open: S_, quillmark_render: R_, quillmark_supportedFormats: j_, quillmark_supportsCanvas: A_, rendersession_backendId: T_, rendersession_pageCount: M_, rendersession_pageSize: O_, rendersession_paint: U_, rendersession_render: D_, rendersession_supportsCanvas: N_, rendersession_warnings: z_, __wbindgen_export: B_, __wbindgen_export2: V_, __wbindgen_export3: J_, __wbindgen_export4: $_, __wbindgen_add_to_stack_pointer: L_, __wbindgen_start: B } = Ce, W_ = Object.freeze(Object.defineProperty({
        __proto__: null,
        __wbg_document_free: qe,
        __wbg_quill_free: Ee,
        __wbg_quillmark_free: Se,
        __wbg_rendersession_free: Re,
        __wbindgen_add_to_stack_pointer: L_,
        __wbindgen_export: B_,
        __wbindgen_export2: V_,
        __wbindgen_export3: J_,
        __wbindgen_export4: $_,
        __wbindgen_start: B,
        document_blueprintInstruction: je,
        document_cardCount: Ae,
        document_cards: Te,
        document_clone: Me,
        document_currentSchemaVersion: Oe,
        document_equals: Ue,
        document_formatDiagnostic: De,
        document_formatRules: Ne,
        document_fromJson: ze,
        document_fromMarkdown: Be,
        document_insertCard: Ve,
        document_main: Je,
        document_makeCard: $e,
        document_moveCard: Le,
        document_pushCard: We,
        document_quillRef: Qe,
        document_quillRefHint: He,
        document_removeCard: Ke,
        document_removeCardExt: Ye,
        document_removeCardExtNamespace: Pe,
        document_removeCardField: Xe,
        document_removeExt: Ge,
        document_removeExtNamespace: Ze,
        document_removeField: t_,
        document_replaceBody: e_,
        document_schemaVersionOf: __,
        document_setCardExt: n_,
        document_setCardExtNamespace: r_,
        document_setCardKind: o_,
        document_setExt: i_,
        document_setExtNamespace: a_,
        document_setField: d_,
        document_setFill: c_,
        document_setQuillRef: s_,
        document_toJson: g_,
        document_toMarkdown: b_,
        document_tryFromJson: u_,
        document_updateCardBody: w_,
        document_updateCardField: f_,
        document_warnings: p_,
        init: l_,
        memory: Fe,
        quill_backendId: m_,
        quill_blueprint: y_,
        quill_fromTree: h_,
        quill_metadata: v_,
        quill_schema: I_,
        quill_seedCard: k_,
        quill_seedDocument: x_,
        quill_seedMain: C_,
        quill_toTree: F_,
        quill_validate: q_,
        quillmark_new: E_,
        quillmark_open: S_,
        quillmark_render: R_,
        quillmark_supportedFormats: j_,
        quillmark_supportsCanvas: A_,
        rendersession_backendId: T_,
        rendersession_pageCount: M_,
        rendersession_pageSize: O_,
        rendersession_paint: U_,
        rendersession_render: D_,
        rendersession_supportsCanvas: N_,
        rendersession_warnings: z_
    }, Symbol.toStringTag, {
        value: "Module"
    }));
    xe(W_);
    B();
});
export { l as Document, h as Quill, O as Quillmark, q as RenderSession, H_ as init, __tla };
