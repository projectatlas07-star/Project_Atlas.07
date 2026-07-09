"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const react_1 = require("react");
const SupabaseProvider_1 = require("@/providers/SupabaseProvider");
const Button_1 = require("@project-atlas/ui/src/components/Button");
const Input_1 = require("@project-atlas/ui/src/components/Input");
const navigation_1 = require("next/navigation");
function LoginPage() {
    const { supabase } = (0, SupabaseProvider_1.useSupabase)();
    const router = (0, navigation_1.useRouter)();
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error)
            setError(error.message);
        else
            router.push('/');
        setLoading(false);
    };
    const handleMagicLink = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error)
            setError(error.message);
        else
            setError('Magic link sent to your email');
        setLoading(false);
    };
    return (<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 rounded bg-white p-8 shadow dark:bg-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Sign In</h2>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Input_1.Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        <Input_1.Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        <Button_1.Button type="submit" disabled={loading}>Sign In</Button_1.Button>
        <div className="flex justify-between text-sm">
          <button type="button" className="text-blue-600 hover:underline" onClick={handleMagicLink} disabled={loading}>Magic Link</button>
          <a href="/auth/reset-password" className="text-blue-600 hover:underline">Forgot password?</a>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account? <a href="/auth/signup" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </form>
    </div>);
}
