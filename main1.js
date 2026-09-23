// =========================================================
// MAIN.JS - CÁCH 1 (PHIÊN BẢN TỐI ƯU HÓA)
// GET  -> Web Service của thầy
// CRUD -> JavaScript + DOM trên RAM của trang
// =========================================================

// =========================================================
// 1. CẤU HÌNH GET API
// =========================================================
const GET_STUDENTS_API = facultyId => `http://localhost:8080/api/faculties/${facultyId}/students`;

// =========================================================
// 2. CẤU HÌNH CÁC CỘT CỦA TABLE 
// [KHI ĐI THI]: Thêm khai báo cột mới vào đây để tự động vẽ table
// =========================================================
const TABLE_COLUMNS = [
    { key: "id", title: "ID" },
    { key: "name", title: "Họ tên" },
    { key: "email", title: "Email" },
    { key: "phone", title: "Phone" },
    { key: "address", title: "Address" }
];

// =========================================================
// 3. LẤY CÁC THÀNH PHẦN HTML BẰNG DOM
// [KHI ĐI THI]: Nhớ khai báo thêm biến cho ô input mới
// =========================================================
const $ = id => document.getElementById(id);

const facultySelect = $("facultySelect"), btnLoad = $("btnLoad"), searchInput = $("searchInput"),
      btnSearch = $("btnSearch"), btnResetSearch = $("btnResetSearch"), studentId = $("studentId"),
      studentName = $("studentName"), studentEmail = $("studentEmail"), 
      studentPhone = $("studentPhone"), studentAddress = $("studentAddress"), // <-- Sửa lỗi: Bổ sung biến còn thiếu
      btnAdd = $("btnAdd"), btnUpdate = $("btnUpdate"), btnClear = $("btnClear"), 
      studentTableBody = $("studentTableBody"), message = $("message");

// =========================================================
// 4. BIẾN LƯU DỮ LIỆU
// =========================================================
let students = [];
let currentFacultyId = "";

// =========================================================
// 5. HIỂN THỊ THÔNG BÁO & 6. XÓA FORM
// =========================================================
const showMessage = text => message.textContent = text;
const clearForm = () => {
    // [KHI ĐI THI]: Cho thêm ô input mới = "" ở đây
    studentId.value = studentName.value = studentEmail.value = studentPhone.value = studentAddress.value = "";
    delete studentId.dataset.oldId; // Xóa id gốc dùng để sửa
};

// =========================================================
// 7. GỌI GET WEB SERVICE
// =========================================================
async function loadStudentsByFaculty() {
    const facultyId = facultySelect.value;
    if (!facultyId) return alert("Vui lòng chọn khoa!");

    currentFacultyId = facultyId;
    try {
        const response = await fetch(GET_STUDENTS_API(facultyId));
        if (!response.ok) throw new Error("GET lỗi HTTP: " + response.status);

        const data = await response.json();
        students = Array.isArray(data) ? data : [];
        
        renderTable(students);
        showMessage(`Đã tải ${students.length} sinh viên.`);
    } catch (error) {
        console.error("Lỗi GET:", error);
        showMessage("Không gọi được Web Service GET.");
    }
}

// =========================================================
// 8. DOM -> TABLE (Tự động chạy theo TABLE_COLUMNS)
// =========================================================
function renderTable(data) {
    studentTableBody.innerHTML = "";
    data.forEach(student => {
        const row = document.createElement("tr");
        
        // Tự động map dữ liệu
        row.innerHTML = TABLE_COLUMNS.map(col => `<td>${student[col.key] ?? ""}</td>`).join("");

        // Cột thao tác
        const tdAction = document.createElement("td");
        tdAction.innerHTML = `<button onclick='editStudent(${JSON.stringify(student)})'>Sửa</button> 
                              <button onclick='deleteStudent(${student.id})'>Xóa</button>`;
        row.appendChild(tdAction);
        studentTableBody.appendChild(row);
    });
}

// =========================================================
// 9. LẤY DỮ LIỆU FORM
// [KHI ĐI THI]: Thêm trường lấy dữ liệu cho thuộc tính mới
// =========================================================
const getStudentFromForm = () => ({
    id: studentId.value ? Number(studentId.value) : null,
    name: studentName.value.trim(),
    email: studentEmail.value.trim(),
    phone: studentPhone.value.trim(),
    address: studentAddress.value.trim()
});

// =========================================================
// 10. THÊM - JAVASCRIPT RAM (Đã sửa lỗi không lấy ID)
// =========================================================
function addStudent() {
    if (!currentFacultyId) return alert("Vui lòng chọn khoa trước!");
    
    const newStudent = getStudentFromForm();
    
    if (!newStudent.id || !newStudent.name) return alert("Vui lòng nhập ID và Tên!");
    if (students.some(s => s.id === newStudent.id)) return alert("ID sinh viên đã tồn tại!");

    students.push(newStudent); // Đẩy nguyên object vào thay vì gõ lẻ tẻ
    
    renderTable(students);
    clearForm();
    showMessage("Đã thêm sinh viên.");
}

// =========================================================
// 11. CHỌN SINH VIÊN ĐỂ SỬA
// =========================================================
function editStudent(student) {
    // Lưu lại ID cũ vào dataset để tí nữa tìm kiếm (fix lỗi đổi ID)
    studentId.dataset.oldId = student.id; 

    studentId.value = student.id ?? "";
    studentName.value = student.name ?? "";
    studentEmail.value = student.email ?? "";
    studentPhone.value = student.phone ?? "";
    studentAddress.value = student.address ?? "";
    
    showMessage("Đã chọn sinh viên để sửa.");
}

// =========================================================
// 12. SỬA - JAVASCRIPT RAM (Đã sửa lỗi đổi ID không lưu được)
// =========================================================
function updateStudent() {
    // Lấy oldId ra để tìm đúng đối tượng cũ đang nằm ở đâu trong mảng
    const oldId = Number(studentId.dataset.oldId);
    if (!oldId) return alert("Hãy nhấn nút Sửa ở sinh viên cần sửa!");

    const updatedStudent = getStudentFromForm();
    if (!updatedStudent.id || !updatedStudent.name) return alert("Vui lòng nhập ID và Tên!");

    const index = students.findIndex(item => Number(item.id) === oldId);
    if (index === -1) return alert("Không tìm thấy sinh viên!");

    // Nếu người dùng đổi ID sang 1 ID mới, phải ktra ID mới có bị trùng sinh viên khác ko
    if (students.some((s, i) => s.id === updatedStudent.id && i !== index)) {
        return alert("ID mới đã bị trùng với một sinh viên khác!");
    }

    students[index] = updatedStudent; // Ghi đè toàn bộ

    renderTable(students);
    clearForm();
    showMessage("Đã sửa sinh viên.");
}

// =========================================================
// 13. XÓA - JAVASCRIPT RAM
// =========================================================
function deleteStudent(id) {
    if (!confirm(`Bạn có chắc muốn xóa sinh viên ID = ${id}?`)) return;

    students = students.filter(student => Number(student.id) !== Number(id)); // Viết gọn bằng filter
    
    renderTable(students);
    showMessage("Đã xóa sinh viên.");
}

// =========================================================
// 14. GẮN SỰ KIỆN 
// =========================================================
facultySelect.onchange = () => facultySelect.value && loadStudentsByFaculty();
btnLoad.onclick = loadStudentsByFaculty;
btnAdd.onclick = addStudent;
btnUpdate.onclick = updateStudent;
btnClear.onclick = clearForm;
btnSearch.onclick = searchStudents;
searchInput.onkeyup = (e) => e.key === "Enter" && searchStudents();
btnResetSearch.onclick = () => { searchInput.value = ""; renderTable(students); };
