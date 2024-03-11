import { useCallback, useEffect, useState } from "react";
import { Select, OptionItem } from "../select";
import { debounce, loadResource } from "../../helpers";
import { SelectProps } from "../select/select";

export type AsyncSelectProps = Omit<SelectProps, 'options'> & {
  fetchURL: string;
  fetchOptions?: Record<string, string|number>
  transformResponseToOptions: (data: unknown) => OptionItem[];
}

export const AsyncSelect = ({
  fetchURL,
  fetchOptions,
  transformResponseToOptions,
  ...props
}: AsyncSelectProps) => {
  const [ currentPage, setCurrentPage ] = useState(fetchOptions?.page || 1);
  const [ options, setOptions ] = useState<OptionItem[]>([]);

  useEffect(() => {
    loadResource(fetchURL, { ...fetchOptions, page: currentPage  })
      .then((data) => transformResponseToOptions(data))
      .then((newOptions) => setOptions(options.concat(newOptions)))
      .catch((e) => console.error(e));
  }, [currentPage, fetchOptions, fetchURL, transformResponseToOptions]);

  const handleScroll = useCallback(
    debounce(
      (e: React.UIEvent<HTMLElement>) => {
        const optionsContainerEl = e.target as HTMLElement;
        const isAtTheBottom = Math.abs(optionsContainerEl.scrollHeight - optionsContainerEl.scrollTop - optionsContainerEl.clientHeight) < 1;
        if (isAtTheBottom) {
          setCurrentPage((pageNumber) => +pageNumber + 1);
        }
      },
      150
    )
  , []);

  return (
    <Select
      options={options}
      onScroll={handleScroll}
      {...props}
    />
  );
};
