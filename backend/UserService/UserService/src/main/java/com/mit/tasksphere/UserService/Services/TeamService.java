package com.mit.tasksphere.UserService.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service; 

import com.mit.tasksphere.UserService.Entities.Team;
import com.mit.tasksphere.UserService.Entities.TeamMember;
import com.mit.tasksphere.UserService.Entities.User;

@Service
public interface TeamService {
	
	public void createTeam(Team team, String creatorEmail);
	
	public List<Team> getAllTeams();
    
    public Optional<Team> getTeamById(Long teamId);

    public Team addMemberToTeam(Long teamId,String requesterEmail,String memberEmail);
    
    public  List<TeamMember> getAllTeamMembers(Long teamId);
    
    public Team updateTeamMember(Long teamId, String memberEmail, String newRole);

    public void deleteTeamMember(Long teamId, String memberEmail);
}