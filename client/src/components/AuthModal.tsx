import React, { useState } from "react";

interface AuthModalProps {
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
    const [tab, setTab] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setMessage("Please fill in all fields.");
            return;
        }
        setMessage(
            tab === "login"
                ? "Login is not yet connected to a backend."
                : "Sign-up is not yet connected to a backend."
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-[360px] max-w-[92vw] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-600 mb-6">
                    {(["login", "signup"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => { setTab(t); setMessage(""); }}
                            className={`flex-1 pb-2 title-font text-sm transition-colors ${
                                tab === t
                                    ? "text-sky-500 font-bold border-b-2 border-sky-500"
                                    : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                            {t === "login" ? "Log In" : "Sign Up"}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-3 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                        type="submit"
                        className="mt-1 py-2.5 rounded-lg bg-sky-500 text-white font-bold text-sm title-font hover:bg-sky-600 transition-colors"
                    >
                        {tab === "login" ? "Log In" : "Create Account"}
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-center text-sm text-amber-500">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AuthModal;