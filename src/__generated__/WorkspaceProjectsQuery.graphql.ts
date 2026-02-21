/**
 * @generated SignedSource<<6def61d9550c5bd08fa0a7c84bf4cea5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type WorkspaceProjectsQuery$variables = Record<PropertyKey, never>;
export type WorkspaceProjectsQuery$data = {
  readonly workspace: {
    readonly projects: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
      readonly status: string;
      readonly team: {
        readonly id: string;
        readonly name: string;
      };
    }>;
  };
};
export type WorkspaceProjectsQuery = {
  response: WorkspaceProjectsQuery$data;
  variables: WorkspaceProjectsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Workspace",
    "kind": "LinkedField",
    "name": "workspace",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "projects",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Team",
            "kind": "LinkedField",
            "name": "team",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "WorkspaceProjectsQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "WorkspaceProjectsQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "e8aabe9c866c18fbee5c18e1beb13724",
    "id": null,
    "metadata": {},
    "name": "WorkspaceProjectsQuery",
    "operationKind": "query",
    "text": "query WorkspaceProjectsQuery {\n  workspace {\n    projects {\n      id\n      name\n      team {\n        id\n        name\n      }\n      status\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "08b818707024e79de9c0d7d2a2fbcb85";

export default node;
