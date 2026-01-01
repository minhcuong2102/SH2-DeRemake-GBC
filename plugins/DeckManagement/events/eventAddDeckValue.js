const l10n = require("../helpers/l10n").default;

export const id = "EVENT_ADD_DECK_VALUE";
export const groups = ["Deck Management"];
export const name = "Add Deck Value to Index";

export const fields = [

    {
        key: "eventDeckIndex",
        label: "Index for Deck Slot",
        type: "value",
            width: "50%",
            defaultValue: {
                type: "number",
                value: 0,
            },
    },

    {
        key: "eventDeckValue",
        label: "Value to Add at Slot",
        type: "value",
            width: "50%",
            defaultValue: {
                type: "number",
                value: 0,
            },
    },
];

export const compile = (input, helpers) => {
    const { _callNative, 
        _declareLocal, 
        _stackPush, 
        _stackPop, 
        variableSetToScriptValue } = helpers;
    
        const tmpValue = _declareLocal("tmp_value", 1, true);
        variableSetToScriptValue(tmpValue, input.eventDeckValue);
        _stackPush(tmpValue);
    
        const tmpIndex = _declareLocal("tmp_index", 1, true);
        variableSetToScriptValue(tmpIndex, input.eventDeckIndex);
        _stackPush(tmpIndex);
    
        _callNative("deck_action_add");
    
        _stackPop(2);
};