import { graphql } from 'react-relay'

/**
 * Example Relay query for workspace projects.
 * Use with useLazyLoadQuery(WorkspaceProjectsQuery) once GraphQL endpoint is available.
 * Map result.workspace.projects to ProjectTableRow (team -> row.team from team.name).
 */
export const WorkspaceProjectsQuery = graphql`
  query WorkspaceProjectsQuery {
    workspace {
      projects {
        id
        name
        team {
          id
          name
        }
        status
      }
    }
  }
`
