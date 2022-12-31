package com.uniboy.bean;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class StudentRepositoryTest {

    @Autowired
    private StudentRepository underTest;

    @AfterEach
    void tearDown() {
        underTest.deleteAll();
    }

    @Test
    void itShouldCheckIfStudentEmailExists() {
        // given
        String email = "uniboy@gmail.com";
        Student student = new Student(
                "Uniboy",
                email,
                Gender.MALE
        );
        underTest.save(student);

        // when
        boolean result = underTest.selectExistsEmail(email);

        // then
        assertThat(result).isTrue();
    }

    @Test
    void itShouldCheckIfStudentEmailDoesNotExist() {
        // given
        String email = "uniboy@gmail.com";

        // when
        boolean result = underTest.selectExistsEmail(email);

        // then
        assertThat(result).isFalse();
    }
}