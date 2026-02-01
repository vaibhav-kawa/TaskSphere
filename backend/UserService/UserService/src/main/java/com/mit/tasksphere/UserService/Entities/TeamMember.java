package com.mit.tasksphere.UserService.Entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(
	    name = "team_members",
	    uniqueConstraints = {
	        @UniqueConstraint(columnNames = {"team_id", "user_id"})
	    }
	)
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    @JsonBackReference
    private Team team;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String role; // e.g. OWNER, MEMBER, VIEWER

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Team getTeam() {
		return team;
	}

	public void setTeam(Team team) {
		this.team = team;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
	@Override
	public boolean equals(Object o) {
	    if (this == o) return true;
	    if (!(o instanceof TeamMember)) return false;
	    TeamMember that = (TeamMember) o;
	    return team != null && user != null &&
	           team.getId().equals(that.team.getId()) &&
	           user.getId().equals(that.user.getId());
	}

	@Override
	public int hashCode() {
	    return Objects.hash(team.getId(), user.getId());
	}

    
}
