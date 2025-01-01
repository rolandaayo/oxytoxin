(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_app_b8a604._.js", {

"[project]/src/app/context/CartContext.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
__turbopack_esm__({
    "CartProvider": (()=>CartProvider),
    "useCart": (()=>useCart)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_refresh__.signature(), _s1 = __turbopack_refresh__.signature();
'use client';
;
;
const CartContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
function CartProvider({ children }) {
    _s();
    const [cartItems, setCartItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showCart, setShowCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            try {
                const savedCart = localStorage.getItem('cartItems');
                if (savedCart) {
                    setCartItems(JSON.parse(savedCart));
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        }
    }["CartProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CartProvider.useEffect": ()=>{
            if (cartItems.length > 0) {
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        }
    }["CartProvider.useEffect"], [
        cartItems
    ]);
    const addToCart = (item)=>{
        setCartItems((prev)=>{
            const newItems = [
                ...prev,
                item
            ];
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem('cartItems', JSON.stringify(newItems));
            }
            return newItems;
        });
    };
    const removeFromCart = (itemId)=>{
        setCartItems((prev)=>{
            const newItems = prev.filter((item)=>item.id !== itemId);
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem('cartItems', JSON.stringify(newItems));
            }
            return newItems;
        });
    };
    const clearCart = ()=>{
        setCartItems([]);
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('cartItems');
        }
    };
    const totalAmount = cartItems.reduce((total, item)=>total + item.price * (item.quantity || 1), 0);
    const clearStoredData = (paymentReference)=>{
        // Create order data before clearing cart
        const orderData = {
            id: Date.now(),
            date: new Date().toISOString(),
            status: 'processing',
            items: cartItems,
            totalAmount: totalAmount,
            paymentRef: paymentReference
        };
        // Get existing orders and add new order
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = [
            ...existingOrders,
            orderData
        ];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        // Clear cart data
        clearCart();
        setShowCart(false);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Payment completed successfully!", {
            duration: 3000
        });
    };
    const initializePayment = async ()=>{
        setLoading(true);
        try {
            const handler = PaystackPop.setup({
                key: "pk_test_dc632dcb524653128c7ffcd7f3c74cd9c2704c79",
                email: "customer@email.com",
                amount: totalAmount * 100,
                currency: "NGN",
                ref: "" + Math.floor(Math.random() * 1000000000 + 1),
                callback: function(response) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(`Payment complete! Reference: ${response.reference}`, {
                        icon: "✅",
                        duration: 3000
                    });
                    clearStoredData(response.reference);
                },
                onClose: function() {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Transaction was not completed", {
                        icon: "❌",
                        duration: 3000
                    });
                }
            });
            handler.openIframe();
        } catch (error) {
            console.error("Payment initialization failed:", error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Payment initialization failed. Please try again.", {
                icon: "⚠️",
                duration: 3000
            });
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CartContext.Provider, {
        value: {
            cartItems,
            setCartItems,
            showCart,
            setShowCart,
            addToCart,
            removeFromCart,
            clearCart,
            totalAmount,
            loading,
            initializePayment
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/context/CartContext.js",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_s(CartProvider, "X6aSK9Vlq6bGVm4n9GPrmcb8DmU=");
_c = CartProvider;
function useCart() {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CartContext);
}
_s1(useCart, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_refresh__.register(_c, "CartProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/layout.js [app-rsc] (ecmascript, Next.js server component, client modules)": ((__turbopack_context__) => {

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, t: __turbopack_require_real__ } = __turbopack_context__;
{
}}),
}]);

//# sourceMappingURL=src_app_b8a604._.js.map