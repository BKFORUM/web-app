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

const getAllPostByForum = ({ id, params }: IParams) => {
    return BaseURL({
        url: `/forums/${id}/posts`,
        method: "GET",
        params,
    });
}

export { addPost, postImage, getAllPost, getAllPostByForum }    