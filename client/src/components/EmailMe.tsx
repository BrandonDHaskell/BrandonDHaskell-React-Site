import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const EmailMe: React.FC = () => {
    const [emailSent, setEmailSent] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const sendEmail = (emailFormEvent: React.FormEvent<HTMLFormElement>) => {
        emailFormEvent.preventDefault();
        setIsSending(true);
        emailjs.sendForm(
            'service_o31wbxh',
            'template_profile_site',
            emailFormEvent.currentTarget,
            '3WOn7ZaKmoc_hnHYt'
        )
        .then(
            () => {
                setIsSending(false);
                setEmailSent(true);
            },
            (error: Error) => {
                console.log("Email send failure:", error.message);
            }
        );
    };

    return (
        <section id="connect-with-me" className="column justify-center">
            <h1 
            className="text-4xl font-bold text-center py-8" 
            style={{ fontFamily: 'JetBrains Mono, sans-serif' }}
            >EMAIL ME</h1>
            <p className="pt-2 pb-8 px-6 max-w-[800px] mx-auto">I believe in the transformative power of connection and I'm always open to sharing insights, collaboration, and exploring the vast potential of technology over a friendly cup of coffee or tea. Feel free to reachout!</p>
            {emailSent ? (
                <div>
                    <p>Email sent!</p>
                    <p>Feel free to connect with my on other social platforms:</p>
                    <p><a href="https://linkedin.com/in/BrandonDHaskell">in/BrandonDHaskell</a></p>
                    <p><a href="https://x.com/BrandonDHaskell">@BrandonDHaskell</a></p>
                </div>
            ) : (
                <>
                    {isSending ? (
                        <div className="sending-email">Sending email...</div>
                    ) : (
                    <form onSubmit={sendEmail} className="space-y-4">
                        <div className="flex justify-center outline-sky-500">
                            <div className="text-sky-500 px-2">
                                <label htmlFor="name">Name</label>
                            </div>
                            <div>
                                <input type="text" id="name" name="name" required className="border-2 rounded border-slate-300 text-sky-500 px-2 m-2" />
                            </div>
                        </div>
                        <div className="flex justify-center outline-sky-500">
                            <div className="text-sky-500 px-2">
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="text-sky-500 px-2"> 
                                <input type="email" id="email" name="email" required className="border-2 rounded border-slate-300 text-sky-500 px-2 m-2" />
                            </div>
                        </div>
                        <div className="flex justify-center outline-sky-500">
                            <div className="text-sky-500 px-2">
                                <label htmlFor="message">Message</label>
                            </div>
                            <div className="text-sky-500 px-2">
                                <textarea id="message" name="message" rows={5} required className="border-2 rounded border-slate-300 text-sky-500 px-2 m-2" />
                            </div>
                        </div>
                        <div className="flex justify-center outline-sky-500">
                            <div className="text-sky-500 px-2 pb-12">
                                <button type="submit" className="m-2 px-12 py-2 font-semibold text-sm bg-white text-slate-700 border border-slate-300 rounded-md shadow-sm outline outline-2 outline-offset-0 outline-sky-500 dark:bg-slate-700 dark:text-slate-200 dark:border-transparent">Send</button>
                            </div>
                        </div>
                    </form>
                    )}
                </>
            )}
        </section>
    );
}

export default EmailMe;