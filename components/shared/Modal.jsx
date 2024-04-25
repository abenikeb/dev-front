import React, { useCallback, useEffect, useRef } from 'react'
import useWindowSize from '@lib/hooks/useWindowSize'
import { AnimatePresence, motion } from "framer-motion";
import Leaflet from './leaflet';

const Modal = ({ children, showModal, setShowModal }) => {
    const desktopModalRef = useRef()

    const onKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            setShowModal(false)
        }
    }, [setShowModal])

    //TODO: initate window eventlistner and cleanup when unmount the cycle
    useEffect(() => {
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])

    const { isMobile, isDesktop } = useWindowSize()

    return (
        <AnimatePresence>
            {
                showModal && <>
                    {isMobile && <Leaflet setShow={setShowModal}>{children}</Leaflet>}
                    {isDesktop && <>
                        <motion.div
                            ref={desktopModalRef}
                            key="desktop-modal"
                            className="fixed inset-0 z-40 hidden min-h-screen items-center justify-center md:flex"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            onMouseDown={(e) => {
                                if (desktopModalRef.current === e.target) {
                                    setShowModal(false);
                                }
                            }}
                        >
                            {children}
                        </motion.div>
                        <motion.div
                            key="desktop-backdrop"
                            className="fixed inset-0 z-30 bg-gray-100 bg-opacity-10 backdrop-blur"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                        />
                    </>}
                </>
            }
        </AnimatePresence>
    )
}

export default Modal