import React from 'react';

const UserVideoComponent = ({ streamManager }) => {
    const videoRef = React.useRef();

    React.useEffect(() => {
        if (streamManager) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return <video autoPlay={true} ref={videoRef} />;
};

export default UserVideoComponent;
