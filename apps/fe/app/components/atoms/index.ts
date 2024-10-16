import axios from "axios";
import {atom, selector} from "recoil"
export const personalInfoAtom = atom({
    key: "personalInfoAtom",
    default: selector({
        key: "personalInfoAtomSelector",
        get: async () => {
             const res = await axios.get("http://localhost:8000/personalInfo", {
              withCredentials: true,
            });
            return res.data.payload;
        }
    })
})

export const usersListAtom = atom({
    key: "usersListAtom",
    default: selector({
        key: "usersListAtomSelector",
        get: async () => {
            const res = await axios.get("http://localhost:8000/allusers", {
                withCredentials: true,
              });
            return res.data.userData;
        }
    })
})