import { createContext, useState } from "react";


export const editedModalContext = createContext({
    editedModal : null,
    setEditedModal : () => null,
    modalOpen:  false,
    setModalOpen: () => false
})

export const EditedModalProvider = ({children}) => {
    const [ editedModal, setEditedModal ] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const value = { editedModal, setEditedModal,modalOpen,setModalOpen }

    return (
        <editedModalContext.Provider value={value}>{children}</editedModalContext.Provider>
    )

}