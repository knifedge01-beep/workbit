import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import {
  AuthGate,
  MainLayout,
  LoginScreen,
  SignupScreen,
  InboxScreen,
  MyIssuesScreen,
  WorkspaceProjectsScreen,
  WorkspaceViewsScreen,
  WorkspaceMoreScreen,
  WorkspaceMemberScreen,
  WorkspaceTeamsScreen,
  WorkspaceRolesScreen,
  WorkspacesScreen,
  CreateTeamScreen,
  CreateMemberScreen,
  CreateProjectScreen,
  CreateIssueScreen,
  TeamIssuesScreenWrapper,
  TeamProjectsScreenWrapper,
  TeamProjectDetailScreenWrapper,
  TeamViewsScreenWrapper,
  TeamLogsScreenWrapper,
  IssueDetailScreenWrapper,
  ShowcaseComponents,
  ProfilePage,
} from '../pages'
import { LandingPage } from '../landing'

function RedirectToTeamIssues() {
  const { workspaceId, teamId } = useParams<{
    workspaceId: string
    teamId: string
  }>()
  return (
    <Navigate
      to={`/workspace/${workspaceId}/team/${teamId}/issues/active`}
      replace
    />
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/showcase" element={<ShowcaseComponents />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route
        path="/workspaces"
        element={
          <AuthGate>
            <WorkspacesScreen />
          </AuthGate>
        }
      />
      <Route path="/" element={<Navigate to="/workspaces" replace />} />
      <Route
        path="/workspace/:workspaceId"
        element={
          <AuthGate>
            <MainLayout />
          </AuthGate>
        }
      >
        <Route index element={<Navigate to="/workspaces" replace />} />
        <Route path="inbox" element={<InboxScreen />} />
        <Route path="my-issues" element={<MyIssuesScreen />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="workspace/projects"
          element={<WorkspaceProjectsScreen />}
        />
        <Route path="workspace/views" element={<WorkspaceViewsScreen />} />
        <Route path="workspace/more" element={<WorkspaceMoreScreen />} />
        <Route path="workspace/member" element={<WorkspaceMemberScreen />} />
        <Route path="workspace/member/new" element={<CreateMemberScreen />} />
        <Route path="workspace/teams" element={<WorkspaceTeamsScreen />} />
        <Route path="workspace/teams/new" element={<CreateTeamScreen />} />
        <Route
          path="workspace/projects/new"
          element={<CreateProjectScreen />}
        />
        <Route path="workspace/roles" element={<WorkspaceRolesScreen />} />
        <Route path="issues/new" element={<CreateIssueScreen />} />
        <Route path="team/:teamId" element={<RedirectToTeamIssues />} />
        <Route
          path="team/:teamId/issues/:tab"
          element={<TeamIssuesScreenWrapper />}
        />
        <Route
          path="team/:teamId/issue/:issueId"
          element={<IssueDetailScreenWrapper />}
        />
        <Route
          path="team/:teamId/projects"
          element={<TeamProjectsScreenWrapper />}
        />
        <Route
          path="team/:teamId/projects/new"
          element={<CreateProjectScreen />}
        />
        <Route
          path="team/:teamId/projects/:projectId"
          element={<TeamProjectDetailScreenWrapper />}
        />
        <Route path="team/:teamId/issues/new" element={<CreateIssueScreen />} />
        <Route
          path="team/:teamId/member/new"
          element={<CreateMemberScreen />}
        />
        <Route path="team/:teamId/teams/new" element={<CreateTeamScreen />} />
        <Route path="team/:teamId/views" element={<TeamViewsScreenWrapper />} />
        <Route path="team/:teamId/logs" element={<TeamLogsScreenWrapper />} />
      </Route>
    </Routes>
  )
}
