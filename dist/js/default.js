document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://mocki.io/v1/84954ef5-462f-462a-b692-6531e75c220d";
    const SUBMIT_URL = "https://0211560d-577a-407d-94ab-dc0383c943e0.mock.pstmn.io/submitform";

    const form = document.getElementById("dynamic-form");

    // Fetch questions from API
    async function fetchQuestions() {
        try {
            const response = await fetch(API_URL);
            const questions = await response.json();
            renderForm(questions);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    }

    // Render form based on fetched questions
    function renderForm(questions) {
        questions.forEach((question) => {
            const fieldContainer = document.createElement("div");

            if (question.type === "radio") {
                // Fieldset for radio buttons
                const fieldset = document.createElement("fieldset");
                const legend = document.createElement("legend");
                legend.textContent = question.legend;
                fieldset.appendChild(legend);

                question.options.forEach((option) => {
                    const label = document.createElement("label");
                    const input = document.createElement("input");
                    input.type = "radio";
                    input.name = question.name;
                    input.value = option.value;
                    input.required = question.required ? true : false;
                    input.id = option.id;
                    label.htmlFor = option.id;
                    label.textContent = option.label;

                    fieldset.appendChild(input);
                    fieldset.appendChild(label);
                });

                fieldContainer.appendChild(fieldset);
            } else {
                // Input field
                const label = document.createElement("label");
                label.textContent = question.label;
                label.htmlFor = question.id;

                const input = document.createElement("input");
                input.type = question.type;
                input.name = question.name;
                input.id = question.id;
                input.required = question.required ? true : false;

                if (question.pattern) {
                    input.pattern = question.pattern;
                }

                // Add ARIA attributes for accessibility
                input.setAttribute("aria-required", question.required ? "true" : "false");

                // Error message span
                const errorMessage = document.createElement("span");
                errorMessage.className = "error-message";
                errorMessage.id = ${question.id}-error;
                errorMessage.textContent = Invalid ${question.label};

                // Add blur validation
                input.addEventListener("blur", () => validateField(input, errorMessage));

                fieldContainer.appendChild(label);
                fieldContainer.appendChild(input);
                fieldContainer.appendChild(errorMessage);
            }

            form.insertBefore(fieldContainer, form.lastElementChild);
        });
    }

    // Field validation
    function validateField(input, errorMessage) {
        if (!input.validity.valid) {
            errorMessage.style.display = "block";
            input.setAttribute("aria-invalid", "true");
        } else {
            errorMessage.style.display = "none";
            input.removeAttribute("aria-invalid");
        }
    }

    // Form submission handler
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Validate all fields before submitting
        const inputs = form.querySelectorAll("input");
        let isValid = true;

        inputs.forEach((input) => {
            const errorMessage = document.getElementById(${input.id}-error);
            if (!input.validity.valid) {
                validateField(input, errorMessage);
                isValid = false;
            }
        });

        if (!isValid) return;

        // Prepare form data
        const formData = Array.from(inputs).map((input) => ({
            name: input.name,
            value: input.type === "radio" ? (input.checked ? input.value : "") : input.value,
        })).filter(item => item.value !== ""); // Remove empty values

        try {
            const response = await fetch(SUBMIT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.status === 200) {
                alert("Form submitted successfully!");
                form.reset();
            } else {
                throw new Error("Form submission failed.");
            }
        } catch (error) {
            alert("Error submitting form. Please try again.");
            console.error(error);
        }
    });

    // Fetch and render questions
    fetchQuestions();
});