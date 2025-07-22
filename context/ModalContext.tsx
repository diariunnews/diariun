// context/ModalContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "login" | null;

interface ModalContextProps {
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  isOpen: boolean;
  modalType: ModalType;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const isOpen = modalType !== null;

  const openModal = (type: ModalType) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <ModalContext.Provider value={{ isOpen, modalType, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
}
