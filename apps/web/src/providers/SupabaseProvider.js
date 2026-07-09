"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSupabase = exports.SupabaseProvider = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const react_1 = require("react");
const SupabaseContext = (0, react_1.createContext)(undefined);
const SupabaseProvider = ({ children }) => {
    const [supabase] = (0, react_1.useState)(() => (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
    const [session, setSession] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        // Check initial session
        const getSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error)
                console.error('Supabase session error', error);
            setSession(data.session);
            setLoading(false);
        };
        getSession();
        // Listen for auth changes (sign‑in, sign‑out)
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [supabase]);
    return (<SupabaseContext.Provider value={{ supabase, session, loading }}>
      {children}
    </SupabaseContext.Provider>);
};
exports.SupabaseProvider = SupabaseProvider;
const useSupabase = () => {
    const context = (0, react_1.useContext)(SupabaseContext);
    if (!context)
        throw new Error('useSupabase must be used within SupabaseProvider');
    return context;
};
exports.useSupabase = useSupabase;
