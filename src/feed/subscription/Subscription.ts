import { TicksHistoryRequest, TicksHistoryResponse, TicksStreamResponse } from '@deriv/api-types';
import EventEmitter from 'event-emitter-es6';
import { OHLCStreamResponse, TQuote } from 'src/types';
import { TickHistoryFormatter } from '../TickHistoryFormatter';

class Subscription {
    _binaryApi: any;
    _emitter: EventEmitter;
    _request: TicksHistoryRequest;
    _stx: any;
    lastStreamEpoch?: number;
    static get EVENT_CHART_DATA() {
        return 'EVENT_CHART_DATA';
    }

    constructor(request: TicksHistoryRequest, api: any, stx: any) {
        this._binaryApi = api;
        this._stx = stx;
        this._request = request;
        this._emitter = new EventEmitter({ emitDelay: 0 });
    }

    async initialFetch() {
        const quotes = await this._startSubscribe(this._request);

        return quotes;
    }

    pause() {}

    async resume() {
        if (this.lastStreamEpoch) {
            const tickHistoryRequest = {
                ...this._request,
                start: this.lastStreamEpoch,
            };

            const quotes = await this._startSubscribe(tickHistoryRequest);

            return quotes;
        }
    }

    forget() {
        this.lastStreamEpoch = undefined;
        this._emitter.off(Subscription.EVENT_CHART_DATA);
    }

    async _startSubscribe(request: TicksHistoryRequest): Promise<TQuote[]> {
        throw new Error('Please override!');
    }

    _processHistoryResponse(response: TicksHistoryResponse) {
        if (response.error) {
            throw response.error;
        }

        const quotes = TickHistoryFormatter.formatHistory(response);

        if (!quotes) {
            const message = `Unexpected response: ${response}`;
            throw new Error(message);
        }

        this.lastStreamEpoch = Subscription.getLatestEpoch(response);

        return quotes;
    }

    onChartData(callback: any) {
        this._emitter.on(Subscription.EVENT_CHART_DATA, callback);
    }

    static getLatestEpoch({ candles, history }: TicksHistoryResponse) {
        if (candles) {
            return candles[candles.length - 1].epoch;
        }

        if (history) {
            const { times = [] } = history;
            return times[times.length - 1];
        }
    }

    static getEpochFromTick(response: TicksStreamResponse | OHLCStreamResponse) {
        if ('tick' in response && response.tick) {
            return response.tick.epoch as number;
        }
        return (response as OHLCStreamResponse).ohlc.open_time;
    }
}

export default Subscription;
