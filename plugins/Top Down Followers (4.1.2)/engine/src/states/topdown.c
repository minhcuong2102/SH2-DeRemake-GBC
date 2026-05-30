#pragma bank 255

#include "data/states_defines.h"
#include "states/topdown.h"

#include "actor.h"
#include "camera.h"
#include "collision.h"
#include "data_manager.h"
#include "game_time.h"
#include "input.h"
#include "trigger.h"
#include "math.h"
#include "vm.h"

#ifndef INPUT_TOPDOWN_INTERACT
#define INPUT_TOPDOWN_INTERACT INPUT_A
#endif

UBYTE topdown_grid;
UBYTE topdown_followers;
upoint16_t pos1;
upoint16_t pos2;
upoint16_t pos3;
upoint16_t pos4;

void topdown_init(void) BANKED {
    camera_offset_x = 0;
    camera_offset_y = 0;
    camera_deadzone_x = 0;
    camera_deadzone_y = 0;

    pos4 = PLAYER.pos;
    pos3 = PLAYER.pos;
    pos2 = PLAYER.pos;
    pos1 = PLAYER.pos;

    if (topdown_followers >= 1) {
        actors[1].pos = PLAYER.pos;
    }
    if (topdown_followers >= 2) {
        actors[2].pos = PLAYER.pos;
    }
    if (topdown_followers >= 3) {
        actors[3].pos = PLAYER.pos;
    }

    if (topdown_grid == 16) {
        // Snap to 16px grid
        PLAYER.pos.x = SUBPX_SNAP_TILE16(PLAYER.pos.x);
        PLAYER.pos.y = SUBPX_SNAP_TILE16(PLAYER.pos.y) + TILE_TO_SUBPX(1);
    } else {
        PLAYER.pos.x = SUBPX_SNAP_TILE(PLAYER.pos.x);
        PLAYER.pos.y = SUBPX_SNAP_TILE(PLAYER.pos.y);
    }
}

void topdown_update(void) BANKED {
    actor_t *hit_actor;
    UBYTE tile_start, tile_end;
    direction_e new_dir = DIR_NONE;
    static UWORD max_pos = 0;

    // Move followers towards their target positions
    if (topdown_followers >= 1) {
        if (actors[1].pos.x + 256 < pos2.x) {
            actors[1].pos.x += PLAYER.move_speed;
            actor_set_dir(&actors[1], DIR_RIGHT, TRUE);
        } else if (actors[1].pos.x - 256 > pos2.x) {
            actors[1].pos.x -= PLAYER.move_speed;
            actor_set_dir(&actors[1], DIR_LEFT, TRUE);
        } else if (actors[1].pos.y + 256 < pos2.y) {
            actors[1].pos.y += PLAYER.move_speed;
            actor_set_dir(&actors[1], DIR_DOWN, TRUE);
        } else if (actors[1].pos.y - 256 > pos2.y) {
            actors[1].pos.y -= PLAYER.move_speed;
            actor_set_dir(&actors[1], DIR_UP, TRUE);
        }
    }
    if (topdown_followers >= 2) {
        if (actors[2].pos.x < pos3.x) {
            actors[2].pos.x += PLAYER.move_speed;
            actor_set_dir(&actors[2], DIR_RIGHT, TRUE);
        } else if (actors[2].pos.x > pos3.x) {
            actors[2].pos.x -= PLAYER.move_speed;
            actor_set_dir(&actors[2], DIR_LEFT, TRUE);
        } else if (actors[2].pos.y < pos3.y) {
            actors[2].pos.y += PLAYER.move_speed;
            actor_set_dir(&actors[2], DIR_DOWN, TRUE);
        } else if (actors[2].pos.y > pos3.y) {
            actors[2].pos.y -= PLAYER.move_speed;
            actor_set_dir(&actors[2], DIR_UP, TRUE);
        }
    }
    if (topdown_followers >= 3) {
        if (actors[3].pos.x < pos4.x) {
            actors[3].pos.x += PLAYER.move_speed;
            actor_set_dir(&actors[3], DIR_RIGHT, TRUE);
        } else if (actors[3].pos.x > pos4.x) {
            actors[3].pos.x -= PLAYER.move_speed;
            actor_set_dir(&actors[3], DIR_LEFT, TRUE);
        } else if (actors[3].pos.y < pos4.y) {
            actors[3].pos.y += PLAYER.move_speed;
            actor_set_dir(&actors[3], DIR_DOWN, TRUE);
        } else if (actors[3].pos.y > pos4.y) {
            actors[3].pos.y -= PLAYER.move_speed;
            actor_set_dir(&actors[3], DIR_UP, TRUE);
        }
    }

    // Is player on an 8x8px tile?
    if ((topdown_grid == 16 && ON_16PX_GRID(PLAYER.pos)) ||
        (topdown_grid == 8 && ON_8PX_GRID(PLAYER.pos))) {
        // Player landed on a tile
        // so stop movement for now
        player_moving = FALSE;

        // Player finished moving, update pos1
        pos1 = PLAYER.pos;

        // Check for trigger collisions
        if (trigger_activate_at_intersection(&PLAYER.bounds, &PLAYER.pos, FALSE)) {
            // Landed on a trigger
            return;
        }

        // Check input to set player movement
        if (INPUT_RECENT_LEFT) {
            player_moving = TRUE;
            new_dir = DIR_LEFT;

            // Check for collisions to left of player
            tile_start = SUBPX_TO_TILE(PLAYER.pos.y + PLAYER.bounds.top);
            tile_end   = SUBPX_TO_TILE(PLAYER.pos.y + PLAYER.bounds.bottom);
            UBYTE tile_x = SUBPX_TO_TILE(PLAYER.pos.x + PLAYER.bounds.left);
            if (tile_col_test_range_y(COLLISION_RIGHT, tile_x - 1, tile_start, tile_end)) {
                player_moving = FALSE;
            }
        } else if (INPUT_RECENT_RIGHT) {
            player_moving = TRUE;
            new_dir = DIR_RIGHT;

            // Check for collisions to right of player
            tile_start = SUBPX_TO_TILE(PLAYER.pos.y + PLAYER.bounds.top);
            tile_end   = SUBPX_TO_TILE(PLAYER.pos.y + PLAYER.bounds.bottom);
            UBYTE tile_x = SUBPX_TO_TILE(PLAYER.pos.x + PLAYER.bounds.right);
            if (tile_col_test_range_y(COLLISION_LEFT, tile_x + 1, tile_start, tile_end)) {
                player_moving = FALSE;
            }
        } else if (INPUT_RECENT_UP) {
            player_moving = TRUE;
            new_dir = DIR_UP;

            // Check for collisions above player
            tile_start = SUBPX_TO_TILE(PLAYER.pos.x + PLAYER.bounds.left);
            tile_end   = SUBPX_TO_TILE(PLAYER.pos.x + PLAYER.bounds.right);
            UBYTE tile_y = SUBPX_TO_TILE(PLAYER.pos.y + PLAYER.bounds.top);
            if (tile_col_test_range_x(COLLISION_BOTTOM, tile_y - 1, tile_start, tile_end)) {
                player_moving = FALSE;
            }
        } else if (INPUT_RECENT_DOWN) {
            player_moving = TRUE;
            new_dir = DIR_DOWN;

            // Check for collisions below player
            tile_start = SUBPX_TO_TILE(PLAYER.pos.x + PLAYER.bounds.left);
            tile_end   = SUBPX_TO_TILE(PLAYER.pos.x + PLAYER.bounds.right);
            UBYTE tile_y = SUBPX_TO_TILE(PLAYER.pos.y + PLAYER.bounds.bottom);
            if (tile_col_test_range_x(COLLISION_TOP, tile_y + 1, tile_start, tile_end)) {
                player_moving = FALSE;
            }
        }

        // Update direction animation
        if (new_dir != DIR_NONE) {
            actor_set_dir(&PLAYER, new_dir, player_moving);
        } else {
            actor_set_anim_idle(&PLAYER);
        }

        // Check for actor overlap
        hit_actor = actor_overlapping_player();
        if (hit_actor != NULL && (hit_actor->collision_group & COLLISION_GROUP_MASK)) {
            player_register_collision_with(hit_actor);
        }

        // Check if walked in to actor
        if (player_moving) {
            hit_actor = actor_in_front_of_player(topdown_grid, FALSE);
            if (hit_actor != NULL) {
                player_register_collision_with(hit_actor);
                actor_stop_anim(&PLAYER);
                player_moving = FALSE;
            }
        }

        // If player is moving, update follower position chain
        if (player_moving) {
            pos4 = pos3;
            pos3 = pos2;
            pos2 = pos1;
        }

        // Update follower idle animations when player stops
        if (!player_moving) {
            if (topdown_followers >= 1) {
                actor_set_anim_idle(&actors[1]);
            }
            if (topdown_followers >= 2) {
                actor_set_anim_idle(&actors[2]);
            }
            if (topdown_followers >= 3) {
                actor_set_anim_idle(&actors[3]);
            }
        }

        if (INPUT_PRESSED(INPUT_TOPDOWN_INTERACT)) {
            hit_actor = actor_with_script_in_front_of_player(topdown_grid);
            if (hit_actor != NULL && !(hit_actor->collision_group & COLLISION_GROUP_MASK)) {
                actor_set_dir(hit_actor, FLIPPED_DIR(PLAYER.dir), FALSE);
                player_moving = FALSE;
                if (hit_actor->script.bank) {
                    script_execute(hit_actor->script.bank, hit_actor->script.ptr, 0, 1, 0);
                }
            }
        }

        // Calculate max position for movement clamping
        UBYTE tile_offset = (topdown_grid == 16) ? 2 : 1;
        if (PLAYER.dir == DIR_RIGHT) {
            max_pos = TILE_TO_SUBPX(SUBPX_TO_TILE(PLAYER.pos.x) + tile_offset);
        } else if (PLAYER.dir == DIR_LEFT) {
            max_pos = TILE_TO_SUBPX(SUBPX_TO_TILE(PLAYER.pos.x) - tile_offset);
        } else if (PLAYER.dir == DIR_DOWN) {
            max_pos = TILE_TO_SUBPX(SUBPX_TO_TILE(PLAYER.pos.y) + tile_offset);
        } else if (PLAYER.dir == DIR_UP) {
            max_pos = TILE_TO_SUBPX(SUBPX_TO_TILE(PLAYER.pos.y) - tile_offset);
        }
    }

    if (player_moving) {
        point_translate_dir(&PLAYER.pos, PLAYER.dir, PLAYER.move_speed);

        // Clamp to grid
        if (PLAYER.dir == DIR_RIGHT) {
            if (PLAYER.pos.x > max_pos) {
                PLAYER.pos.x = max_pos;
            }
        } else if (PLAYER.dir == DIR_LEFT) {
            if (PLAYER.pos.x < max_pos) {
                PLAYER.pos.x = max_pos;
            } else if (max_pos == 0 && PLAYER.pos.x >= (UWORD_MAX - PLAYER.move_speed)) {
                PLAYER.pos.x = 0;
            }
        } else if (PLAYER.dir == DIR_DOWN) {
            if (PLAYER.pos.y > max_pos) {
                PLAYER.pos.y = max_pos;
            }
        } else if (PLAYER.dir == DIR_UP) {
            if (PLAYER.pos.y < max_pos) {
                PLAYER.pos.y = max_pos;
            } else if (max_pos == 0 && PLAYER.pos.y >= (UWORD_MAX - PLAYER.move_speed)) {
                PLAYER.pos.y = 0;
            }
        }
    }
}
