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
  TeamIssuesScreenWrapper,
  TeamProjectsScreenWrapper,
  TeamProjectDetailScreenWrapper,
  TeamViewsScreenWrapper,
  TeamLogsScreenWrapper,
  IssueDetailScreenWrapper,
  ShowcaseComponents,
} from '../pages'
import { LandingPage } from '../landing'

function RedirectToTeamIssues() {
  const { teamId } = useParams<{ teamId: string }>()
  return <Navigate to={`/team/${teamId}/issues/active`} replace />
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
      <Route
        path="/"
        element={
          <AuthGate>
            <MainLayout />
          </AuthGate>
        }
      >
        <Route index element={<Navigate to="/landing" replace />} />
        <Route path="inbox" element={<InboxScreen />} />
        <Route path="my-issues" element={<MyIssuesScreen />} />
        <Route
          path="workspace/projects"
          element={<WorkspaceProjectsScreen />}
        />
        <Route path="workspace/views" element={<WorkspaceViewsScreen />} />
        <Route path="workspace/more" element={<WorkspaceMoreScreen />} />
        <Route path="workspace/member" element={<WorkspaceMemberScreen />} />
        <Route path="workspace/teams" element={<WorkspaceTeamsScreen />} />
        <Route path="workspace/roles" element={<WorkspaceRolesScreen />} />
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
          path="team/:teamId/projects/:projectId"
          element={<TeamProjectDetailScreenWrapper />}
        />
        <Route path="team/:teamId/views" element={<TeamViewsScreenWrapper />} />
        <Route path="team/:teamId/logs" element={<TeamLogsScreenWrapper />} />
      </Route>
    </Routes>
  )
}
