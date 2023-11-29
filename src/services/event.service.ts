import { IParams } from '@interfaces/IClient';
import { IEvent } from "@interfaces/IEvent";
import BaseURL from "@utils/api/baseURL";

const getAllEvent = (params: any) => {
    return BaseURL({
        url: `/events`,
        method: "GET",
        params,
    });
}

const addEvent = (data: Omit<IEvent, 'id'>) => {
    return BaseURL({
        url: `/events`,
        method: "POST",
        data,
    });
};

const editEvent = (data: IEvent) => {
    const { id, ...dataWithoutId } = data;
    return BaseURL({
        url: `/events/${id}`,
        method: "PUT",
        data: dataWithoutId
    });
};

const deleteEvent = (id: string) => {
    return BaseURL({
        url: `/events/${id}`,
        method: "DELETE",
    });
};

const getAllCommentEventById = ({ id, params }: IParams) => {
    return BaseURL({
        url: `/events/${id}/event-comments`,
        method: "GET",
        params,
    });
}

const addCommentToEvent = (data: any) => {
    return BaseURL({
        url: `/events/${data.id}/event-comments`,
        method: "POST",
        data: { content: data?.content },
    });
}

const editCommentToEvent = (data: any) => {
    return BaseURL({
        url: `/events/${data.id}/event-comments/${data?.eventCommentId}`,
        method: "PUT",
        data: { content: data?.content },
    });
}

const deleteCommentToEvent = (data: any) => {
    return BaseURL({
        url: `/events/${data.id}/event-comments/${data?.eventCommentId}`,
        method: "DELETE",
    });
}

export { getAllEvent, addEvent, editEvent, deleteEvent, getAllCommentEventById, addCommentToEvent, editCommentToEvent, deleteCommentToEvent }