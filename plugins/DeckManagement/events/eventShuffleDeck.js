const l10n = require("../helpers/l10n").default;

export const id = "EVENT_SHUFFLE_DECK";
export const groups = ["Deck Management"];
export const name = "Shuffle Deck Values";

export const fields = [
    {
    },
  ];

export const compile = (input, helpers) => {
	const { _callNative } = helpers;

    _callNative("deck_action_shuffle");
};