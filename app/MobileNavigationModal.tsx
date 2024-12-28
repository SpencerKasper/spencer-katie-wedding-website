'use client';

import {Modal} from "@mantine/core";
import {HeaderButtons} from "@/app/HeaderButtons";

const MobileNavigationModal = ({isOpen, setIsOpen}) => {
    return (
        <Modal opened={isOpen} onClose={() => setIsOpen(false)}>
            <HeaderButtons />
        </Modal>
    )
}

export default MobileNavigationModal;