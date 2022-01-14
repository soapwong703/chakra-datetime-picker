# chakra-datetime-picker

A Datetimepicker Component designed for Chakra-UI

# Installation

```sh
npm i chakra-datetime-picker

# or

yarn add chakra-datetime-picker
```

# Description

This component utilize dayjs to support date and datetime input with Chakra-UI style

# Props

## DatePicker

| Props                  | Type                                                            | Description                                                                                                            |
| ---------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| cancelButtonProps      | ButtonProps                                                     | Props of the cancel button                                                                                             |
| cancelText             | string                                                          | Text of the cancel button                                                                                              |
| colorScheme            | string                                                          | Color Scheme of the DatePicker Component                                                                               |
| currentLangKey         | "en" \| "zh" \| "zh_cn"                                         | localization key of dayjs, used to localize dayjs                                                                      |
| defaultValue           | string \| number \| Dayjs                                       | Default Value of the DatePicker                                                                                        |
| disableTimestampAfter  | number \| false                                                 | Any datetime after this value will be disabled                                                                         |
| disableTimestampBefore | number \| false                                                 | Any datetime before this value will be disabled                                                                        |
| format                 | string                                                          | formatter of dayjs                                                                                                     |
| isDisabled             | boolean                                                         | Control is DatePicker disabled                                                                                         |
| okButtonProps          | ButtonProps                                                     | Props of the ok button                                                                                                 |
| okText                 | string                                                          | Text of the ok button                                                                                                  |
| onCancel               | (day: Dayjs) => void                                            | Action when click cancel button                                                                                        |
| onChange               | (formattedDay: string, day: Dayjs) => void                      | Action when select date                                                                                                |
| onOk                   | (day: Dayjs) => void                                            | Action when click Ok button                                                                                            |
| picker                 | "anniversary" \| "date"                                         | Type of the DatePicker. "anniversary" type can select month and date only. "date" type can select year, month and date |
| showCancelButton       | boolean                                                         | Display control of the cancel button                                                                                   |
| showOkButton           | boolean                                                         | Display control of the ok button                                                                                       |
| showSelectableDays     | boolean                                                         | Display control of the Selectable days                                                                                 |
| showTimeSelector       | boolean                                                         | Display control of the Time Selector                                                                                   |
| size                   | "sm" \| "md" \| "lg                                             | Size of the DatePicker Component                                                                                       |
| selectableDays         | { format: string; text: string; timestamp: number \| Dayjs } [] | Presets of dates. Can set display format and text.                                                                     |
| value                  | Dayjs \| null                                                   | Date Value of the Component                                                                                            |

## DatePickerInput

Includes all props of DatePicker

| Props                   | Type                                           | Description                                           |
| ----------------------- | ---------------------------------------------- | ----------------------------------------------------- |
| allowClear              | boolean                                        | Display control of the clear button                   |
| datePickerDefaultIsOpen | boolean                                        | Control the DatePicker component is opened by default |
| datePickerIsOpen        | boolean                                        | Control the DatePicker component is opened            |
| inputProps              | InputProps                                     | Props of Chakra Input                                 |
| isInvalid               | boolean                                        | Control is DatePickerInput invalid                    |
| name                    | string                                         | Name of the DatePickerInput element                   |
| onBlur                  | () => void                                     | Action when DatePickerInput out of focus              |
| onClear                 | (formattedValue: string, value: Dayjs) => void | Action when clear button is clicked                   |
| onFocus                 | () => void                                     | Action then DatePickerInput in focus                  |
| placeholder             | string                                         | Placeholder of DatePickerInput                        |
| ref                     | Ref<any>                                       | Ref forward to DatePickerInput                        |
| wrapPortal              | boolean                                        | Is DatePicker Wrapped by a Portal to document.body    |

# v2

A major overhaul of the current DatePicker is planned. The new version will includes updated UI, performance improve, and tidy up the component props.
