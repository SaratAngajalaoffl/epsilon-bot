import React, { useState } from "react";

function AddNumbersEnable() {
    // Initialize state variables to store the input values and the result
    const [num1, setNum1] = useState("");
    const [num2, setNum2] = useState("");
    const [result, setResult] = useState("");

    // ravi
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    // Function to handle the addition
    const addNumbers = () => {
        const number1 = parseFloat(num1);
        const number2 = parseFloat(num2);

        if (!isNaN(number1) && !isNaN(number2)) {
            const sum = number1 + number2;
            setResult(`Result: ${sum}`);
        } else {
            setResult("Invalid input. Please enter valid numbers.");
        }
    };

    useEffect(() => {
        setIsButtonDisabled(num1.trim() === "" || num2.trim() === "");
    }, [num1, num2]);

    return (
        <div>
            <h1>Add Two Numbers</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter number 1"
                    value={num1}
                    onChange={(e) => {
                        setNum1(e.target.value);
                    }}
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Enter number 2"
                    value={num2}
                    onChange={(e) => {
                        setNum2(e.target.value);
                    }}
                />
            </div>
            <button onClick={addNumbers} disabled={isButtonDisabled}>
                Add
            </button>
            <div>{result}</div>
        </div>
    );
}

export default AddNumbersEnable;
