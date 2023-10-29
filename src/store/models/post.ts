import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { addPost, getAllPostByForum, postImage } from "../../services/post.service";
import { IParams } from "@interfaces/IClient";

export interface IPostModel {
    //MessageError
    messageError: string;
    setMessageError: Action<IPostModel, string>;

    //AddPost
    isAddPostSuccess: boolean;
    setIsAddPostSuccess: Action<IPostModel, boolean>;
    addPost: Thunk<IPostModel, any>;

    //getAllPostByForum
    isGetAllPostByForumSuccess: boolean;
    setIsGetAllPostByForumSuccess: Action<IPostModel, boolean>;
    getAllPostByForum: Thunk<IPostModel, IParams>;

    //PostImage
    isPostImageSuccess: boolean;
    setIsPostImageSuccess: Action<IPostModel, boolean>;
    postImage: Thunk<IPostModel, any>;
}

export const postModel: IPostModel = persist({
    //MessageError
    messageError: "",
    setMessageError: action((state, payload) => {
        state.messageError = payload;
    }),

    // getAllPostByForum
    isGetAllPostByForumSuccess: true,
    setIsGetAllPostByForumSuccess: action((state, payload) => {
        state.isGetAllPostByForumSuccess = payload;
    }),
    getAllPostByForum: thunk(async (actions, payload) => {
        return getAllPostByForum(payload)
            .then(async (res) => {
                actions.setIsGetAllPostByForumSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsGetAllPostByForumSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //AddPost
    isAddPostSuccess: true,
    setIsAddPostSuccess: action((state, payload) => {
        state.isAddPostSuccess = payload;
    }),
    addPost: thunk(async (actions, payload) => {
        return addPost(payload)
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
        return postImage(payload)
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
})
