export interface GitHubIssueType {
    assignee?: AssigneType;
    assignees: AssigneType[];
    author_association: string;
    body: string;
    closed_at: string;
    comments: number;
    comments_url: string;
    created_at: string;
    events_url: string;
    html_url: string;
    id: number;
    labels: LabelType[];
    labels_url: string;
    locked: boolean;
    milestone?: string;
    node_id: string;
    number: number;
    repository_url: string;
    state: string;
    title: string;
    updated_at: string;
    url: string;
    user: AssigneType;


}

interface AssigneType{
    login: string;
    id: number;
    avater_url: string;
}

interface LabelType{
    id: number;
    name: string;
    color: string;
}