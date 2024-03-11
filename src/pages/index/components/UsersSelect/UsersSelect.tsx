import { memo, useCallback, useMemo, useState } from "react";
import { AsyncSelect } from "../../../../common/components/async-select";
import { PLACEHOLDER, USERS_URL } from "../../../../common/constants";
import { OptionItem } from "../../../../common/components/select";
import { UsersItemResponse, UsersResponse } from "../../../../types";
import { UsersSelectLabel } from "./UsersSelectLabel";

export const UsersSelect = memo(() => {
  const [currentValue, setCurrentValue] = useState(0);

  const fetchOptions = useMemo(() => ({ limit: 50, page: 1 }), []);
  const transformResponseToOptions = useCallback((data: unknown): OptionItem[] =>
    (data as UsersResponse).data
      .map((userItem: UsersItemResponse) => ({
        value: userItem.id,
        data: userItem,
        label: <UsersSelectLabel {...userItem} />,
        onClick: () => setCurrentValue(userItem.id)
      })), []);

  const transformChosenOption = useCallback(
    (data: OptionItem) => {
      const { first_name, last_name, job } = data.data as UsersItemResponse;
      return `${first_name} ${last_name}, ${job}`;
    }   
  , []);

  return (
    <AsyncSelect
      fetchURL={USERS_URL}
      fetchOptions={fetchOptions}
      transformResponseToOptions={transformResponseToOptions}
      transformChosenOption={transformChosenOption}
      currentValue={currentValue}
      placeholder={PLACEHOLDER.SELECT_USER}
    />
  );
});
