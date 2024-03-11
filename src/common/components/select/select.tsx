import { ReactElement, useCallback, useEffect, useMemo, useState } from "react"
import { useBoolean } from '../../hooks';

import styles from './styles.module.css';
import { classNames, throttle } from "../../helpers";
import arrow from '../../../assets/icons/arrow.svg';

export type OptionItem = {
  value: string|number;
  label: ReactElement|string;
  onClick: () => void;
  data: unknown;
};

export type SelectProps = {
  currentValue: string|number;
  options: OptionItem[];
  onScroll?: (e: React.UIEvent<HTMLElement>) => void;
  transformChosenOption?: (option: OptionItem) => string|ReactElement;
  visibleItems?: number;
  itemHeight?: number;
  placeholder?: string;
}

const defaultTransformChosenOption = (currentOption: OptionItem) => currentOption.label;

const DEFAULT_ITEM_HEIGHT = 32;
const DEFAULT_VISIBLE_ITEMS = 5;
const DEFAULT_PLACEHOLDER = 'Please select an option...';

export const Select = ({
  currentValue,
  options,
  onScroll,
  transformChosenOption = defaultTransformChosenOption,
  visibleItems = DEFAULT_VISIBLE_ITEMS,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  placeholder = DEFAULT_PLACEHOLDER
}: SelectProps) => {
  const {
    value: isOpen,
    toggle: toggleDropdown
  } = useBoolean(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const saveScrollPosition = useCallback(
    throttle((optionsList: HTMLElement) => {
      setScrollPosition(optionsList.scrollTop);
    }, 100),
    [setScrollPosition]
  );

  const [startRenderIndex, setStartRenderIndex] = useState(0);

  useEffect(() => {
    setStartRenderIndex(
      Math.max(
        Math.floor(scrollPosition / itemHeight) - visibleItems,
        0
      )
    );
  }, [scrollPosition, itemHeight, visibleItems]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    // @ts-ignore: Unreachable code error
    saveScrollPosition(e.target as HTMLElement);
    isOpen && onScroll?.(e);
  }, [onScroll, saveScrollPosition, isOpen]);

  const currentOption = options.find(({ value }) => value === currentValue);
  const currentLabel = (currentOption && transformChosenOption(currentOption)) || placeholder;

  const optionsList = useMemo(() => {
    const endRenderIndex = Math.min(startRenderIndex + visibleItems * 3, options.length);

    return options.slice(startRenderIndex, endRenderIndex).map(({ label, value, onClick }, i) => {
      const itemYOffset = (startRenderIndex + i) * itemHeight;
      return (
        <div
          style={{ transform: `translateY(${itemYOffset}px)`, height: `${itemHeight}px` }}
          key={value}
          onClick={onClick}
          className={classNames([
            styles.Select__Option,
            [styles.Select__Option_selected, value === currentValue]
          ])}
        >
          {label}
        </div>
      )
    });
  }, [startRenderIndex, currentValue, options, itemHeight, visibleItems]);

  const optionsListStyles = useMemo(() => ({ height: `${itemHeight * options.length}px` }), [options.length]);

  return (
    <div
      className={classNames([
        styles.Select,
        [styles.Select_opened, isOpen]
      ])}
      onClick={() => toggleDropdown()}
    >
      <div
        className={classNames([
          styles.Select__Current,
          [styles.Select__Current_opened, isOpen]
        ])}
      >
        {currentLabel}
        <img src={arrow} className={styles.Select__Arrow} alt="arrow" />
      </div>
      <div
        onScroll={handleScroll}
        className={classNames([
          styles.Select__OptionsContainer,
          [styles.Select__OptionsContainer_opened, isOpen]
        ])}
      >
        {isOpen && (
          <div
            className={styles.Select__OptionsList}
            style={optionsListStyles}
          >
            {optionsList}
          </div>
        )}
      </div>
    </div>
  );
};
