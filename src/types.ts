import type { ButtonProps, InputProps, Placement } from "@chakra-ui/react";
import type { Dayjs } from "dayjs";
import type { Ref } from "react";

export interface DatePickerProps {
  cancelButtonProps?: ButtonProps;
  cancelText?: string;
  colorScheme?: string;
  currentLangKey?: "en" | "zh" | "zh_cn";
  defaultValue?: string | number | Dayjs;
  disableTimestampAfter?: number | false;
  disableTimestampBefore?: number | false;
  format?: string;
  isDisabled?: boolean;
  okButtonProps?: ButtonProps;
  okText?: string;
  onCancel?: (day: Dayjs) => void;
  onChange?: (formattedDay: string, day: Dayjs) => void;
  onOk?: (day: Dayjs) => void;
  picker?: "anniversary" | "date";
  showCancelButton?: boolean;
  showOkButton?: boolean;
  showSelectableDays?: boolean;
  showTimeSelector?: boolean;
  size?: "sm" | "md" | "lg";
  selectableDays?: {
    format: string;
    text: string;
    timestamp: number | Dayjs;
  }[];
  value?: Dayjs | null;
}

export interface DatePickerInputProps extends DatePickerProps {
  allowClear?: boolean;
  clearText?: string;
  datePickerDefaultIsOpen?: boolean;
  datePickerIsOpen?: boolean;
  inputProps?: InputProps;
  isInvalid?: boolean;
  name?: string;
  onBlur?: (formattedValue: string, value: Dayjs) => void;
  onClear?: (formattedValue: string, value: Dayjs) => void;
  onFocus?: (formattedValue: string, value: Dayjs) => void;
  placeholder?: string;
  placement?: Placement;
  ref?: Ref<any>;
  wrapPortal?: boolean;
}
