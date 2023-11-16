import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { addConversation, addMessageToConversation, getAllConverSation, getConversationById } from "../../services/conversation.service";
import { IParams } from "@interfaces/IClient";
import { IConversation } from "@interfaces/IConversation";

export interface IConversationModel {
  //MessageError
  messageError: string;
  setMessageError: Action<IConversationModel, string>;

  //setConversation
  currentConversation: IConversation | null
  setCurrentConversation: Action<IConversationModel, IConversation | null>;

  //listConversation
  listConversation: IConversation[]
  setIsReadConversation: Action<IConversationModel, string>;
  setListConversation: Action<IConversationModel, IConversation[]>;

  //GetAllConverSation
  isGetAllConverSationSuccess: boolean;
  setIsGetAllConverSationSuccess: Action<IConversationModel, boolean>;
  getAllConverSation: Thunk<IConversationModel, any>;

  //GetConverSationById
  isGetConverSationByIdSuccess: boolean;
  setIsGetConverSationByIdSuccess: Action<IConversationModel, boolean>;
  getConverSationById: Thunk<IConversationModel, IParams>;

  //AddMessageToConversation
  isAddMessageToConversationSuccess: boolean;
  setIsAddMessageToConversationSuccess: Action<IConversationModel, boolean>;
  addMessageToConversation: Thunk<IConversationModel, any>;

  //AddConversation
  isAddConversationSuccess: boolean;
  setIsAddConversationSuccess: Action<IConversationModel, boolean>;
  addConversation: Thunk<IConversationModel, any>;
}

export const conversationModel: IConversationModel = persist({
  //MessageError
  messageError: "",
  setMessageError: action((state, payload) => {
    state.messageError = payload;
  }),

  //setConversation
  currentConversation: null,
  setCurrentConversation: action((state, payload) => {
    state.currentConversation = payload;
  }),


  //listConversation
  listConversation: [],
  setListConversation: action((state, payload) => {
    state.listConversation = payload;
  }),

  setIsReadConversation: action((state, payload) => {
    state.listConversation = state.listConversation.map(item => {
      if (item.id === payload) {
        return { ...item, isRead: true };
      }
      return item;
    })
  }),

  //GetAllConverSation
  isGetAllConverSationSuccess: true,
  setIsGetAllConverSationSuccess: action((state, payload) => {
    state.isGetAllConverSationSuccess = payload;
  }),
  getAllConverSation: thunk(async (actions, payload) => {
    return getAllConverSation(payload)
      .then(async (res) => {
        actions.setIsGetAllConverSationSuccess(true)
        return res.data;
      })
      .catch((error) => {
        actions.setIsGetAllConverSationSuccess(false)
        actions.setMessageError(error?.response?.data?.message)
      });
  }),

  //GetConverSationById
  isGetConverSationByIdSuccess: true,
  setIsGetConverSationByIdSuccess: action((state, payload) => {
    state.isGetConverSationByIdSuccess = payload;
  }),
  getConverSationById: thunk(async (actions, payload) => {
    return getConversationById(payload)
      .then(async (res) => {
        actions.setIsGetConverSationByIdSuccess(true)
        return res.data;
      })
      .catch((error) => {
        actions.setIsGetConverSationByIdSuccess(false)
        actions.setMessageError(error?.response?.data?.message)
      });
  }),

  //AddMessageToConversation
  isAddMessageToConversationSuccess: true,
  setIsAddMessageToConversationSuccess: action((state, payload) => {
    state.isAddMessageToConversationSuccess = payload;
  }),
  addMessageToConversation: thunk(async (actions, payload) => {
    return addMessageToConversation(payload)
      .then(async (res) => {
        actions.setIsAddMessageToConversationSuccess(true)
        return res.data;
      })
      .catch((error) => {
        actions.setIsAddMessageToConversationSuccess(false)
        actions.setMessageError(error?.response?.data?.message)
      });
  }),

  //AddConversation
  isAddConversationSuccess: true,
  setIsAddConversationSuccess: action((state, payload) => {
    state.isAddConversationSuccess = payload;
  }),
  addConversation: thunk(async (actions, payload) => {
    return addConversation(payload)
      .then(async (res) => {
        actions.setIsAddConversationSuccess(true)
        return res.data
      })
      .catch((error) => {
        actions.setIsAddConversationSuccess(false)
        actions.setMessageError(error?.response?.data?.message)
      });
  }),
})