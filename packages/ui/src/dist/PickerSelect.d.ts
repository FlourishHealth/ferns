import PropTypes from "prop-types";
import React, { PureComponent } from "react";
declare const defaultStyles: {
    viewContainer: {
        alignSelf: "stretch";
    };
    iconContainer: {
        position: "absolute";
        right: number;
    };
    modalViewTop: {
        flex: number;
    };
    modalViewMiddle: {
        height: number;
        flexDirection: "row";
        justifyContent: "space-between";
        alignItems: "center";
        paddingHorizontal: number;
        backgroundColor: string;
        borderTopWidth: number;
        borderTopColor: string;
        zIndex: number;
    };
    chevronContainer: {
        flexDirection: "row";
    };
    chevron: {
        width: number;
        height: number;
        backgroundColor: string;
        borderColor: string;
        borderTopWidth: number;
        borderRightWidth: number;
    };
    chevronUp: {
        marginLeft: number;
        transform: ({
            translateY: number;
            rotate?: undefined;
        } | {
            rotate: string;
            translateY?: undefined;
        })[];
    };
    chevronDown: {
        marginLeft: number;
        transform: ({
            translateY: number;
            rotate?: undefined;
        } | {
            rotate: string;
            translateY?: undefined;
        })[];
    };
    chevronActive: {
        borderColor: string;
    };
    done: {
        color: string;
        fontWeight: "600";
        fontSize: number;
        paddingTop: number;
        paddingRight: number;
    };
    doneDepressed: {
        fontSize: number;
    };
    modalViewBottom: {
        justifyContent: "center";
        backgroundColor: string;
    };
    placeholder: {
        color: string;
    };
    headlessAndroidPicker: {
        position: "absolute";
        width: string;
        height: string;
        color: string;
        opacity: number;
    };
};
export default class RNPickerSelect extends PureComponent<any, any> {
    static propTypes: {
        onValueChange: PropTypes.Validator<(...args: any[]) => any>;
        items: PropTypes.Validator<(PropTypes.InferProps<{
            label: PropTypes.Validator<string>;
            value: PropTypes.Validator<any>;
            inputLabel: PropTypes.Requireable<string>;
            key: PropTypes.Requireable<React.ReactText>;
            color: PropTypes.Requireable<string>;
        }> | null | undefined)[]>;
        value: PropTypes.Requireable<any>;
        placeholder: PropTypes.Requireable<PropTypes.InferProps<{
            label: PropTypes.Requireable<string>;
            value: PropTypes.Requireable<any>;
            key: PropTypes.Requireable<React.ReactText>;
            color: PropTypes.Requireable<string>;
        }>>;
        disabled: PropTypes.Requireable<boolean>;
        itemKey: PropTypes.Requireable<React.ReactText>;
        style: PropTypes.Requireable<PropTypes.InferProps<{}>>;
        children: PropTypes.Requireable<any>;
        onOpen: PropTypes.Requireable<(...args: any[]) => any>;
        useNativeAndroidPickerStyle: PropTypes.Requireable<boolean>;
        fixAndroidTouchableBug: PropTypes.Requireable<boolean>;
        doneText: PropTypes.Requireable<string>;
        onDonePress: PropTypes.Requireable<(...args: any[]) => any>;
        onUpArrow: PropTypes.Requireable<(...args: any[]) => any>;
        onDownArrow: PropTypes.Requireable<(...args: any[]) => any>;
        onClose: PropTypes.Requireable<(...args: any[]) => any>;
        modalProps: PropTypes.Requireable<PropTypes.InferProps<{}>>;
        textInputProps: PropTypes.Requireable<PropTypes.InferProps<{}>>;
        pickerProps: PropTypes.Requireable<PropTypes.InferProps<{}>>;
        touchableDoneProps: PropTypes.Requireable<PropTypes.InferProps<{}>>;
        touchableWrapperProps: PropTypes.Requireable<PropTypes.InferProps<{}>>;
        Icon: PropTypes.Requireable<(...args: any[]) => any>;
        InputAccessoryView: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        value: undefined;
        placeholder: {
            label: string;
            value: null;
            color: string;
        };
        disabled: boolean;
        itemKey: null;
        style: {};
        children: null;
        useNativeAndroidPickerStyle: boolean;
        fixAndroidTouchableBug: boolean;
        doneText: string;
        onDonePress: null;
        onUpArrow: null;
        onDownArrow: null;
        onOpen: null;
        onClose: null;
        modalProps: {};
        textInputProps: {};
        pickerProps: {};
        touchableDoneProps: {};
        touchableWrapperProps: {};
        Icon: null;
        InputAccessoryView: null;
    };
    inputRef: any;
    static handlePlaceholder({ placeholder }: any): any[];
    static getSelectedItem({ items, key, value }: any): {
        selectedItem: any;
        idx: any;
    };
    constructor(props: any);
    componentDidUpdate: (prevProps: any, prevState: any) => void;
    onUpArrow(): void;
    onDownArrow(): void;
    onValueChange(value: any, index: any): void;
    onOrientationChange({ nativeEvent }: any): void;
    setInputRef(ref: any): void;
    getPlaceholderStyle(): any;
    triggerOpenCloseCallbacks(): void;
    togglePicker(animate?: boolean, postToggleCallback?: any): void;
    renderPickerItems(): any;
    renderInputAccessoryView(): JSX.Element;
    renderIcon(): JSX.Element | null;
    renderTextInputOrChildren(): JSX.Element;
    renderIOS(): JSX.Element;
    renderAndroidHeadless(): JSX.Element;
    renderAndroidNativePickerStyle(): JSX.Element;
    renderWeb(): JSX.Element;
    render(): JSX.Element;
}
export { defaultStyles };
