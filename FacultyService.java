package com.example.demo;

import org.springframework.stereotype.Service;

import com.example.demo.model.Faculty;
import com.example.demo.model.Student;

import java.util.List;
import java.util.Optional;

@Service
public class FacultyService {

    // =====================================================
    // DỮ LIỆU KHOA + SINH VIÊN
    // =====================================================

    private final List<Faculty> faculties = List.of(

        // -------------------------------------------------
        // KHOA 1
        // -------------------------------------------------

        new Faculty(
            1L,
            "Information Technology",

            List.of(
                new Student(
                    101L,
                    "Nguyen Van An",
                    "an@it.edu",
                    "0901111111",
                    "TP.HCM"
                ),

                new Student(
                    102L,
                    "Tran Thi Binh",
                    "binh@it.edu",
                    "0902222222",
                    "Dong Nai"
                )
            )
        ),


        // -------------------------------------------------
        // KHOA 2
        // -------------------------------------------------

        new Faculty(
            2L,
            "Accounting",

            List.of(
                new Student(
                    201L,
                    "Le Thi Lan",
                    "lan@accounting.edu",
                    "0903333333",
                    "Long An"
                ),

                new Student(
                    202L,
                    "Pham Van Minh",
                    "minh@accounting.edu",
                    "0904444444",
                    "Tien Giang"
                )
            )
        ),


        // -------------------------------------------------
        // KHOA 3
        // -------------------------------------------------

        new Faculty(
            3L,
            "Marketing",

            List.of(
                new Student(
                    301L,
                    "Hoang Thi Hoa",
                    "hoa@marketing.edu",
                    "0905555555",
                    "Binh Duong"
                ),

                new Student(
                    302L,
                    "Vo Thanh Nam",
                    "nam@marketing.edu",
                    "0906666666",
                    "TP.HCM"
                )
            )
        )
    );


    // =====================================================
    // 1. GET SINH VIÊN THEO ID KHOA
    // =====================================================

    public Optional<List<Student>>
    getStudentsByFacultyId(Long facultyId) {

        return faculties.stream()

            // Tìm khoa theo ID
            .filter(faculty ->
                faculty.getId().equals(facultyId)
            )

            // Lấy danh sách sinh viên
            .map(Faculty::getStudents)

            .findFirst();
    }


    // =====================================================
    // 2. GET SINH VIÊN THEO TÊN KHOA
    // =====================================================

    public Optional<List<Student>>
    getStudentsByFacultyName(
            String facultyName) {

        return faculties.stream()

            // Không phân biệt chữ hoa / thường
            .filter(faculty ->
                faculty.getName()
                       .equalsIgnoreCase(facultyName)
            )

            .map(Faculty::getStudents)

            .findFirst();
    }
}