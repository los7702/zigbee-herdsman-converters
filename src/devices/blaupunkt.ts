import * as fz from "../converters/fromZigbee";
import * as tz from "../converters/toZigbee";
import * as exposes from "../lib/exposes";
import * as reporting from "../lib/reporting";
import type {DefinitionWithExtend} from "../lib/types";

const e = exposes.presets;
const ea = exposes.access;

export const definitions: DefinitionWithExtend[] = [
    {
        zigbeeModel: ["SCM-2_00.00.03.15", "SCM-R_00.00.03.15TC", "SCM_00.00.03.14TC", "SCM_00.00.03.05TC"],
        model: "SCM-S1",
        vendor: "Blaupunkt",
        description: "Roller shutter",
        fromZigbee: [fz.cover_position_via_brightness, fz.cover_state_via_onoff],
        toZigbee: [tz.cover_via_brightness],
        configure: async (device, coordinatorEndpoint) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ["genLevelCtrl"]);
            try {
                await reporting.brightness(endpoint);
            } catch {
                // Some version don't support this: https://github.com/Koenkk/zigbee2mqtt/issues/4246
            }
        },
        exposes: [e.cover_position().setAccess("state", ea.ALL)],
    },
];
