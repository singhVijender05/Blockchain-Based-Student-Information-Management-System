// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudentInformationManagement {
    // Structure to hold student information
    struct Student {
        string firstName;
        string lastName;
        uint256 rollNumber;
        uint256 cgpa;
        string[] courses;
    }

    // Mapping from roll number to Student
    mapping(uint256 => Student) public students;
    
    // List of roll numbers to keep track of all students
    uint256[] public studentRollNumbers;

    // Event emitted when a new student is added
    event StudentAdded(uint256 rollNumber, string firstName, string lastName);
    
    // Event emitted when a student's CGPA is updated
    event CGPAUpdated(uint256 rollNumber, uint256 newCgpa);

    // Event emitted when new courses are registered for a student
    event CoursesRegistered(uint256 rollNumber, string[] newCourses);

    // Function to add a new student
    function addStudent(
        string memory _firstName,
        string memory _lastName,
        uint256 _rollNumber,
        uint256 _cgpa,
        string[] memory _courses
    ) public {
        // Ensure the roll number is unique
        require(students[_rollNumber].rollNumber != _rollNumber, "Student with this roll number already exists");

        // Add the student
        students[_rollNumber] = Student({
            firstName: _firstName,
            lastName: _lastName,
            rollNumber: _rollNumber,
            cgpa: _cgpa,
            courses: _courses
        });

        // Add roll number to the list
        studentRollNumbers.push(_rollNumber);

        // Emit event
        emit StudentAdded(_rollNumber, _firstName, _lastName);
    }

    // Function to get student information by roll number
    function getStudent(uint256 _rollNumber) public view returns (
        string memory firstName,
        string memory lastName,
        uint256 rollNumber,
        uint256 cgpa,
        string[] memory courses
    ) {
        Student memory student = students[_rollNumber];
        return (student.firstName, student.lastName, student.rollNumber, student.cgpa, student.courses);
    }

    // Function to update a student's CGPA
    function updateCGPA(uint256 _rollNumber, uint256 _newCgpa) public {
        require(students[_rollNumber].rollNumber != 0, "Student does not exist");
        students[_rollNumber].cgpa = _newCgpa;

        // Emit event
        emit CGPAUpdated(_rollNumber, _newCgpa);
    }

    // Function to register courses for a student
    function registerCourses(uint256 _rollNumber, string[] memory _newCourses) public {
        require(students[_rollNumber].rollNumber != 0, "Student does not exist");
        for (uint256 i = 0; i < _newCourses.length; i++) {
            students[_rollNumber].courses.push(_newCourses[i]);
        }

        // Emit event
        emit CoursesRegistered(_rollNumber, _newCourses);
    }

    // Function to get the total number of students
    function getTotalStudents() public view returns (uint256) {
        return studentRollNumbers.length;
    }

    // Function to get all student roll numbers
    function getAllStudentRollNumbers() public view returns (uint256[] memory) {
        return studentRollNumbers;
    }
}
