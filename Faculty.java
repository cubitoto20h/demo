package com.example.demo.model;

import java.util.ArrayList;
import java.util.List;

public class Faculty {

    private Long id;
    private String name;

    // Dùng ArrayList để danh sách có thể thay đổi
    private List<Student> students = new ArrayList<>();


    // Constructor rỗng
    public Faculty() {
    }


    // Constructor có tham số
    public Faculty(
            Long id,
            String name,
            List<Student> students) {

        this.id = id;
        this.name = name;

        // Copy sang ArrayList
        // để danh sách có thể add / remove / set
        this.students =
                students != null
                ? new ArrayList<>(students)
                : new ArrayList<>();
    }


    // Getter / Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }
}