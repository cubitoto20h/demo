// =====================================================
// MAIN.JS - KHỚP 100% VỚI INDEX.HTML
// Quản lý sinh viên bằng GET Web Service + Local Storage
// =====================================================

const API_URL = "/api/faculties";

// Lấy các phần tử HTML bằng DOM rút gọn
const $ = id => document.getElementById(id);

const facultySelect = $("facultySelect");
const btnLoad = $("btnLoad");

// [KHI THI - NẾU THÊM CỘT MỚI]: 1. Khai báo thêm DOM input ở đây
const studentIdInput = $("studentId");
const studentNameInput = $("studentName");
const studentEmailInput = $("studentEmail");
const studentPhoneInput = $("studentPhone");
const studentAddressInput = $("studentAddress");

const btnAdd = $("btnAdd");
const btnUpdate = $("btnUpdate");
const btnClear = $("btnClear");

const studentTableBody = $("studentTableBody");
const message = $("message");

// Mảng lưu danh sách sinh viên & biến lưu vị trí đang sửa (-1 là thêm mới)
let students = [];
let editIndex = -1;

// =====================================================
// 1. GẮN SỰ KIỆN
// =====================================================
btnLoad.addEventListener("click", loadStudents);
btnAdd.addEventListener("click", addStudent);
btnUpdate.addEventListener("click", updateStudent);
btnClear.addEventListener("click", resetForm);
facultySelect.addEventListener("change", () => { if (facultySelect.value) loadStudents(); });

// =====================================================
// 2. LOAD DANH SÁCH SINH VIÊN
// =====================================================
async function loadStudents() {
    const facultyName = facultySelect.value;
    if (!facultyName) return alert("Vui lòng chọn khoa!");

    const storageKey = getStorageKey();
    message.textContent = "Đang tải dữ liệu...";

    try {
        // GỌI GET WEB SERVICE
        const response = await fetch(`${API_URL}/${facultyName}/students`);
        if (!response.ok) throw new Error("Không tìm thấy khoa hoặc không tải được dữ liệu");

        const apiStudents = await response.json();

        // Ưu tiên lấy từ Local Storage, nếu chưa có thì lấy từ Web Service
        const savedStudents = localStorage.getItem(storageKey);
        students = savedStudents ? JSON.parse(savedStudents) : apiStudents;

        saveToLocalStorage();
        renderStudents();
        message.textContent = `Đã tải ${students.length} sinh viên của khoa .`;
    } catch (error) {
        students = [];
        renderStudents();
        message.textContent = error.message;
    }
}

// =====================================================
// 3. HIỂN THỊ DỮ LIỆU LÊN TABLE
// =====================================================
function renderStudents() {
    studentTableBody.innerHTML = ""; // Xóa dòng cũ

    students.forEach((student, index) => {
        const row = document.createElement("tr");

        // [KHI THI - NẾU THÊM CỘT MỚI]: 2. Tạo thêm td cho thuộc tính mới
        const idCell = document.createElement("td"); idCell.textContent = student.id ?? "";
        const nameCell = document.createElement("td"); nameCell.textContent = student.name ?? "";
        const emailCell = document.createElement("td"); emailCell.textContent = student.email ?? "";
        const phoneCell = document.createElement("td"); phoneCell.textContent = student.phone ?? "";
        const addressCell = document.createElement("td"); addressCell.textContent = student.address ?? "";

        // CỘT THAO TÁC (Sửa, Xóa)
        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Sửa";
        editButton.onclick = () => editStudent(index);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Xóa";
        deleteButton.onclick = () => deleteStudent(index);

        actionCell.append(editButton, " ", deleteButton);

        // [KHI THI - NẾU THÊM CỘT MỚI]: 3. Thêm cell mới vào row theo đúng thứ tự <th>
        row.append(idCell, nameCell, emailCell, phoneCell, addressCell, actionCell);
        studentTableBody.appendChild(row);
    });
}

// =====================================================
// 4. LẤY DỮ LIỆU TỪ FORM
// =====================================================
function getStudentFromForm() {
    // [KHI THI - NẾU THÊM CỘT MỚI]: 4. Lấy thêm giá trị input mới vào Object
    return {
        id: Number(studentIdInput.value),
        name: studentNameInput.value.trim(),
        email: studentEmailInput.value.trim(),
        phone: studentPhoneInput.value.trim(),
        address: studentAddressInput.value.trim()
    };
}

// =====================================================
// 5. THÊM SINH VIÊN (Nút btnAdd)
// =====================================================
function addStudent() {
    const student = getStudentFromForm();

    if (!student.id || !student.name) return alert("Vui lòng nhập ID và Tên!");

    // Kiểm tra trùng ID
    if (students.some(item => item.id === student.id)) {
        return message.textContent = "ID sinh viên đã tồn tại.";
    }

    students.push(student);
    message.textContent = "Đã thêm sinh viên thành công.";

    saveToLocalStorage();
    renderStudents();
    resetForm();
}

// =====================================================
// 6. CẬP NHẬT SINH VIÊN (Nút btnUpdate)
// =====================================================
function updateStudent() {
    if (editIndex === -1) return alert("Vui lòng chọn sinh viên cần sửa từ bảng trước!");

    const student = getStudentFromForm();

    if (!student.id || !student.name) return alert("Vui lòng nhập ID và Tên!");

    // Kiểm tra trùng ID với sinh viên khác
    if (students.some((item, i) => item.id === student.id && i !== editIndex)) {
        return message.textContent = "ID sinh viên đã bị trùng với sinh viên khác.";
    }

    students[editIndex] = student;
    message.textContent = "Đã cập nhật sinh viên thành công.";

    saveToLocalStorage();
    renderStudents();
    resetForm();
}

// =====================================================
// 7. SỬA SINH VIÊN (Đưa dữ liệu lên Form)
// =====================================================
function editStudent(index) {
    const student = students[index];
    editIndex = index;

    // [KHI THI - NẾU THÊM CỘT MỚI]: 5. Đổ dữ liệu từ thuộc tính mới lên ô input
    studentIdInput.value = student.id ?? "";
    studentNameInput.value = student.name ?? "";
    studentEmailInput.value = student.email ?? "";
    studentPhoneInput.value = student.phone ?? "";
    studentAddressInput.value = student.address ?? "";

    message.textContent = `Đang chọn sửa sinh viên ID: ${student.id}`;
}

// =====================================================
// 8. XÓA SINH VIÊN
// =====================================================
function deleteStudent(index) {
    if (!confirm(`Bạn có muốn xóa sinh viên "${students[index].name}" không?`)) return;

    students.splice(index, 1);
    saveToLocalStorage();
    renderStudents();
    resetForm();
    message.textContent = "Đã xóa sinh viên.";
}

// =====================================================
// 9. LÀM MỚI FORM (Nút btnClear)
// =====================================================
function resetForm() {
    // [KHI THI - NẾU THÊM CỘT MỚI]: 6. Xóa trắng ô input mới ở đây
    studentIdInput.value = "";
    studentNameInput.value = "";
    studentEmailInput.value = "";
    studentPhoneInput.value = "";
    studentAddressInput.value = "";

    editIndex = -1; // Reset về trạng thái chưa chọn dòng nào để sửa
}

// =====================================================
// 10. LƯU & KEY LOCAL STORAGE
// =====================================================
const getStorageKey = () => `students-${facultySelect.value}`;
const saveToLocalStorage = () => localStorage.setItem(getStorageKey(), JSON.stringify(students));

// Tự động tải dữ liệu khi mở trang (nếu chọn sẵn khoa)
if (facultySelect.value) loadStudents();