import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const EmailMe: React.FC = () => {
    const [emailSent, setEmailSent] = useState(false);

    const sendEmail = (emailFormEvent: React.FormEvent<HTMLFormElement>) => {
        emailFormEvent.preventDefault();
        emailjs.sendForm(
            'service_o31wbxh',
            'template_profile_site',
            emailFormEvent.currentTarget,
            '3WOn7ZaKmoc_hnHYt'
        )
        .then(
            () => {
                setEmailSent(true);
            },
            (error: Error) => {
                console.log("Email send failure:", error.message);
            }
        );
    };

    return (
        <section>
            Email me section.
        </section>
    );
}

export default EmailMe;