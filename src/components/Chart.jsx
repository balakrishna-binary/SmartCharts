/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import CIQ from 'chartiq'; // eslint-disable-line
import RenderInsideChart from './RenderInsideChart.jsx';
import ComparisonList from './ComparisonList.jsx';
import ChartTitle from './ChartTitle.jsx';
import AssetInformation from './AssetInformation.jsx';
import Loader from './Loader.jsx';

/* css + scss */
import '../../sass/chartiq.scss';
import '../../sass/_ciq-custom.scss';

import '../Plugin';
import './ui';

/* To do convert this to jsx*/
// import './Loader';
import ChartControls from './ChartControls.jsx';
import SettingsDialog from './SettingsDialog.jsx';
import Notification from './Notification.jsx';
import Crosshair from './Crosshair.jsx';
import { connect } from '../store/Connect';

const defaultTopWidgets = () => (
    <Fragment>
        <ChartTitle />
        <AssetInformation />
        <ComparisonList />
    </Fragment>
);

class Chart extends Component {
    static childContextTypes = { promise: PropTypes.object };

    getChildContext() {
        return { promise: this.props.contextPromise };
    }

    componentDidMount() {
        this.props.init(this.root, this.props);
    }

    render() {
        const {
            DrawToolsSettingsDialog,
            StudySettingsDialog,
            children,
            lang,
            isMobile,
            isChartAvailable,
            setting,
            chartPanelTop,
            chartControlsWidgets,
            topWidgets,
        } = this.props;

        const currentLang = lang || ((setting && setting.language) ? setting.language : 'en');
        t.setLanguage(currentLang);

        const array = React.Children.toArray(children);
        const insideHolder = array.filter(c => !/(TradeStart)|(TradeEnd)/.test(c.type.displayName));
        const insideSubHolder = array.filter(c => /(TradeStart)|(TradeEnd)/.test(c.type.displayName));
        const renderTopWidgets = topWidgets || defaultTopWidgets;

        return (
            <cq-context ref={(root) => { this.root = root; }} class={isMobile ? 'smartcharts-mobile' : ''}>
                <div className="ciq-chart-area">
                    <div className="ciq-chart">
                        <RenderInsideChart at='holder'>
                            {insideHolder}
                        </RenderInsideChart>
                        <RenderInsideChart at='subholder'>
                            {insideSubHolder}
                        </RenderInsideChart>
                        <div className="cq-top-ui-widgets" style={{top: chartPanelTop}}>
                            { renderTopWidgets() }
                        </div>
                        <ChartControls widgets={chartControlsWidgets} />
                        <Crosshair />
                        <div className="chartContainer primary"> </div>
                        <Loader />
                        {!isChartAvailable &&
                            <div className="cq-chart-unavailable">
                                {t.translate('Chart data is not available for this symbol.')}
                            </div>}
                    </div>
                </div>
                <DrawToolsSettingsDialog />
                <StudySettingsDialog />
                <Notification />
            </cq-context>
        );
    }
}

export default connect(
    ({chart, drawTools, studies}) => ({
        contextPromise: chart.contextPromise,
        init: chart.init,
        StudySettingsDialog : studies.settingsDialog.connect(SettingsDialog),
        DrawToolsSettingsDialog : drawTools.settingsDialog.connect(SettingsDialog),
        isChartAvailable: chart.isChartAvailable,
        setting: chart.setting,
        chartPanelTop: chart.chartPanelTop,
    })
)(Chart);