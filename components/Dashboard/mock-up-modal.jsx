import React, { useCallback, useMemo, useState } from 'react'
import Modal from '@components/shared/Modal'

const MockUpModal = ({ showMockModal, setShowMockModal }) => {
    return (
        <Modal showModal={showMockModal} setShowModal={setShowMockModal}>
            The show Modal Lockup Here!
        </Modal>
    )
}

export function useMockUpModal() {
    //  setState
    const [showMockModal, setShowMockModal] = useState(false)

    //TODO: callback function inorder to memorize the react
    const MockUpModalCallBack = useCallback(() => {
        return <MockUpModal showMockModal={showMockModal} setShowMockModal={setShowMockModal} />
    }, [showMockModal, setShowMockModal])

    //TODO: return memo function
    return useMemo(() => ({
        setShowMockModal, MocakUpModal: MockUpModalCallBack
    }), [showMockModal, MockUpModalCallBack])
}

