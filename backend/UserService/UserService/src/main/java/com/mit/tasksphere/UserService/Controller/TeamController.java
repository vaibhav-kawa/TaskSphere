package com.mit.tasksphere.UserService.Controller;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mit.tasksphere.UserService.Entities.Team;
import com.mit.tasksphere.UserService.Entities.TeamMember;
import com.mit.tasksphere.UserService.Entities.User;
import com.mit.tasksphere.UserService.Repository.TeamRepository;
import com.mit.tasksphere.UserService.Repository.UserRepository;
import com.mit.tasksphere.UserService.Security.JwtHelper;
import com.mit.tasksphere.UserService.Services.TeamService;
import com.mit.tasksphere.UserService.PayLoads.TeamDTO;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/teams")
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TeamController {
    
    private static final Logger logger = LoggerFactory.getLogger(TeamController.class);

    @Autowired
    private TeamService teamService;

    @Autowired
    private JwtHelper jwtHelper;
    
    @Autowired 
    private UserRepository userRepository; 
    
    @Autowired
    private TeamRepository teamRepo;
    
    @PostMapping("/create")
    public ResponseEntity<Void> createTeam(@RequestBody Team team, HttpServletRequest request) {
        try {
            User currentUser = getUserFromJwt(request); 
            teamService.createTeam(team, currentUser.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException e) {
            logger.error("Error creating team: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        List<Team> teams = teamService.getAllTeams();
        List<TeamDTO> teamDTOs = teams.stream()
            .map(team -> new TeamDTO(team.getId(), team.getName(), team.getCreated_by(), team.getCreatedAt(), team.getUpdatedAt()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(teamDTOs);
    }
    
    @PostMapping("/{teamId}/members") 
    public ResponseEntity<Team> addMemberToTeam(@PathVariable Long teamId, @RequestBody String memberEmail, HttpServletRequest request) {
        try {
        	User currentUser = getUserFromJwt(request); 
            Team updatedTeam = teamService.addMemberToTeam(teamId,currentUser.getEmail() ,memberEmail);
            return ResponseEntity.ok(updatedTeam);
        } catch (Exception e) {
            logger.error("Error adding member to team {}: {}", teamId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{teamId}/members")
    public ResponseEntity<List<TeamMember>> getAllTeamMembers(@PathVariable Long teamId) {
        try {
            List<TeamMember> members = teamService.getAllTeamMembers(teamId);
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            logger.error("Error fetching members for team {}: {}", teamId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{teamId}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long teamId) {
        Optional<Team> team = teamService.getTeamById(teamId);
        return team.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{teamId}/members/{memberEmail}")
    public ResponseEntity<Team> updateTeamMember(@PathVariable Long teamId, @PathVariable String memberEmail, @RequestBody String newRole) {
        try {
            Team updatedTeam = teamService.updateTeamMember(teamId, memberEmail, newRole);
            return ResponseEntity.ok(updatedTeam);
        } catch (Exception e) {
            logger.error("Error updating member {} in team {}: {}", memberEmail, teamId, e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{teamId}/members/{memberEmail}")
    public ResponseEntity<Void> deleteTeamMember(@PathVariable Long teamId, @PathVariable String memberEmail) {
        try {
            teamService.deleteTeamMember(teamId, memberEmail);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting member {} from team {}: {}", memberEmail, teamId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    private User getUserFromJwt(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            logger.warn("Missing or invalid Authorization header");
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        
        String token = authorizationHeader.substring(7);
        String email = jwtHelper.extractUsername(token);
        logger.info("Extracted email from token: {}", email);
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
    }
}