import dayjs, { Dayjs, isDayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useRef,
  Ref,
} from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaRegCalendar,
  FaTimesCircle,
} from "react-icons/fa";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  ButtonProps,
  Placement,
  InputProps,
} from "@chakra-ui/react";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

const _disabled = {
  backgroundColor: "gray.50",
  color: "gray.200",
  cursor: "not-allowed",
};

export interface DatePickerProps {
  format?: string;
  value?: Dayjs | null;
  onChange?: (formattedValue: string, value: Dayjs) => void;
  picker?: "anniversary" | "date";
  defaultValue?: string | number | Dayjs;
  showTimeSelector?: boolean;
  colorScheme?: string;
  selectableDays?: {
    text: string;
    timestamp: number | Dayjs;
    format: string;
  }[];
  disableTimestampBefore?: number | false;
  disableTimestampAfter?: number | false;
  isDisabled?: boolean;
  showSelectableDays?: boolean;
  size?: "sm" | "md" | "lg";
  showOkButton?: boolean;
  okButtonProps?: ButtonProps;
  onOk?: (selectedTimeObj: Dayjs) => void;
  okText?: string;
  showCancelButton?: boolean;
  cancelButtonProps?: ButtonProps;
  onCancel?: (selectedTimeObj: Dayjs) => void;
  cancelText?: string;
  currentLangKey?: "en" | "zh" | "zh_cn";
  isInvalid?: boolean;
}

export interface DatePickerInputProps extends DatePickerProps {
  placeholder?: string;
  name?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: (formattedValue: string, value: Dayjs) => void;
  placement?: Placement;
  datePickerIsOpen?: boolean;
  datePickerDefaultIsOpen?: boolean;
  ref?: Ref<any>;
  inputProps?: InputProps;
  allowClear?: boolean;
  wrapPortal?: boolean;
}

const defaultProps: DatePickerProps = {
  onChange: () => {
    return;
  },
  showTimeSelector: false,
  format: "YYYY-MM-DD",
  colorScheme: "primary",
  selectableDays: [
    {
      text: "Today",
      timestamp: dayjs().startOf("date"),
      format: "MM-DD HH:mm",
    },
  ],
  isDisabled: false,
  disableTimestampBefore: false,
  disableTimestampAfter: false,
  showSelectableDays: false,
  size: "md",
  showOkButton: false,
  okButtonProps: {},
  onOk: () => {
    return;
  },
  okText: "OK",
  showCancelButton: false,
  cancelButtonProps: {},
  onCancel: () => {
    return;
  },
  cancelText: "Cancel",
  currentLangKey: "zh",
  isInvalid: false,
};

const componentSize = {
  md: {
    monthAndYear: { fontSize: "md", padding: "0 5px 0 0" },
    dateBox: {
      w: 300,
      padding: "10px",
    },
    dateButton: {
      w: 35,
      h: 35,
    },
    iconButton: {
      w: 35,
      h: 35,
    },
    selectableDayButton: {
      w: "90%",
      h: "35px",
    },
    timeBox: {
      w: 250,
      // w: 600, // debug
      padding: "10px",
    },
    selectedTime: {
      fontSize: 14,
      margin: "10px",
    },
    timeLabel: {
      fontSize: 14,
      margin: "10px",
    },
    timeSelectFlex: {
      h: "210px",
    },
    timeSelectBox: {
      margin: "0 10px",
    },
    timeSelectButton: {
      w: "51px",
      h: "30px",
    },
    datepickerInput: {
      size: "md",
    },
    okButton: {
      size: "sm",
    },
    cancelButton: {
      size: "sm",
    },
  },
  sm: {
    monthAndYear: { fontSize: "sm", padding: "0 5px 0 0" },
    dateBox: {
      w: 250,
      padding: "3px",
    },
    dateButton: {
      w: 30,
      h: 25,
    },
    iconButton: {
      w: 25,
      h: 25,
    },
    selectableDayButton: {
      w: "90%",
      h: "25px",
    },
    timeBox: {
      w: 200,
      padding: "3px",
    },
    selectedTime: {
      fontSize: 14,
      margin: "5px",
    },
    timeLabel: {
      fontSize: 13,
      margin: "3px",
    },
    timeSelectFlex: {
      h: "170px",
    },
    timeSelectBox: {
      margin: "0 8px",
    },
    timeSelectButton: {
      w: "30px",
      h: "25px",
    },
    datepickerInput: {
      size: "sm",
    },
    okButton: {
      size: "xs",
    },
    cancelButton: {
      size: "xs",
    },
  },
};

export const DatePicker: React.FC<DatePickerProps> = ({
  picker,
  defaultValue,
  value,
  onChange,
  showTimeSelector,
  format,
  colorScheme,
  selectableDays,
  disableTimestampBefore,
  disableTimestampAfter,
  isDisabled: disabled,
  showSelectableDays,
  size,
  showOkButton,
  okButtonProps,
  onOk,
  okText,
  showCancelButton,
  cancelButtonProps,
  onCancel,
  cancelText,
  currentLangKey,
}) => {
  const timeUnit: dayjs.OpUnitType[] = ["hour", "minute", "second"];
  const timeFormat = ["HH", "mm", "ss"];

  const now = useRef(dayjs()).current;

  useEffect(() => {
    switch (currentLangKey) {
      case "en":
        now.locale("en");
        break;
      case "zh":
        now.locale("zh");
        break;
      case "zh_cn":
        now.locale("zh-cn");
        break;
      default:
        now.locale("en");
        break;
    }
  }, [currentLangKey, now]);

  if (format) dayjs().format(format);
  if (picker === "anniversary") {
    disableTimestampBefore = now.startOf("year").valueOf();
    disableTimestampAfter = now.endOf("year").valueOf();
  }

  // const numWeeks = Math.ceil((curr.daysInMonth() + curr.day()) / 7);
  const numWeeks = 6;

  const [curr, setCurr] = useState(now.startOf("month"));
  const [selectedDate, setSelectedDate] = useState<Dayjs>(undefined);
  const [selectedTime, setSelectedTime] = useState<{
    hour: number;
    minute: number;
    second: number;
  }>({
    hour: undefined,
    minute: undefined,
    second: undefined,
  });

  const [view, setView] = useState("datetime");

  const recentTenYear = (() => {
    let nearestTenYear = curr.startOf("year");
    while (nearestTenYear.year() % 10 !== 0) {
      nearestTenYear = nearestTenYear.subtract(1, "year");
    }
    return nearestTenYear;
  })();

  const defaultValueRef = useRef(defaultValue).current;

  useEffect(() => {
    if (defaultValueRef) {
      let dayjsValue = dayjs(defaultValueRef);
      if (picker === "anniversary") dayjsValue = dayjsValue.year(now.year());
      setCurr(dayjsValue.startOf("month"));
      setSelectedDate(dayjsValue.startOf("date"));
      setSelectedTime({
        hour: dayjsValue.hour(),
        minute: dayjsValue.minute(),
        second: dayjsValue.second(),
      });
    }
  }, [defaultValueRef, now, picker]);

  useEffect(() => {
    if (value) {
      let dayjsValue = dayjs(value);
      if (picker === "anniversary") dayjsValue = dayjsValue.year(now.year());
      setCurr(dayjsValue.startOf("month"));
      setSelectedDate(dayjsValue.startOf("date"));
      setSelectedTime({
        hour: dayjsValue.hour(),
        minute: dayjsValue.minute(),
        second: dayjsValue.second(),
      });
    }
  }, [now, picker, value]);

  const selectedTimeObj = useMemo(() => {
    if (value) return isDayjs(value) ? value : dayjs(value);
    let returnDate = selectedDate ?? undefined;
    if (returnDate) {
      if (selectedTime?.hour) returnDate = returnDate.hour(selectedTime.hour);
      if (selectedTime?.minute)
        returnDate = returnDate.minute(selectedTime.minute);
      if (selectedTime?.second)
        returnDate = returnDate.second(selectedTime.second);
    }
    return returnDate;
  }, [selectedDate, selectedTime, value]);

  const updateAndCheckTimeIsDisabled = useCallback(() => {
    const updateFunc = (datetime, funcName) => {
      if (datetime) {
        const newTime = { ...selectedTime };
        // console.log(funcName, newTime, selectedTime, selectedTimeObj);
        if (selectedTimeObj.hour(newTime?.hour ?? 0)[funcName](datetime))
          newTime.hour = Number(datetime.hour());
        if (
          selectedTimeObj
            .hour(newTime?.hour ?? 0)
            .minute(newTime?.minute ?? 0)
            [funcName](datetime)
        )
          newTime.minute = Number(datetime.minute());
        if (
          selectedTimeObj
            .hour(newTime?.hour ?? 0)
            .minute(newTime?.minute ?? 0)
            .second(newTime?.second ?? 0)
            [funcName](datetime)
        )
          newTime.second = Number(datetime.second());
        return newTime;
      }
    };
    let newTimeBeforeDisable = { ...selectedTime },
      newTimeAfterDisable = { ...selectedTime };
    if (disableTimestampBefore)
      newTimeBeforeDisable = updateFunc(
        dayjs(disableTimestampBefore),
        "isBefore"
      );
    if (disableTimestampAfter)
      newTimeAfterDisable = updateFunc(dayjs(disableTimestampAfter), "isAfter");
    let newTime = null;
    if (
      newTimeBeforeDisable?.hour !== selectedTime?.hour ||
      newTimeBeforeDisable?.minute !== selectedTime?.minute ||
      newTimeBeforeDisable?.second !== selectedTime?.second
    )
      newTime = newTimeBeforeDisable;
    if (
      newTimeAfterDisable?.hour !== selectedTime?.hour ||
      newTimeAfterDisable?.minute !== selectedTime?.minute ||
      newTimeAfterDisable?.second !== selectedTime?.second
    )
      newTime = newTimeAfterDisable;

    if (newTime) {
      if (value) {
        const result = dayjs(value)
          .hour(newTime.hour)
          .minute(newTime.minute)
          .second(newTime.second);
        onChange(result.format(format), result);
      }
      setSelectedTime(newTime);
    }
  }, [
    disableTimestampAfter,
    disableTimestampBefore,
    onChange,
    format,
    selectedTime,
    selectedTimeObj,
    value,
  ]);

  const onDateClick = (d) => {
    if (value) {
      const returnDate = dayjs(value)
        .year(d.year())
        .month(d.month())
        .date(d.date());
      onChange(returnDate.format(format), returnDate);
      return;
    }
    setSelectedDate(d);
    setSelectedTime((prevState) => {
      const newState = prevState;
      if (newState.hour === undefined) newState.hour = 0;
      if (newState.minute === undefined) newState.minute = 0;
      if (newState.second === undefined) newState.second = 0;
      return newState;
    });
  };

  const onTimeClick = (unit, item) => {
    if (value) {
      onChange(value[unit](item).format(format), dayjs(value)[unit](item));
      return;
    }
    setSelectedTime((prevState) => ({ ...prevState, [unit]: item }));
  };

  const onClickSelectableDays = (day) => {
    if (value) {
      onChange(day.format(format), day);
      return;
    }
    setSelectedDate(day);
    setSelectedTime({
      hour: day.get("hour"),
      minute: day.get("minute"),
      second: day.get("second"),
    });
    setCurr(day.startOf("month"));
  };

  const selectableDayIsDisabled = useCallback(
    (day) => {
      if (disableTimestampBefore && disableTimestampAfter) {
        return !day.isBetween(disableTimestampBefore, disableTimestampAfter);
      } else {
        if (disableTimestampBefore) {
          return !day.isSameOrAfter(disableTimestampBefore);
        }
        if (disableTimestampAfter)
          return !day.isSameOrBefore(disableTimestampAfter);
      }
      return false;
    },
    [disableTimestampAfter, disableTimestampBefore]
  );

  useEffect(() => {
    if (selectedDate && selectedTime) updateAndCheckTimeIsDisabled();
  }, [updateAndCheckTimeIsDisabled, selectedDate, selectedTime]);

  useEffect(() => {
    if (selectedTimeObj) {
      if (value) return;
      // console.log("datepicker selectedTimeObj onChange")
      onChange(selectedTimeObj.format(format), selectedTimeObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeObj]);

  return (
    <Box
      zIndex={300}
      p={4}
      w="fit-content"
      h="100%"
      boxShadow="none"
      _hover={{ boxShadow: "none" }}
      display="flex"
      padding="0"
      userSelect="none"
    >
      <Box
        w={componentSize[size].dateBox.w}
        padding={componentSize[size].dateBox.padding}
        h="100%"
      >
        <Flex alignItems="center">
          {!(picker === "anniversary" && view === "month") && (
            <IconButton
              aria-label="previous"
              isDisabled={
                picker === "anniversary" &&
                curr.subtract(1, "month").isBefore(now.startOf("year"))
              }
              icon={
                view === "month" ? (
                  <FaAngleLeft />
                ) : view === "year" ? (
                  <FaAngleDoubleLeft />
                ) : (
                  <FaArrowLeft />
                )
              }
              w={componentSize[size].iconButton.w}
              h={componentSize[size].iconButton.h}
              variant="ghost"
              colorScheme={colorScheme}
              onClick={() => {
                if (view === "year")
                  return setCurr((curr) => curr.subtract(10, "year"));
                if (view === "month")
                  return setCurr((curr) => curr.subtract(1, "year"));
                return setCurr((curr) => curr.subtract(1, "month"));
              }}
            />
          )}
          <Flex
            w="100%"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            flex={1}
            mx={2}
            fontSize={componentSize[size].monthAndYear.fontSize}
            fontWeight="bold"
            fontFamily="Roboto Slab"
            color={`${colorScheme}.700`}
            display="flex"
          >
            <Box
              padding={componentSize[size].monthAndYear.padding}
              cursor="pointer"
              transition="color 0.25s"
              _hover={{ color: `${colorScheme}.200` }}
              onClick={() => {
                setView("month");
              }}
            >
              {view === "datetime" && curr.format("MMM")}
            </Box>
            {picker !== "anniversary" && (
              <Box
                padding={componentSize[size].monthAndYear.padding}
                cursor="pointer"
                transition="color 0.25s"
                _hover={{ color: `${colorScheme}.200` }}
                onClick={() => {
                  setView("year");
                }}
              >
                {view === "year"
                  ? `${recentTenYear.format("YYYY")}-${recentTenYear
                      .add(9, "year")
                      .format("YYYY")}`
                  : curr.format("YYYY")}
              </Box>
            )}
          </Flex>
          {!(picker === "anniversary" && view === "month") && (
            <IconButton
              aria-label="next"
              isDisabled={
                picker === "anniversary" &&
                curr.add(1, "month").isAfter(now.endOf("year"))
              }
              icon={
                view === "month" ? (
                  <FaAngleRight />
                ) : view === "year" ? (
                  <FaAngleDoubleRight />
                ) : (
                  <FaArrowRight />
                )
              }
              w={componentSize[size].iconButton.w}
              h={componentSize[size].iconButton.h}
              variant="ghost"
              colorScheme={colorScheme}
              onClick={() => {
                if (view === "year")
                  return setCurr((curr) => curr.add(10, "year"));
                if (view === "month")
                  return setCurr((curr) => curr.add(1, "year"));
                return setCurr((curr) => curr.add(1, "month"));
              }}
            />
          )}
        </Flex>

        {view === "month" && (
          <Flex h="100%">
            <Box h="100%">
              {[...new Array(12).keys()].map((i) => {
                const month = curr.month(i).startOf("month");
                const isSelected = selectedDate
                  ? selectedDate.isSame(month, "month")
                  : false;
                const isDisabled =
                  (disableTimestampBefore &&
                    month.startOf("month").valueOf() <
                      dayjs(disableTimestampBefore)
                        .startOf("month")
                        .valueOf()) ||
                  (disableTimestampAfter &&
                    month.endOf("month").valueOf() >
                      dayjs(disableTimestampAfter).endOf("month").valueOf());
                return (
                  <Button
                    display="inline"
                    key={i}
                    w="31%"
                    h={50}
                    alignItems="center"
                    justifyContent="center"
                    colorScheme={colorScheme}
                    variant={isSelected ? "solid" : "ghost"}
                    padding={0}
                    margin="2px"
                    {...(!isSelected && { fontWeight: "normal" })}
                    {...(month.isSame(now, "month") && {
                      border: "1px solid grey",
                    })}
                    onClick={() => {
                      setCurr(month);
                      setView("datetime");
                    }}
                    isDisabled={isDisabled}
                    _disabled={_disabled}
                    {...(isDisabled && { _hover: {} })}
                  >
                    {month.format("MMM")}
                  </Button>
                );
              })}
            </Box>
          </Flex>
        )}

        {view === "year" && (
          <Flex h="100%">
            <Box h="100%">
              {[...new Array(12).keys()].map((i) => {
                const year = recentTenYear
                  .subtract(1, "year")
                  .add(i, "year")
                  .endOf("year");
                const isSelected = selectedDate
                  ? selectedDate.isSame(year, "year")
                  : false;
                const isDisabled =
                  (disableTimestampBefore &&
                    year.startOf("year").valueOf() <
                      dayjs(disableTimestampBefore)
                        .startOf("year")
                        .valueOf()) ||
                  (disableTimestampAfter &&
                    year.endOf("year").valueOf() >
                      dayjs(disableTimestampAfter).endOf("year").valueOf());
                return (
                  <Button
                    display="inline"
                    key={i}
                    w="31%"
                    h={50}
                    alignItems="center"
                    justifyContent="center"
                    colorScheme={colorScheme}
                    variant={isSelected ? "solid" : "ghost"}
                    padding="0"
                    margin="2px"
                    {...(!isSelected && { fontWeight: "normal" })}
                    {...(!year.isBetween(
                      recentTenYear,
                      recentTenYear.add(10, "year")
                    ) && { color: "gray.400" })}
                    {...(year.isSame(now, "year") && {
                      border: "1px solid grey",
                    })}
                    onClick={() => {
                      setCurr(year);
                      setView("month");
                    }}
                    isDisabled={isDisabled}
                    _disabled={_disabled}
                    {...(isDisabled && { _hover: {} })}
                  >
                    {year.format("YYYY")}
                  </Button>
                );
              })}
            </Box>
          </Flex>
        )}

        {view === "datetime" && (
          <Box>
            <Flex mt={1}>
              {[...new Array(7).keys()].map((i) => (
                <Box
                  key={i}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w={componentSize[size].dateButton.w}
                  h={componentSize[size].dateButton.h}
                  fontSize="sm"
                  color={`${colorScheme}.500`}
                  fontWeight="bold"
                  textAlign="center"
                  margin="2px"
                >
                  {now.day(i).format("dd")}
                </Box>
              ))}
            </Flex>
            <Flex flexWrap="wrap">
              {[...new Array(numWeeks * 7).keys()].map((i) => {
                const d = curr.subtract(curr.day(), "day").add(i, "day");
                const isSelected = selectedDate
                  ? d.isSame(selectedDate, "date")
                  : false;
                const isDisabled =
                  disabled ||
                  (disableTimestampBefore &&
                    d.isBefore(disableTimestampBefore, "day")) ||
                  (disableTimestampAfter &&
                    d.isAfter(disableTimestampAfter, "day"));
                return (
                  <Button
                    isDisabled={isDisabled}
                    _disabled={_disabled}
                    {...(isDisabled && { _hover: {} })}
                    alignItems="center"
                    justifyContent="center"
                    key={i}
                    w={componentSize[size].dateButton.w}
                    h={componentSize[size].dateButton.h}
                    fontWeight="bold"
                    variant={isSelected ? "solid" : "ghost"}
                    colorScheme={colorScheme}
                    minW={15}
                    margin="2px"
                    {...(!d.isSame(curr, "month") && { color: "gray.400" })}
                    {...(d.isSame(now, "date") && { border: "1px solid grey" })}
                    {...(!isSelected && { fontWeight: "normal" })}
                    onClick={() => {
                      onDateClick(d);
                    }}
                  >
                    {d.date()}
                  </Button>
                );
              })}
            </Flex>
            <Flex w="-webkit-fill-available" marginTop="10px">
              {showSelectableDays && (
                <Box w="100%">
                  {selectableDays?.map((item, i) => {
                    const day = dayjs(item.timestamp);
                    const isDisabled = disabled || selectableDayIsDisabled(day);
                    return (
                      <Button
                        isDisabled={isDisabled}
                        _disabled={_disabled}
                        w={componentSize[size].selectableDayButton.w}
                        h={componentSize[size].selectableDayButton.h}
                        key={i}
                        margin="2px 4%"
                        onClick={() => {
                          onClickSelectableDays(day);
                        }}
                      >
                        {`${item.text} | ${day.format(item.format || format)}`}
                      </Button>
                    );
                  })}
                </Box>
              )}
            </Flex>
            <Flex w="-webkit-fill-available" marginTop="10px">
              {(showCancelButton || showOkButton) && (
                <Box w="100%" margin="2px 4%">
                  {!!showCancelButton && (
                    <Button
                      colorScheme="red"
                      size={componentSize[size].cancelButton.size}
                      onClick={() => onCancel(selectedTimeObj)}
                      {...cancelButtonProps}
                    >
                      {cancelText}
                    </Button>
                  )}
                  {!!showOkButton && (
                    <Button
                      isDisabled={!selectedTimeObj}
                      float="right"
                      colorScheme="blue"
                      size={componentSize[size].okButton.size}
                      onClick={() => onOk(selectedTimeObj)}
                      {...okButtonProps}
                    >
                      {okText}
                    </Button>
                  )}
                </Box>
              )}
            </Flex>
          </Box>
        )}
      </Box>

      {showTimeSelector && (
        <Box
          w={componentSize[size].timeBox.w}
          padding={componentSize[size].timeBox.padding}
        >
          <Flex>
            <Flex
              w="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={`${colorScheme}.700`}
              fontWeight="bold"
              textAlign="center"
              margin={componentSize[size].selectedTime.margin}
              fontSize={componentSize[size].selectedTime.fontSize}
            >
              {selectedTimeObj
                ? selectedTimeObj.format(format)
                : currentLangKey === "en"
                ? "Please select date and time"
                : "請選擇日期和時間"}
            </Flex>
          </Flex>
          <Flex mt={1}>
            {[
              ...(currentLangKey === "en"
                ? ["Hour", "Min", "Sec"]
                : ["時", "分", "秒"]),
            ].map((item, i) => (
              <Flex
                key={i}
                w="33%"
                display="block"
                alignItems="center"
                justifyContent="center"
                color={`${colorScheme}.500`}
                fontWeight="bold"
                textAlign="center"
                margin={componentSize[size].timeLabel.margin}
                fontSize={componentSize[size].timeLabel.fontSize}
              >
                {item}
              </Flex>
            ))}
          </Flex>
          <Flex mt={1} h={componentSize[size].timeSelectFlex.h}>
            {[new Array(24), new Array(60), new Array(60)].map((Array, i) => {
              return (
                <Box
                  key={i}
                  w="33%"
                  display="block"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  overflowY="auto"
                  overflowX="hidden"
                  margin={componentSize[size].timeSelectBox.margin}
                >
                  {/* <Selector /> */}
                  {[...Array.keys()].map((timeValue, j) => {
                    let time = selectedTimeObj ? selectedTimeObj : now;
                    time = time[timeUnit[i]](timeValue);
                    if (
                      disableTimestampBefore &&
                      time.isSame(disableTimestampBefore, "date")
                    )
                      // time.endOf("hour").hour(timeValue)
                      time = time.endOf(timeUnit[i])[timeUnit[i]](timeValue);
                    if (
                      disableTimestampAfter &&
                      time.isSame(disableTimestampAfter, "date")
                    )
                      time = time.startOf(timeUnit[i])[timeUnit[i]](timeValue);

                    const isSelected = selectedTime
                      ? selectedTime[timeUnit[i]] === timeValue
                      : false;
                    const isDisabled =
                      disabled ||
                      ((disableTimestampBefore || disableTimestampAfter) &&
                        !selectedDate) ||
                      (disableTimestampBefore &&
                        time.isBefore(disableTimestampBefore)) ||
                      (disableTimestampAfter &&
                        time.isAfter(disableTimestampAfter));
                    return (
                      <Button
                        isDisabled={isDisabled}
                        _disabled={_disabled}
                        w={componentSize[size].timeSelectButton.w}
                        h={componentSize[size].timeSelectButton.h}
                        _focus={{}}
                        margin="0"
                        padding="0"
                        borderRadius="0"
                        key={j}
                        display="block"
                        variant={isSelected ? "solid" : "ghost"}
                        colorScheme={colorScheme}
                        {...(!isSelected && { fontWeight: "normal" })}
                        onClick={() => {
                          onTimeClick(timeUnit[i], timeValue);
                        }}
                      >
                        {time.format(timeFormat[i])}
                        {/* debug */}
                        {/* {time.format("YYYY-MM-DD HH:mm:ss")} */}
                      </Button>
                    );
                  })}
                </Box>
              );
            })}
          </Flex>
        </Box>
      )}
    </Box>
  );
};

// DatePicker.propTypes = propsValidation;
DatePicker.defaultProps = defaultProps;

const PortalWrapper: React.FC<{ isWrapped?: boolean }> = ({
  isWrapped,
  children,
}) => {
  return isWrapped ? <Portal>{children}</Portal> : <>{children}</>;
};

// eslint-disable-next-line react/display-name
export const DatePickerInput: React.FC<DatePickerInputProps> = forwardRef(
  (
    {
      defaultValue,
      value,
      onChange,
      showTimeSelector,
      format,
      colorScheme,
      selectableDays,
      disableTimestampBefore,
      disableTimestampAfter,
      isDisabled,
      showSelectableDays,
      size,
      showOkButton,
      okButtonProps,
      onOk,
      okText,
      showCancelButton,
      cancelButtonProps,
      onCancel,
      cancelText,
      datePickerIsOpen,
      datePickerDefaultIsOpen,
      picker,
      placeholder,
      name,
      onFocus,
      onBlur,
      onClear,
      placement,
      currentLangKey,
      inputProps,
      isInvalid,
      allowClear = true,
      wrapPortal,
    },
    ref
  ) => {
    const [selectedDay, setSelectedDay] = useState("");

    const localOnChange = (dateString, date) => {
      setSelectedDay(dateString);
      onChange(dateString, date);
    };

    const defaultValueRef = useRef(defaultValue).current;

    const isValidDate = (d) => !!dayjs(d)?.valueOf();

    useEffect(() => {
      if (defaultValueRef) {
        const date = dayjs(defaultValueRef);
        setSelectedDay(isValidDate(date) ? date.format(format) : "");
      } else {
        setSelectedDay("");
      }
    }, [defaultValueRef, format]);

    useEffect(() => {
      if (value) {
        const date = dayjs(value);
        setSelectedDay(isValidDate(date) ? date.format(format) : "");
      } else {
        setSelectedDay("");
      }
    }, [value, format]);

    const valueIsValid = useMemo(() => isValidDate(value), [value]);

    return (
      <Popover
        isOpen={datePickerIsOpen}
        defaultIsOpen={datePickerDefaultIsOpen}
        placement={placement}
        isLazy
      >
        <InputGroup size={componentSize[size].datepickerInput.size}>
          <PopoverTrigger>
            <Input
              name={name}
              onFocus={onFocus}
              onBlur={onBlur}
              ref={ref}
              value={selectedDay}
              type="text"
              isDisabled={isDisabled}
              isReadOnly={true}
              placeholder={placeholder}
              size={componentSize[size].datepickerInput.size}
              {...inputProps}
              isInvalid={isInvalid}
              errorBorderColor="red.500"
            />
          </PopoverTrigger>
          {allowClear && (
            <InputRightElement zIndex={selectedDay === "" ? -1 : 1}>
              <IconButton
                aria-label="clear"
                icon={
                  selectedDay === "" ? <FaRegCalendar /> : <FaTimesCircle />
                }
                size={componentSize[size].datepickerInput.size}
                cursor={selectedDay === "" && "default !important"}
                isDisabled={isDisabled || selectedDay === ""}
                color="gray.500"
                variant="link"
                _focus={{ boxShadow: 0 }}
                onClick={() => {
                  localOnChange("", null);
                  onClear("", null);
                }}
              ></IconButton>
            </InputRightElement>
          )}
        </InputGroup>

        <PortalWrapper isWrapped={wrapPortal}>
          <PopoverContent zIndex={4} minW="fit-content" w="auto">
            <PopoverBody padding="3px">
              <DatePicker
                picker={picker}
                defaultValue={selectedDay}
                format={format}
                onChange={localOnChange}
                value={valueIsValid ? value : null}
                selectableDays={selectableDays}
                showSelectableDays={showSelectableDays}
                showTimeSelector={showTimeSelector}
                disableTimestampBefore={disableTimestampBefore}
                disableTimestampAfter={disableTimestampAfter}
                size={size}
                showOkButton={showOkButton}
                okButtonProps={okButtonProps}
                onOk={onOk}
                okText={okText}
                showCancelButton={showCancelButton}
                cancelButtonProps={cancelButtonProps}
                onCancel={onCancel}
                cancelText={cancelText}
                currentLangKey={currentLangKey}
              />
            </PopoverBody>
          </PopoverContent>
        </PortalWrapper>
      </Popover>
    );
  }
);

DatePickerInput.defaultProps = {
  placeholder: "",
  name: null,
  onFocus: () => {
    return;
  },
  onBlur: () => {
    return;
  },
  onClear: () => {
    return;
  },
  ...defaultProps,
};

export default DatePicker;
