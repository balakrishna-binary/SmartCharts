import React from 'react';
import classNames from 'classnames';
import { FavoriteIcon } from './Icons';
import FavoriteStore from '../store/FavoriteStore';
import { logEvent, LogCategories, LogActions } from '../utils/ga';

type TFavoriteProps = {
    category: string;
    id: string;
};

const Favorite: React.FC<TFavoriteProps> = ({ category, id }) => {
    const [store] = React.useState(FavoriteStore.getInstance());
    const [is_favorite, setFavorite] = React.useState(false);

    const onClick = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            // @ts-ignore
            e.nativeEvent.isHandledByDialog = true; // prevent close dialog
            store.toggleFavorite(category, id);
        },
        [store, category, id]
    );
    const onFavoriteUpdate = React.useCallback(() => {
        const isFavorite = store.isFavorite(category, id);
        if (isFavorite !== is_favorite) {
            setFavorite(isFavorite);
            logEvent(LogCategories.CategoricalDisplay, LogActions.Favorite, `${isFavorite ? 'Add ' : 'Remove '} ${id}`);
        }
    }, [store, category, id, is_favorite]);

    React.useEffect(() => {
        if (store && store.onFavoriteUpdate) {
            store.onFavoriteUpdate(onFavoriteUpdate);
            setFavorite(store.isFavorite(category, id));
        }
    }, [store, category, id, onFavoriteUpdate]);

    return !category || !id ? null : (
        <FavoriteIcon
            onClick={onClick}
            className={classNames('ciq-favorite', {
                'ciq-active-favorite': is_favorite,
            })}
        />
    );
};

export default Favorite;
