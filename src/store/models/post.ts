import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import * as PostService from "../../services/post.service";
import { IParams } from "@interfaces/IClient";
import { ICountReply, IPostViewForum } from "@interfaces/IPost";

export interface IPostModel {
    //MessageError
    messageError: string;
    setMessageError: Action<IPostModel, string>;

    //postSelected
    postSelected: null | IPostViewForum;
    setPostSelected: Action<IPostModel, IPostViewForum | null>;

    //AddPost
    isAddPostSuccess: boolean;
    setIsAddPostSuccess: Action<IPostModel, boolean>;
    addPost: Thunk<IPostModel, any>;

    //EditPost
    isEditPostSuccess: boolean;
    setIsEditPostSuccess: Action<IPostModel, boolean>;
    editPost: Thunk<IPostModel, any>;

    //DeletePost
    isDeletePostSuccess: boolean;
    setIsDeletePostSuccess: Action<IPostModel, boolean>;
    deletePost: Thunk<IPostModel, string>;

    //getAllPost
    isGetAllPostSuccess: boolean;
    setIsGetAllPostSuccess: Action<IPostModel, boolean>;
    getAllPost: Thunk<IPostModel, any>;

    //getAllPostById
    isGetPostByIdSuccess: boolean;
    setGetPostByIdSuccess: Action<IPostModel, boolean>;
    getPostById: Thunk<IPostModel, string>;

    //getAllPostByForum
    isGetAllPostByForumSuccess: boolean;
    setIsGetAllPostByForumSuccess: Action<IPostModel, boolean>;
    getAllPostByForum: Thunk<IPostModel, IParams>;

    //getAllPostByUser
    isGetAllPostByUserSuccess: boolean;
    setIsGetAllPostByUserSuccess: Action<IPostModel, boolean>;
    getAllPostByUser: Thunk<IPostModel, IParams>;

    //PostImage
    isPostImageSuccess: boolean;
    setIsPostImageSuccess: Action<IPostModel, boolean>;
    postImage: Thunk<IPostModel, any>;

    //UpdateStatusPost
    isUpdateStatusPostSuccess: boolean;
    setIsUpdateStatusPostSuccess: Action<IPostModel, boolean>;
    updateStatusPost: Thunk<IPostModel, any>;

    //LikePost
    isLikePostSuccess: boolean;
    setIsLikePostSuccess: Action<IPostModel, boolean>;
    likePost: Thunk<IPostModel, string>;

    //UnLikePost
    isUnLikePostSuccess: boolean;
    setIsUnLikePostSuccess: Action<IPostModel, boolean>;
    unLikePost: Thunk<IPostModel, string>;

    //getAllCommentPost
    isGetAllCommentPostSuccess: boolean;
    setIsGetAllCommentPostSuccess: Action<IPostModel, boolean>;
    getAllCommentPost: Thunk<IPostModel, IParams>;

    //addCommentPost
    isAddCommentPostSuccess: boolean;
    setIsAddCommentPostSuccess: Action<IPostModel, boolean>;
    addCommentPost: Thunk<IPostModel, any>;

    //editCommentPost
    isEditCommentPostSuccess: boolean;
    setIsEditCommentPostSuccess: Action<IPostModel, boolean>;
    editCommentPost: Thunk<IPostModel, any>;

    //deleteCommentPost
    isDeleteCommentPostSuccess: boolean;
    setIsDeleteCommentPostSuccess: Action<IPostModel, boolean>;
    deleteCommentPost: Thunk<IPostModel, string>;

    //replyCommentPost
    isReplyCommentPostSuccess: boolean;
    setReplyCommentPostSuccess: Action<IPostModel, boolean>;
    replyCommentPost: Thunk<IPostModel, any>;

    //editReplyCommentPost
    isEditReplyCommentPostSuccess: boolean;
    setIsEditReplyCommentPostSuccess: Action<IPostModel, boolean>;
    editReplyCommentPost: Thunk<IPostModel, any>;

    //deleteReplyCommentPost
    isDeleteReplyCommentPostSuccess: boolean;
    setIsDeleteReplyCommentPostSuccess: Action<IPostModel, boolean>;
    deleteReplyCommentPost: Thunk<IPostModel, any>;

    //getAllReplyByCommentId
    isGetAllReplyByCommentIdSuccess: boolean;
    setIsGetAllReplyByCommentIdSuccess: Action<IPostModel, boolean>;
    countReplyByCommentId: ICountReply[];
    setCountReplyByCommentId: Action<IPostModel, ICountReply[]>;
    getAllReplyByCommentId: Thunk<IPostModel, IParams>;
}

export const postModel: IPostModel = persist({
    //MessageError
    messageError: "",
    setMessageError: action((state, payload) => {
        state.messageError = payload;
    }),

    //postSelected
    postSelected: null,
    setPostSelected: action((state, payload) => {
        state.postSelected = payload;
    }),

    // getAllPost
    isGetAllPostSuccess: true,
    setIsGetAllPostSuccess: action((state, payload) => {
        state.isGetAllPostSuccess = payload;
    }),
    getAllPost: thunk(async (actions, payload) => {
        return PostService.getAllPost(payload)
            .then(async (res) => {
                actions.setIsGetAllPostSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    // getPostById
    isGetPostByIdSuccess: true,
    setGetPostByIdSuccess: action((state, payload) => {
        state.isGetPostByIdSuccess = payload;
    }),
    getPostById: thunk(async (actions, payload) => {
        return PostService.getPostById(payload)
            .then(async (res) => {
                actions.setGetPostByIdSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setGetPostByIdSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    // getAllPostByForum
    isGetAllPostByForumSuccess: true,
    setIsGetAllPostByForumSuccess: action((state, payload) => {
        state.isGetAllPostByForumSuccess = payload;
    }),
    getAllPostByForum: thunk(async (actions, payload) => {
        return PostService.getAllPostByForum(payload)
            .then(async (res) => {
                actions.setIsGetAllPostByForumSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllPostByForumSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    // getAllPostByForum
    isGetAllPostByUserSuccess: true,
    setIsGetAllPostByUserSuccess: action((state, payload) => {
        state.isGetAllPostByUserSuccess = payload;
    }),
    getAllPostByUser: thunk(async (actions, payload) => {
        return PostService.getAllPostByUser(payload)
            .then(async (res) => {
                actions.setIsGetAllPostByUserSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllPostByUserSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //AddPost
    isAddPostSuccess: true,
    setIsAddPostSuccess: action((state, payload) => {
        state.isAddPostSuccess = payload;
    }),
    addPost: thunk(async (actions, payload) => {
        return PostService.addPost(payload)
            .then(async (res) => {
                actions.setIsAddPostSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsAddPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //EditPost
    isEditPostSuccess: true,
    setIsEditPostSuccess: action((state, payload) => {
        state.isEditPostSuccess = payload;
    }),
    editPost: thunk(async (actions, payload) => {
        return PostService.editPost(payload)
            .then(async (res) => {
                actions.setIsAddPostSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsAddPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //PostImage
    isPostImageSuccess: true,
    setIsPostImageSuccess: action((state, payload) => {
        state.isPostImageSuccess = payload;
    }),
    postImage: thunk(async (actions, payload) => {
        return PostService.postImage(payload)
            .then(async (res) => {
                actions.setIsPostImageSuccess(true)
                return res.data;
            })
            .catch((error) => {
                console.log(error)
                actions.setIsPostImageSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //DeletePost
    isDeletePostSuccess: true,
    setIsDeletePostSuccess: action((state, payload) => {
        state.isDeletePostSuccess = payload;
    }),
    deletePost: thunk(async (actions, payload,) => {
        return PostService.deletePost(payload)
            .then(async (res) => {
                actions.setIsDeletePostSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsDeletePostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //DeletePost
    isUpdateStatusPostSuccess: true,
    setIsUpdateStatusPostSuccess: action((state, payload) => {
        state.isUpdateStatusPostSuccess = payload;
    }),
    updateStatusPost: thunk(async (actions, payload,) => {
        return PostService.updateStatusPost(payload)
            .then(async (res) => {
                actions.setIsUpdateStatusPostSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsUpdateStatusPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //LikePost
    isLikePostSuccess: true,
    setIsLikePostSuccess: action((state, payload) => {
        state.isLikePostSuccess = payload;
    }),
    likePost: thunk(async (actions, payload,) => {
        return PostService.likePost(payload)
            .then(async (res) => {
                actions.setIsLikePostSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsLikePostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //UnLikePost
    isUnLikePostSuccess: true,
    setIsUnLikePostSuccess: action((state, payload) => {
        state.isUnLikePostSuccess = payload;
    }),
    unLikePost: thunk(async (actions, payload,) => {
        return PostService.unLikePost(payload)
            .then(async (res) => {
                actions.setIsUnLikePostSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsUnLikePostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //AddCommentPost
    isAddCommentPostSuccess: true,
    setIsAddCommentPostSuccess: action((state, payload) => {
        state.isAddCommentPostSuccess = payload;
    }),
    addCommentPost: thunk(async (actions, payload,) => {
        return PostService.addCommentPost(payload)
            .then(async (res) => {
                actions.setIsAddCommentPostSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsAddCommentPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //DeleteCommentPost
    isDeleteCommentPostSuccess: true,
    setIsDeleteCommentPostSuccess: action((state, payload) => {
        state.isDeleteCommentPostSuccess = payload;
    }),
    deleteCommentPost: thunk(async (actions, payload,) => {
        return PostService.deleteCommentPost(payload)
            .then(async (res) => {
                actions.setIsDeleteCommentPostSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsDeleteCommentPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //EditCommentPost
    isEditCommentPostSuccess: true,
    setIsEditCommentPostSuccess: action((state, payload) => {
        state.isEditCommentPostSuccess = payload;
    }),
    editCommentPost: thunk(async (actions, payload,) => {
        return PostService.editCommentPost(payload)
            .then(async (res) => {
                actions.setIsEditCommentPostSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsEditCommentPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //GetAllCommentPost
    isGetAllCommentPostSuccess: true,
    setIsGetAllCommentPostSuccess: action((state, payload) => {
        state.isGetAllCommentPostSuccess = payload;
    }),
    getAllCommentPost: thunk(async (actions, payload,) => {
        return PostService.getAllCommentPost(payload)
            .then(async (res) => {
                actions.setIsGetAllCommentPostSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllCommentPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //GetAllReplyByCommentId
    isGetAllReplyByCommentIdSuccess: true,
    setIsGetAllReplyByCommentIdSuccess: action((state, payload) => {
        state.isGetAllReplyByCommentIdSuccess = payload;
    }),
    countReplyByCommentId: [],
    setCountReplyByCommentId: action((state, payload) => {
        state.countReplyByCommentId = payload;
    }),
    getAllReplyByCommentId: thunk(async (actions, payload,) => {
        return PostService.getAllReplyByCommentId(payload)
            .then(async (res) => {
                actions.setIsGetAllReplyByCommentIdSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllReplyByCommentIdSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //ReplyCommentPost
    isReplyCommentPostSuccess: true,
    setReplyCommentPostSuccess: action((state, payload) => {
        state.isReplyCommentPostSuccess = payload;
    }),
    replyCommentPost: thunk(async (actions, payload,) => {
        return PostService.replyCommentPost(payload)
            .then(async (res) => {
                actions.setReplyCommentPostSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setReplyCommentPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //EditReplyCommentPost
    isEditReplyCommentPostSuccess: true,
    setIsEditReplyCommentPostSuccess: action((state, payload) => {
        state.isEditReplyCommentPostSuccess = payload;
    }),
    editReplyCommentPost: thunk(async (actions, payload,) => {
        return PostService.editReplyCommentPost(payload)
            .then(async (res) => {
                actions.setIsEditReplyCommentPostSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsEditReplyCommentPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //DeleteReplyCommentPost
    isDeleteReplyCommentPostSuccess: true,
    setIsDeleteReplyCommentPostSuccess: action((state, payload) => {
        state.isDeleteReplyCommentPostSuccess = payload;
    }),
    deleteReplyCommentPost: thunk(async (actions, payload,) => {
        return PostService.deleteReplyCommentPost(payload)
            .then(async (res) => {
                actions.setIsDeleteReplyCommentPostSuccess(true)
                return res;
            })
            .catch((error) => {
                actions.setIsDeleteReplyCommentPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),
})
