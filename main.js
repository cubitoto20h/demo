// =========================================================
// MAIN.JS - CÁCH 2: CRUD TRỰC TIẾP QUA API (GET, POST, PUT, DELETE)
// Tối ưu siêu ngắn gọn - Bổ sung chú thích đi thi
// =========================================================

// 1. CẤU HÌNH API
const GET_STUDENTS_API = facultyId => `http://localhost:8080/api/faculties/${facultyId}/students`;
const POST_STUDENT_API = "URL_POST_CUA_THAY";           // VD: http://localhost:8080/api/students
const PUT_STUDENT_API = id => `URL_PUT_CUA_THAY/${id}`;  // VD: http://localhost:8080/api/students/${id}
const DELETE_STUDENT_API = id => `URL_DELETE_CUA_THAY/${id}`;

// 2. CẤU HÌNH CỘT TABLE (Tự động vẽ bảng theo JSON)
// [KHI THI]: Thêm { key: "tenTruong", title: "Tiêu đề" } nếu đề bài thêm cột mới
const TABLE_COLUMNS = [
    { key: "id", title: "ID" },
    { key: "name", title: "Họ tên" },
    { key: "email", title: "Email" },
    { key: "phone", title: "Phone" },     
    { key: "address", title: "Address" }  
];

// 3. KHAI BÁO DOM (Tóm gọn bằng hàm $())
const $ = id => document.getElementById(id);
const facultySelect = $("facultySelect"), btnLoad = $("btnLoad"),
      searchInput = $("searchInput"), btnSearch = $("btnSearch"), btnResetSearch = $("btnResetSearch"),
      studentId = $("studentId"), studentName = $("studentName"), studentEmail = $("studentEmail"),
      studentPhone = $("studentPhone"), studentAddress = $("studentAddress"), // [KHI THI]: Khai báo thêm ô input mới ở đây
      btnAdd = $("btnAdd"), btnUpdate = $("btnUpdate"), btnClear = $("btnClear"),
      studentTableBody = $("studentTableBody"), message = $("message");

// 4. BIẾN TOÀN CỤC LƯU TRẠNG THÁI
let students = [], currentFacultyId = "";

// 5. HÀM TIỆN ÍCH (THÔNG BÁO & LÀM SẠCH FORM)
const showMessage = text => message.textContent = text;

// [KHI THI]: Gán bằng "" cho các ô input mới khi xóa form
const clearForm = () => {
    studentId.value = studentName.value = studentEmail.value = studentPhone.value = studentAddress.value = "";
};

// 6. LẤY DỮ LIỆU TỪ FORM THÀNH OBJECT JSON
// [KHI THI]: Bổ sung trường dữ liệu mới lấy từ input vào Object này
const getStudentFromForm = () => ({
    id: studentId.value ? Number(studentId.value) : null,
    name: studentName.value.trim(),
    email: studentEmail.value.trim(),
    phone: studentPhone.value.trim(),
    address: studentAddress.value.trim()
});

// 7. GET - TẢI DANH SÁCH SINH VIÊN TỪ SERVER
async function loadStudentsByFaculty() {
    if (!facultySelect.value) return alert("Vui lòng chọn khoa!");
    currentFacultyId = facultySelect.value;
    try {
        const res = await fetch(GET_STUDENTS_API(currentFacultyId));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        students = await res.json();
        renderTable(students);
        showMessage(`Đã tải ${students.length} sinh viên.`);
    } catch (err) {
        console.error("GET error:", err);
        showMessage("Không gọi được GET API.");
    }
}

// 8. RENDER TABLE (Vẽ bảng tự động từ mảng dữ liệu)
function renderTable(data) {
    studentTableBody.innerHTML = "";
    data.forEach(s => {
        const row = document.createElement("tr");
        // Map dữ liệu theo danh sách TABLE_COLUMNS
        row.innerHTML = TABLE_COLUMNS.map(col => `<td>${s[col.key] ?? ""}</td>`).join("");

        // Cột thao tác Sửa / Xóa
        const tdAction = document.createElement("td");
        tdAction.innerHTML = `<button onclick='editStudent(${JSON.stringify(s)})'>Sửa</button> 
                              <button onclick='deleteStudent(${s.id})'>Xóa</button>`;
        row.appendChild(tdAction);
        studentTableBody.appendChild(row);
    });
}

// 9. POST - THÊM SINH VIÊN MỚI LÊN SERVER
async function addStudent() {
    if (!currentFacultyId) return alert("Vui lòng chọn khoa trước!");
    const student = getStudentFromForm();
    if (!student.name || !student.email) return alert("Vui lòng nhập Tên và Email!");

    try {
        const res = await fetch(POST_STUDENT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await loadStudentsByFaculty();
        clearForm();
        showMessage("Thêm sinh viên thành công.");
    } catch (err) {
        console.error("POST error:", err);
        showMessage("Lỗi khi thêm sinh viên.");
    }
}

// 10. ĐỔ DỮ LIỆU TỪ DÒNG ĐƯỢC CHỌN LÊN FORM
// [KHI THI]: Đổ giá trị của cột mới lên input tương ứng
function editStudent(s) {
    studentId.value = s.id ?? "";
    studentName.value = s.name ?? "";
    studentEmail.value = s.email ?? "";
    studentPhone.value = s.phone ?? "";
    studentAddress.value = s.address ?? "";
    showMessage(`Đã chọn sinh viên ID: ${s.id}`);
}

// 11. PUT - CẬP NHẬT THÔNG TIN SINH VIÊN LÊN SERVER
async function updateStudent() {
    if (!studentId.value) return alert("Vui lòng chọn sinh viên cần sửa!");
    const student = getStudentFromForm();
    if (!student.name || !student.email) return alert("Vui lòng nhập Tên và Email!");

    try {
        const res = await fetch(PUT_STUDENT_API(student.id), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await loadStudentsByFaculty();
        clearForm();
        showMessage("Sửa sinh viên thành công.");
    } catch (err) {
        console.error("PUT error:", err);
        showMessage("Lỗi khi sửa sinh viên.");
    }
}

// 12. DELETE - XÓA SINH VIÊN KHỎI SERVER
async function deleteStudent(id) {
    if (!confirm(`Bạn có chắc muốn xóa sinh viên ID = ${id}?`)) return;
    try {
        const res = await fetch(DELETE_STUDENT_API(id), { method: "DELETE" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await loadStudentsByFaculty();
        showMessage("Xóa sinh viên thành công.");
    } catch (err) {
        console.error("DELETE error:", err);
        showMessage("Lỗi khi xóa sinh viên.");
    }
}

// 13. TÌM KIẾM SINH VIÊN TRÊN BẢNG
function searchStudents() {
    const kw = searchInput.value.toLowerCase();
    const filtered = students.filter(s => 
        s.name?.toLowerCase().includes(kw) || s.phone?.includes(kw) || s.email?.toLowerCase().includes(kw)
    );
    renderTable(filtered);
}

// 14. GẮN SỰ KIỆN CHO CÁC NÚT VÀ INPUT
facultySelect.onchange = () => facultySelect.value && loadStudentsByFaculty();
btnLoad.onclick = loadStudentsByFaculty;
btnAdd.onclick = addStudent;
btnUpdate.onclick = updateStudent;
btnClear.onclick = clearForm;
btnSearch.onclick = searchStudents;
searchInput.onkeyup = e => e.key === "Enter" && searchStudents();
btnResetSearch.onclick = () => { searchInput.value = ""; renderTable(students); };