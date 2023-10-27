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

export { addPost, postImage }    