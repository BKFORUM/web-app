import { IParams } from "@interfaces/IClient";
import BaseURL from "@utils/api/baseURL";
import BaseURLUpLoadFile from "@utils/api/baseURLUpLoadFile";

const addPost = (data: any) => {
    return BaseURL({
        url: `/posts`,
        method: "POST",
        data,
    });
};

const postImage = (data: any) => {
    return BaseURLUpLoadFile({
        url: `/images`,
        method: "POST",
        data,
    });
}

const getAllPost = (params: any) => {
    return BaseURL({
        url: `/posts`,
        method: "GET",
        params,
    });
};

const getPostById = (id: string) => {
    return BaseURL({
        url: `/posts/` + id,
        method: "GET",
    });
};


const getAllPostByForum = ({ id, params }: IParams) => {
    return BaseURL({
        url: `/forums/${id}/posts`,
        method: "GET",
        params,
    });
}

const getAllPostByUser = ({ id, params }: IParams) => {
    return BaseURL({
        url: `/users/${id}/posts`,
        method: "GET",
        params,
    });
}

const editPost = (data: any) => {
    return BaseURL({
        url: `/posts/${data.id}`,
        method: "PUT",
        data
    });
};

const deletePost = (id: string) => {
    return BaseURL({
        url: `/posts/${id}`,
        method: "DELETE",
    });
};

const updateStatusPost = (data: any) => {
    return BaseURL({
        url: `/posts/${data?.id}`,
        method: "PATCH",
        data,
    });
}

const likePost = (id: string) => {
    return BaseURL({
        url: `/posts/${id}/likes`,
        method: "POST",
    });
}

const unLikePost = (id: string) => {
    return BaseURL({
        url: `/posts/${id}/likes`,
        method: "DELETE",
    });
}

const addCommentPost = (data: any) => {
    return BaseURL({
        url: `/posts/${data?.id}/comments`,
        method: "POST",
        data,
    });
}

const editCommentPost = (data: any) => {
    return BaseURL({
        url: `/comments/` + data.id,
        method: "PUT",
        data,
    });
}

const deleteCommentPost = (id: string) => {
    return BaseURL({
        url: `/comments/` + id,
        method: "DELETE",
    });
}

const getAllCommentPost = ({ id, params }: IParams) => {
    return BaseURL({
        url: `/posts/${id}/comments`,
        method: "GET",
        params,
    });
}

const replyCommentPost = (data: any) => {
    return BaseURL({
        url: `/comments/${data.id}/replies`,
        method: "POST",
        data,
    });
}

const editReplyCommentPost = (data: any) => {
    return BaseURL({
        url: `/comments/${data.id}/replies/${data.replyId}`,
        method: "PUT",
        data: { content: data.content },
    });
}

const deleteReplyCommentPost = (data: any) => {
    return BaseURL({
        url: `/comments/${data.id}/replies/${data.replyId}`,
        method: "DELETE",
    });
}

const getAllReplyByCommentId = ({ id, params }: IParams) => {
    return BaseURL({
        url: `/comments/${id}/replies`,
        method: "GET",
        params,
    });
}

export {
    addPost,
    postImage,
    getAllPost,
    getPostById,
    getAllPostByForum,
    getAllPostByUser,
    deletePost,
    editPost,
    updateStatusPost,
    likePost, unLikePost,
    addCommentPost,
    getAllCommentPost,
    editCommentPost,
    deleteCommentPost,
    replyCommentPost,
    editReplyCommentPost,
    deleteReplyCommentPost,
    getAllReplyByCommentId,
}    