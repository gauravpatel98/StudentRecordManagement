import React, { useState } from "react";

const StudentForm = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [marks, setMarks] = useState(["", "", "", "", ""]);
  const [students, setStudents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState("");
  const [result, setResult] = useState(null);
  const [searchByName, setsearchByName] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const handleMarksChange = (value, index) => {
    const updated = [...marks];
    updated[index] = value;
    setMarks(updated);

  
    const allValid = updated.every(mark => {
      const num = Number(mark);
      return num >= 1 && num <= 100;
    });
  
    setResult(allValid ? calculateResult(updated.map(Number)) : null);
  };
  
// code for calculating result
  const calculateResult = (marks) => {
    const total = marks.reduce((a, b) => a + b, 0);
    const percentage = (total / 500) * 100;
    let division = "Fail";
    if (percentage >= 60) division = "First Division";
    else if (percentage >= 45) division = "Second Division";
    else if (percentage >= 33) division = "Third Division";
    return {
      percentage: percentage.toFixed(2),
      division,
    };
  };

// code for different colors of the division 

  const getDivisionColor = (division) => {
    switch (division) {
      case "First Division":
        return "bg-success text-white px-2 py-1 rounded-pill";
      case "Second Division":
        return "bg-warning text-dark px-2 py-1 rounded-pill";
      case "Third Division":
        return "bg-secondary text-white px-2 py-1 rounded-pill";
      default:
        return "bg-danger text-white px-2 py-1 rounded-pill";
    }
  };

  const handleSubmit = () => {
    setErrors("");

    if (!/^[A-Za-z ]+$/.test(name)) {
      setErrors("Name should only contain letters.");
      return;
    }
    const numAge = Number(age);
    if (!Number.isInteger(numAge) || numAge <= 0) {
      setErrors("Age should be a positive integer.");
      return;
    }



    const numMarks = marks.map(Number);
    if (numMarks.some((mark) => isNaN(mark) || mark < 1 || mark > 100)) {
      setErrors("All marks must be between 1 and 100.");
      return;
    }

    const result = calculateResult(numMarks);
    const newStudent = {
      name,
      age: numAge,
      marks: numMarks,
      percentage: result.percentage,
      division: result.division,
    };

    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = newStudent;
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([...students, newStudent]);
    }

    setName("");
    setAge("");
    setMarks(["", "", "", "", ""]);
    setResult(null);
  };

  const handleEdit = (index) => {
    const student = students[index];
    setName(student.name);
    setAge(student.age);
    setMarks(student.marks.map(String));
    setEditIndex(index);
    setResult(calculateResult(student.marks));
  };

  const handleDelete = (index) => {
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
  };

  // code for searching the student record by name

  const filteredStudents = students.filter((student) => {
    const matchName = student.name.toLowerCase().includes(searchByName.toLowerCase());
    const matchDivision = selectedDivision === "" || student.division === selectedDivision;
    return matchName && matchDivision;
  });

  return (
    <div className="py-4" style={{ backgroundColor: "#dee2e6", minHeight: "100vh" }}>
      <h2 className="text-center mb-4">🎓 Student Record Management</h2>

      <div className="container d-flex">
        <div className="card p-4 me-3" style={{ width: "350px" }}>
          <h4 className="mb-3 text-center">Enter Student Record</h4>
          {errors && <div className="alert alert-danger">{errors}</div>}

          <input
            className="form-control mb-2"
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="form-control mb-2"
            type="number"
            placeholder="Student Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          {marks.map((mark, idx) => (
            <input
              key={idx}
              className="form-control mb-2"
              type="number"
              placeholder={`Marks ${idx + 1} (0-100)`}
              value={mark}
              onChange={(e) => handleMarksChange(e.target.value, idx)}
            />
          ))}

          {result && (
            <div className={`p-2 rounded text-center mb-2 ${getDivisionColor(result.division)}`}>
              <strong>Percentage:</strong> {result.percentage}% <br />
              <strong>Division:</strong> {result.division}
            </div>
          )}

          <button className="btn btn-success mb-2" onClick={handleSubmit}>
            {editIndex !== null ? "Update" : "Submit"}
          </button>
          <button
            className="btn btn-dark"
            onClick={() => {
              setName("");
              setAge("");
              setMarks(["", "", "", "", ""]);
              setEditIndex(null);
              setErrors("");
              setResult(null);
            }}
          >
            Clear
          </button>
        </div>

        <div className="border bg-dark text-white p-3 overflow-auto" style={{ width: "100%", height: "500px" }}>
          <h5 className="text-center mb-3">📋 Student Records</h5>



          <div className="d-flex gap-3 mb-3">
            <input
              type="text"
              className="form-control form-control-md h2"
              placeholder="🔍 Enter the name of the student"
              value={searchByName}
              onChange={(e) => setsearchByName(e.target.value)}
              style={{ maxWidth: "500px" }}
            />
            <select
              className="form-select form-select-m h2"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              style={{ maxWidth: "500px" }}
            >
              <option value="">All Divisions</option>
              <option value="First Division">First Division</option>
              <option value="Second Division">Second Division</option>
              <option value="Third Division">Third Division</option>
              <option value="Fail">Fail</option>
            </select>
          </div>

          {filteredStudents.length === 0 ? (
            <p className="text-center">No records found.</p>
          ) : (
            <table className="table table-bordered table-sm table-dark">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>m1</th>
                  <th>m2</th>
                  <th>m3</th>
                  <th>m4</th>
                  <th>m5</th>
                  <th>Percentage</th>
                  <th>Division</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.name}</td>
                    <td>{s.age}</td>
                    {s.marks.map((m, i) => (
                      <td key={i}>{m}</td>
                    ))}
                    <td>{s.percentage}</td>
                    <td>
                      <span className={getDivisionColor(s.division)}>{s.division}</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-light" onClick={() => handleEdit(idx)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(idx)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
