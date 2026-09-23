package com.example.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Student;

import java.util.List;

@RestController
@RequestMapping("/api/faculties")
public class FacultyRestController {

    private final FacultyService facultyService;


    // Constructor
    public FacultyRestController(
            FacultyService facultyService) {

        this.facultyService = facultyService;
    }


    // =====================================================
    // GET SINH VIÊN THEO ID KHOA
    // =====================================================
    //
    // Ví dụ:
    //
    // GET
    // http://localhost:8080/api/faculties/1/students
    //
    // =====================================================

    @GetMapping("/{facultyId}/students")
    public ResponseEntity<List<Student>>
    getStudentsByFacultyId(
            @PathVariable Long facultyId) {

        return facultyService
            .getStudentsByFacultyId(facultyId)

            .map(ResponseEntity::ok)

            .orElseGet(
                () ->
                ResponseEntity.notFound().build()
            );
    }


    // =====================================================
    // GET SINH VIÊN THEO TÊN KHOA
    // =====================================================
    //
    // Ví dụ:
    //
    // GET
    // /api/faculties/by-name/Marketing/students
    //
    // =====================================================

    @GetMapping("/by-name/{name}/students")
    public ResponseEntity<List<Student>>
    getStudentsByFacultyName(
            @PathVariable String name) {

        return facultyService
            .getStudentsByFacultyName(name)

            .map(ResponseEntity::ok)

            .orElseGet(
                () ->
                ResponseEntity.notFound().build()
            );
    }
}