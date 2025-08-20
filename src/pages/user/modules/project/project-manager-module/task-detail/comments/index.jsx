import { Stack } from "@mui/material";
import AddCommentDialog from "./add-comment-dialog";
import Comment from "./comment";

function Comments({ taskId, comments = [], refetch }) {

    return (
        <Stack gap={3}>
            <Stack direction={"row"} justifyContent={"flex-end"}>
                <AddCommentDialog taskId={taskId} refetch={refetch} />
            </Stack>
            <Stack gap={3}>{comments.map(comment => <Comment key={comment.id} taskId={taskId} comment={comment} refetch={refetch} />)}</Stack>
        </Stack >
    );
}

export default Comments;