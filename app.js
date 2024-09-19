let web3;
let provider;
let signer;
let userRegistrationContract;
const contractAddress = '0x15ACD9DB7905EacadccbB590D3db5170b49b86C7'; // Replace with your actual contract address

async function fetchContractABI() {
    const response = await fetch('ABI.json'); // Adjust the path to your ABI file
    const data = await response.json();
    return data.abi; // Return only the ABI array
}

async function initializeWeb3() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const contractABI = await fetchContractABI();
        userRegistrationContract = new ethers.Contract(contractAddress, contractABI, signer);
    } else {
        alert('Please install MetaMask to use this application.');
    }
}

async function addStudent(firstName, lastName, rollNumber, cgpa, courses) {
    try {
        const tx = await userRegistrationContract.addStudent(firstName, lastName, rollNumber, cgpa, courses);
        await tx.wait(); // Wait for the transaction to be mined
        alert("Student added successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error adding student. See console for details.");
    }
}

async function updateCGPA(rollNumber, newCgpa) {
    try {
        const tx = await userRegistrationContract.updateCGPA(rollNumber, newCgpa);
        await tx.wait(); // Wait for the transaction to be mined
        alert("CGPA updated successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("Error updating CGPA. See console for details.");
    }
}

async function getStudent(rollNumber) {
    try {
        const student = await userRegistrationContract.getStudent(rollNumber);
        return student;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function loadAllStudents() {
    try {
        const rollNumbers = await userRegistrationContract.getAllStudentRollNumbers();
        const studentsList = document.getElementById('students-list');
        studentsList.innerHTML = '';

        for (const rollNumber of rollNumbers) {
            const student = await userRegistrationContract.getStudent(rollNumber);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.rollNumber}</td>
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td><button onclick="viewStudentDetails(${student.rollNumber})">View</button></td>
            `;
            studentsList.appendChild(row);
        }
    } catch (error) {
        console.error("Error loading students:", error);
        alert("Error loading students. See console for details.");
    }
}

async function viewStudentDetails(rollNumber) {
    try {
        const student = await userRegistrationContract.getStudent(rollNumber);
        document.getElementById("student-details").innerHTML = `
            <p>First Name: ${student.firstName}</p>
            <p>Last Name: ${student.lastName}</p>
            <p>Roll Number: ${student.rollNumber}</p>
            <p>CGPA: ${student.cgpa}</p>
            <p>Courses: ${student.courses.join(', ')}</p>
        `;
    } catch (error) {
        console.error("Error:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await initializeWeb3();

    const registerForm = document.getElementById("add-student-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const firstName = document.getElementById("first-name").value;
            const lastName = document.getElementById("last-name").value;
            const rollNumber = document.getElementById("roll-number").value;
            const cgpa = document.getElementById("cgpa").value;
            const courses = document.getElementById("courses").value.split(',');
            addStudent(firstName, lastName, rollNumber, cgpa, courses);
        });
    }

    const updateForm = document.getElementById("update-cgpa-form");
    if (updateForm) {
        updateForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const rollNumber = document.getElementById("update-roll-number").value;
            const newCgpa = document.getElementById("new-cgpa").value;
            updateCGPA(rollNumber, newCgpa);
        });
    }

    const viewForm = document.getElementById("view-student-form");
    if (viewForm) {
        viewForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const rollNumber = document.getElementById("view-roll-number").value;
            const student = await getStudent(rollNumber);
            if (student) {
                document.getElementById("student-details").innerHTML = `
                    <p>First Name: ${student.firstName}</p>
                    <p>Last Name: ${student.lastName}</p>
                    <p>Roll Number: ${student.rollNumber}</p>
                    <p>CGPA: ${student.cgpa}</p>
                    <p>Courses: ${student.courses.join(', ')}</p>
                `;
            }
        });
    }

    const viewAllButton = document.getElementById("view-all-students-btn");
    if (viewAllButton) {
        viewAllButton.addEventListener("click", loadAllStudents);
    }
});
