#pragma bank 255

#include <string.h>
#include <stdlib.h>
#include <gbdk/platform.h>
#include "system.h"
#include "vm.h"
#include "gbs_types.h"
#include "events.h"
#include "math.h"
#include <rand.h>

UBYTE deck_index;
UBYTE deck_value;
UBYTE deck_max = 10;
UBYTE i;
#define DECK_SIZE 60  //Define the maximum size of the deck
static UBYTE deck[DECK_SIZE];

void deck_action_shuffle(void) BANKED
{
    for (i = deck_max - 1; i > 0; i--)
    {
        UBYTE r = randw() % (i + 1);  //Random index within the remaining range

        // Swap deck[i] with deck[r]
        UBYTE temp = deck[i];
        deck[i] = deck[r];
        deck[r] = temp;
    }
}

void deck_action_wipe(SCRIPT_CTX * THIS) OLDCALL BANKED
{
    //Set
    deck_max = *(UBYTE*)VM_REF_TO_PTR(FN_ARG0);
    if (deck_max > DECK_SIZE)
    {
        deck_max = DECK_SIZE;
    }
	for (i = 0; i < deck_max; i++) {
        deck[i] = 0;
    }
}

void deck_action_returnvalue(SCRIPT_CTX * THIS) OLDCALL BANKED
{
	deck_index = *(UBYTE*)VM_REF_TO_PTR(FN_ARG0);
    if (deck_index < deck_max)
    {
	    deck_value = deck[deck_index];
        *(UBYTE*)VM_REF_TO_PTR(FN_ARG1) = deck_value;
    }
}

void deck_action_add(SCRIPT_CTX * THIS) OLDCALL BANKED
{
    deck_index = *(UBYTE*)VM_REF_TO_PTR(FN_ARG0);
    if (deck_index < deck_max)
    {
        deck[deck_index] = *(UBYTE*)VM_REF_TO_PTR(FN_ARG1);
    }
}