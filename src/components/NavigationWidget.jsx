import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-navigation-widget.scss';

import { ZoomInIcon, ZoomOutIcon, HomeIcon, ScaleIcon } from './Icons.jsx';

const NavigationWidget = ({
    zoomIn,
    zoomOut,
    home,
    onScale,
    enableHome,
}) => (
    <div
        className="ciq-navigation-widget"
    >
        {enableHome ? (
            <div className="ciq-navigation-widget__item" onClick={home}>
                <HomeIcon />
            </div>
        ) : ''}
        <div className="ciq-navigation-widget__item" onClick={onScale}>
            <ScaleIcon />
        </div>
        <div className="ciq-navigation-widget__item ciq-navigation-widget__item--zoom">
            <ZoomInIcon onClick={zoomIn} />
            <ZoomOutIcon onClick={zoomOut} />
        </div>
    </div>
);

export default connect(({ chartSize, navigationWidget }) => ({
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
    home: navigationWidget.onHome,
    onScale: navigationWidget.onScale,
    enableHome: navigationWidget.enableHome,
}))(NavigationWidget);
