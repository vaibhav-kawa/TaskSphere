package com.mit.tasksphere.UserService.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mit.tasksphere.UserService.Entities.Team;


public interface TeamRepository extends JpaRepository<Team,Long>{
	Optional<Team> getTeamById(long teamId);
}
