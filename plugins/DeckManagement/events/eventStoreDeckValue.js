const l10n = require("../helpers/l10n").default;

export const id = "EVENT_STORE_DECK_VALUE";
export const groups = ["Deck Management"];
export const name = "Store Deck Value from Index";

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
  type: "group",
  fields: [
	{
		label: "Save in:",
	},
	{
		key: "save_var",
		type: "variable",
		defaultValue: "LAST_VARIABLE",
    },
		],
  },

];

export const compile = (input, helpers) => {
	const { _callNative, _stackPush, _stackPushConst, _stackPop, variableSetToScriptValue, _declareLocal, _setVariable } = helpers;

  _stackPushConst(0); //Prevents Addition

	const tmpIndex = _declareLocal("tmp_index", 1, true);
    variableSetToScriptValue(tmpIndex, input.eventDeckIndex);
    _stackPush(tmpIndex);

	_callNative("deck_action_returnvalue");
	_setVariable(input.save_var, ".ARG1");
	
	//End
	_stackPop(2);
};