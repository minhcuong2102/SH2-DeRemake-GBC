const l10n = require("../helpers/l10n").default;

export const id = "EVENT_RESET_DECK_DATA";
export const groups = ["Deck Management"];
export const name = "Reset Deck Data";

export const fields = [
	{
		type: "value",
		key: "eventDeckSize",
		label: "Deck Size",
		width: "50%",
		defaultValue: {
			type: "number",
			value: 10,
		},
	  },
];

export const compile = (input, helpers) => {
	const { _callNative, _declareLocal, _stackPush, _stackPop, variableSetToScriptValue} = helpers;

	const tmpSize = _declareLocal("tmp_size", 1, true);
    variableSetToScriptValue(tmpSize, input.eventDeckSize);
    _stackPush(tmpSize);

	_callNative("deck_action_wipe");
	
	//End
	_stackPop(1);
};