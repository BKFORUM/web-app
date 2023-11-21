import { persist, action, Action, Thunk, thunk } from "easy-peasy";
import { addConversation, addMessageToConversation, addUserToConversation, deleteMemberOfConversation, editNickNameMember, getAllConverSation, getConversationById } from "../../services/conversation.service";
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
  isGetAllMessagesAgain: boolean;
  setIsGetAllMessagesAgain: Action<IConversationModel, boolean>;
  getConverSationById: Thunk<IConversationModel, IParams>;

  //AddMessageToConversation
  isAddMessageToConversationSuccess: boolean;
  setIsAddMessageToConversationSuccess: Action<IConversationModel, boolean>;
  addMessageToConversation: Thunk<IConversationModel, any>;

  //AddConversation
  isAddConversationSuccess: boolean;
  setIsAddConversationSuccess: Action<IConversationModel, boolean>;
  addConversation: Thunk<IConversationModel, any>;

  //DeleteMemberOfConversation
  isDeleteMemberOfConversationSuccess: boolean;
  setIsDeleteMemberOfConversationSuccess: Action<IConversationModel, boolean>;
  deleteMemberOfConversation: Thunk<IConversationModel, any>;

  //AddUserToConversation
  isAddUserToConversationSuccess: boolean;
  setIsAddUserToConversationSuccess: Action<IConversationModel, boolean>;
  addUserToConversation: Thunk<IConversationModel, any>;

  //EditNickNameMemberOfConversation
  isEditNickNameMemberSuccess: boolean;
  setIsEditNickNameMemberSuccess: Action<IConversationModel, boolean>;
  editNickNameMember: Thunk<IConversationModel, any>;
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
  isGetAllMessagesAgain: false,
  setIsGetAllMessagesAgain: action((state, payload) => {
    state.isGetAllMessagesAgain = payload;
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

  //DeleteMemberOfConversation
  isDeleteMemberOfConversationSuccess: true,
  setIsDeleteMemberOfConversationSuccess: action((state, payload) => {
    state.isDeleteMemberOfConversationSuccess = payload;
  }),
  deleteMemberOfConversation: thunk(async (actions, payload) => {
    return deleteMemberOfConversation(payload)
      .then(async (res) => {
        actions.setIsDeleteMemberOfConversationSuccess(true)
        return res
      })
      .catch((error) => {
        actions.setIsDeleteMemberOfConversationSuccess(false)
        actions.setMessageError(error?.response?.data?.message)
      });
  }),

  //AddUserToConversation
  isAddUserToConversationSuccess: true,
  setIsAddUserToConversationSuccess: action((state, payload) => {
    state.isAddUserToConversationSuccess = payload;
  }),
  addUserToConversation: thunk(async (actions, payload) => {
    return addUserToConversation(payload)
      .then(async (res) => {
        actions.setIsAddUserToConversationSuccess(true)
        return res
      })
      .catch((error) => {
        actions.setIsAddUserToConversationSuccess(false)
        actions.setMessageError(error?.response?.data?.message)
      });
  }),

  //EditNickNameMember
  isEditNickNameMemberSuccess: true,
  setIsEditNickNameMemberSuccess: action((state, payload) => {
    state.isEditNickNameMemberSuccess = payload;
  }),
  editNickNameMember: thunk(async (actions, payload) => {
    return editNickNameMember(payload)
      .then(async (res) => {
        actions.setIsEditNickNameMemberSuccess(true)
        return res
      })
      .catch((error) => {
        actions.setIsEditNickNameMemberSuccess(false)
        actions.setMessageError(error?.response?.data?.message)
      });
  }),
})