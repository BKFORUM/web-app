import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { addPost, postImage } from "../../services/post.service";

export interface IPostModel {
    //MessageError
    messageError: string;
    setMessageError: Action<IPostModel, string>;

    //AddPost
    isAddPostSuccess: boolean;
    setIsAddPostSuccess: Action<IPostModel, boolean>;
    addPost: Thunk<IPostModel, any>;

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

    //AddPost
    isAddPostSuccess: true,
    setIsAddPostSuccess: action((state, payload) => {
        state.isAddPostSuccess = payload;
    }),
    addPost: thunk(async (actions, payload) => {
        return addPost(payload)
            .then(async (res) => {
                actions.setIsAddPostSuccess(true)
                return res.data;
            })
            .catch((error) => {
                actions.setIsAddPostSuccess(false)
                actions.setMessageError(error?.response?.data?.message)
            });
    }),

    //AddPost
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
