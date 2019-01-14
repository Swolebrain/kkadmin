import React from 'react';

const MainOpenRoute = ({startAuth}) => (
    <div>
        not logged in route
        <button onClick={startAuth}>log in</button>
    </div>
);

export default MainOpenRoute;