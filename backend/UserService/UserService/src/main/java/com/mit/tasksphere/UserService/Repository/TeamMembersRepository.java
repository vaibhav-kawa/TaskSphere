package com.mit.tasksphere.UserService.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mit.tasksphere.UserService.Entities.TeamMember;

public interface TeamMembersRepository extends JpaRepository<TeamMember,Long>{

}
