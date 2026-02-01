package com.mit.tasksphere.UserService.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mit.tasksphere.UserService.Entities.User;

public interface UserRepository extends JpaRepository<User,Long>{

	Optional<User> findByEmail(String email);

	List<User> findByRole(String role);

}
