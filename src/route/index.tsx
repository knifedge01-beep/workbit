import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import {
  MainLayout,
  InboxScreen,
  MyIssuesScreen,
  WorkspaceProjectsScreen,
  WorkspaceViewsScreen,
  WorkspaceMoreScreen,
  WorkspaceMemberScreen,
  WorkspaceRolesScreen,
  TeamIssuesScreenWrapper,
  TeamProjectsScreenWrapper,
  TeamViewsScreenWrapper,
  TeamLogsScreenWrapper,
  ShowcaseComponents,
} from '../pages'

function RedirectToTeamIssues() {
  const { teamId } = useParams<{ teamId: string }>()
  return <Navigate to={`/team/${teamId}/issues/active`} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/showcase" element={<ShowcaseComponents />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/team/Test94" replace />} />
        <Route path="inbox" element={<InboxScreen />} />
        <Route path="my-issues" element={<MyIssuesScreen />} />
        <Route path="workspace/projects" element={<WorkspaceProjectsScreen />} />
        <Route path="workspace/views" element={<WorkspaceViewsScreen />} />
        <Route path="workspace/more" element={<WorkspaceMoreScreen />} />
        <Route path="workspace/member" element={<WorkspaceMemberScreen />} />
        <Route path="workspace/roles" element={<WorkspaceRolesScreen />} />
        <Route path="team/:teamId" element={<RedirectToTeamIssues />} />
        <Route path="team/:teamId/issues/:tab" element={<TeamIssuesScreenWrapper />} />
        <Route path="team/:teamId/projects" element={<TeamProjectsScreenWrapper />} />
        <Route path="team/:teamId/views" element={<TeamViewsScreenWrapper />} />
        <Route path="team/:teamId/logs" element={<TeamLogsScreenWrapper />} />
      </Route>
    </Routes>
  )
}
