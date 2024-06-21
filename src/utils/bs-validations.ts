import { useEffect } from 'react';

const useBootstrapValidation = () => {
    useEffect(() => {
        const handleValidation = () => {
            'use strict';

            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            const forms = document.querySelectorAll('.needs-validation');

            // Loop over them and prevent submission
            Array.from(forms).forEach((form) => {
                const htmlForm = form as HTMLFormElement; // Type casting to HTMLFormElement
                htmlForm.addEventListener('submit', (event) => {
                    if (!htmlForm.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    htmlForm.classList.add('was-validated');
                }, false);
            });
        };

        handleValidation();
    }, []);
};

export default useBootstrapValidation;
