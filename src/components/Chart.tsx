import React from 'react';
import classNames from 'classnames';
import RenderInsideChart from './RenderInsideChart';
import ChartTitle from './ChartTitle';
import Loader from './Loader';
import Barrier from './Barrier';
import BottomWidget from './BottomWidget';
import BottomWidgetsContainer from './BottomWidgetsContainer';
import NavigationWidget from './NavigationWidget';
import HighestLowestMarker from './HighestLowestMarker';
/* css + scss */
import '../../sass/main.scss';
import 'react-tabs/style/react-tabs.css';

import './ui';

import ChartControls from './ChartControls';
import ChartFooter from './ChartFooter';
import Crosshair from './Crosshair';
import { connect } from '../store/Connect';
import { initGA, logPageView } from '../utils/ga';
import PaginationLoader from './PaginationLoader';
import { TMainStore } from 'src/types';

const Chart = (props: any) => {
    const rootRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const { updateProps, init, ...otherProps } = props;
        initGA();
        logPageView();
        updateProps(otherProps);
        init(rootRef.current, otherProps);

        return () => {
            props.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const { updateProps, init, ...otherProps } = props;
        updateProps(otherProps);
    });

    const defaultTopWidgets = () => <ChartTitle />;

    const {
        id,
        chartId,
        DrawToolsSettingsDialog,
        StudySettingsDialog,
        isCandle,
        isSpline,
        isMobile = false,
        isChartAvailable,
        isHighestLowestMarkerEnabled,
        barriers = [],
        children,
        chartControlsWidgets,
        AggregateChartSettingsDialog,
        topWidgets,
        chartContainerHeight,
        containerWidth,
        isChartClosed,
        theme,
        position,
        bottomWidgets,
        enabledChartFooter = true,
        enabledNavigationWidget = true,
        toolbarWidget,
        onCrosshairChange,
        isLoading,
    } = props;

    const hasPosition = chartControlsWidgets && position && !isMobile;
    const TopWidgets = topWidgets || defaultTopWidgets;
    // if there are any markers, then increase the subholder z-index
    const ToolbarWidget = toolbarWidget;

    return (
        <div
            id={id || chartId}
            className={classNames('smartcharts', `smartcharts-${theme}`, {
                'smartcharts--navigation-widget': enabledNavigationWidget,
                'smartcharts--loading': isLoading,
                'smartcharts--has-markers': children && children.length,
                [`smartcharts-${containerWidth}`]: !isMobile,
            })}
        >
            <div
                className={classNames({
                    'smartcharts-mobile': isMobile,
                    'smartcharts-desktop': !isMobile,
                })}
            >
                <div className='cq-context' ref={rootRef}>
                    <div
                        className={classNames({
                            [`cq-chart-control-${position}`]: hasPosition,
                            'cq-chart-control-bottom': !hasPosition,
                        })}
                    >
                        <div className='ciq-chart-area'>
                            <div className={classNames('ciq-chart', { 'closed-chart': isChartClosed })}>
                                <RenderInsideChart at='holder'>
                                    {barriers.map((barr: any, idx: any) => (
                                        <Barrier
                                            key={`barrier-${idx}`} // eslint-disable-line react/no-array-index-key
                                            {...barr}
                                        />
                                    ))}
                                </RenderInsideChart>
                                <RenderInsideChart at='subholder'>
                                    {!isCandle && !isSpline && isHighestLowestMarkerEnabled && <HighestLowestMarker />}
                                </RenderInsideChart>
                                <RenderInsideChart at='subholder' hideInScrollToEpoch>
                                    {children}
                                </RenderInsideChart>
                                <RenderInsideChart at='subholder'>
                                    <PaginationLoader />
                                </RenderInsideChart>
                                <div className='cq-top-ui-widgets'>
                                    <TopWidgets />
                                </div>
                                <div className='chartContainer' style={{ height: chartContainerHeight }}>
                                    <Crosshair />
                                </div>
                                {enabledNavigationWidget && <NavigationWidget onCrosshairChange={onCrosshairChange} />}
                                {toolbarWidget && <ToolbarWidget />}
                                {!isChartAvailable && (
                                    <div className='cq-chart-unavailable'>
                                        {t.translate('Chart data is not available for this symbol.')}
                                    </div>
                                )}
                                <BottomWidgetsContainer>
                                    <BottomWidget bottomWidgets={bottomWidgets} />
                                </BottomWidgetsContainer>
                            </div>
                            {chartControlsWidgets !== null && !enabledChartFooter && (
                                <ChartControls widgets={chartControlsWidgets} />
                            )}
                            {enabledChartFooter && <ChartFooter />}
                            <Loader />
                        </div>
                    </div>
                </div>
                <DrawToolsSettingsDialog />
                <AggregateChartSettingsDialog />
                <StudySettingsDialog />
                <div id='smartcharts_modal' className='ciq-modal' />
            </div>
        </div>
    );
};

export default connect(({ chart, drawTools, studies, chartSetting, chartType, state, loader }: TMainStore) => ({
    chartId: chart.chartId,
    init: chart.init,
    destroy: chart.destroy,
    StudySettingsDialog: studies.StudySettingsDialog,
    DrawToolsSettingsDialog: drawTools.DrawToolsSettingsDialog,
    AggregateChartSettingsDialog: chartType.AggregateChartSettingsDialog,
    isCandle: chartType.isCandle,
    isChartAvailable: chart.isChartAvailable,
    isSpline: chartType.isSpline,
    updateProps: state.updateProps,
    chartContainerHeight: chart.chartContainerHeight,
    containerWidth: chart.containerWidth,
    isChartClosed: state.isChartClosed,
    theme: chartSetting.theme,
    position: chartSetting.position,
    isHighestLowestMarkerEnabled: chartSetting.isHighestLowestMarkerEnabled,
    isLoading: loader.isActive,
}))(Chart);
