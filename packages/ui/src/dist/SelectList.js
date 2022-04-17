import React from "react";
import RNPickerSelect from "./PickerSelect";
import { Unifier } from "./Unifier";
export class SelectList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { showing: false };
    }
    render() {
        return (React.createElement(RNPickerSelect, { placeholder: {}, style: {
                viewContainer: {
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 50,
                    width: "100%",
                    // Add padding so the border doesn't mess up layouts
                    paddingHorizontal: 6,
                    paddingVertical: 4,
                    borderColor: Unifier.theme.gray,
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: Unifier.theme.white,
                },
            }, items: this.props.options, onValueChange: this.props.onChange, value: this.props.value }));
    }
}
//# sourceMappingURL=SelectList.js.map